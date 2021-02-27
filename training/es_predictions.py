from simpletransformers.classification import ClassificationModel, ClassificationArgs
import pandas as pd
import logging
import torch
import random
import wandb
import os
import shutil
import pathlib
import gc
from GPUtil import showUtilization as gpu_usage
from numba import cuda
import sys

from elasticsearch import Elasticsearch, helpers, exceptions

logging.basicConfig(level=logging.INFO)
transformers_logger = logging.getLogger("transformers")
transformers_logger.setLevel(logging.WARNING)

es_url = os.environ['AC_ANALYTICS_ES_URL'] if os.environ.get('AC_ANALYTICS_ES_URL')!=None else 'localhost:9200'
es = Elasticsearch(es_url)

class EsPredictions:
    exesModel = None;
    onesModel = None;

    def updateRelevanceScore(self, id, score):
        update = {
            "doc": {
                "relevanceScore": score
                }
            }
        es.update(index="urls", id=id, body=update)
        print(f"Updated {id} relevance to {score}")

    def process_es_hit(self, hit):
        print("Processing hit {hit}")
        id = hit["_id"]
        source = hit["_source"]
        paragraph = source.get("paragraph")
        relevanceScore = source.get("relevanceScore")
        topic = source.get("topic")

        print(f"Processing {id} - {topic}")

        exesPredictions, rawExesOutputs = self.exesModel.predict(paragraph)

        if exesPredictions[0]==0:
            self.updateRelevanceScore(id, 0)
        else:
            onesPredictions, rawOnesOutputs = self.onesModel.predict(paragraph)
            if onesPredictions[0]==1:
                self.updateRelevanceScore(id, 1)
            else:
                self.updateRelevanceScore(id, 3)

    def predict_all_for_topic(self, topic):
        print(f"Predicting for {topic}")

        #relevanceFilter = [{"relevanceScore": {"value": {"gte": 0 }}}]
        #onlyNotRatedFilter = [{"relevanceScore": {"value": -1 }}]
        query= {
            "query": {
                "match": { "topic": topic }
            }
        }

        query2 = {
            "query": {
                "bool": {
                    "must": {"terms": { "topic": ["Citizen Engagement"] } },
                }
            }
        }

        hits = helpers.scan(es, index="urls", query=query, size=50)

        for hit in hits:
            self.process_es_hit(hit)

        print(f"Found {len( list( hits ))} hits for {topic}")

    def predict_for_topics(self, topics):
        print("Loading exes model")
        self.exesModel = ClassificationModel(
             "bert", "models/binary",  use_cuda = True
        )

        print("Loading ones model")
        self.onesModel = ClassificationModel(
             "bert", "models/binaryOnes",  use_cuda = True
        )

        for topic in topics:
            self.predict_all_for_topic(topic)

topics = ["Citizen Engagement","Income inequality"]
esPredictions = EsPredictions()
esPredictions.predict_for_topics(topics)
