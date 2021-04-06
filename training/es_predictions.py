from simpletransformers.classification import ClassificationModel, ClassificationArgs
import pandas as pd
import logging
import torch
import random
import wandb
import os
import time
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
    exesModel = None
    onesModel = None
    predictionQueue = []
    esBulkUpdateQueue = []
    maxBulkUpdateQueueSize = 1000
    maxPredictionQueueSize = 2000
    totalProcessed = 0

    def updateScore(self, id, score, fieldName="relevanceScore"):
        doc = {
            f"{fieldName}": score
        }

        self.esBulkUpdateQueue.append(
             {
                '_op_type': 'update',
                '_index': "urls",
                '_id': id,
                'doc': doc
        })
        #es.update(index="urls", id=id, body=update)
        print(f"Updated {fieldName} {id} relevance to {score}")

        if len(self.esBulkUpdateQueue)>=self.maxBulkUpdateQueueSize:
            self.pump_es_update_queue()

    def pump_es_update_queue(self):
        if len(self.esBulkUpdateQueue)>0:
            helpers.bulk(es, self.esBulkUpdateQueue)
            self.esBulkUpdateQueue = []

    def pump_prediction_queue(self):
        if len(self.predictionQueue)>0:
            ids = []
            paragraphs = []
            for predictFor in self.predictionQueue:
                ids.append(predictFor.get("id"))
                paragraphs.append(predictFor.get("paragraph"))

            exesPredictions, tmpA = self.exesModel.predict(paragraphs)
            onesPredictions, tmpB = self.onesModel.predict(paragraphs)

            if len(exesPredictions)!=len(paragraphs):
                raise Exception("len(exesPredictions)!=len(paragraphs)")

            for i in range(len(ids)):
                if exesPredictions[i]==0:
                    self.updateScore(ids[i], 0)
                else:
                    if onesPredictions[i]==1:
                        self.updateScore(ids[i], 1)
                    else:
                        self.updateScore(ids[i], 3)

            self.predictionQueue = []

    def process_es_hit(self, hit):
        id = hit["_id"]
        source = hit["_source"]
        paragraph = source.get("paragraph").lower().strip()
        topic = source.get("topic")

        #print(f"Processing {id} - {topic}")

        self.predictionQueue.append({ "id": id, "paragraph": paragraph })

        if len(self.predictionQueue)>=self.maxPredictionQueueSize:
            self.pump_prediction_queue()

    def predict_all_for_topic(self, topic):
        print(f"Predicting for {topic}")

        #relevanceFilter = [{"relevanceScore": {"value": {"gte": 0 }}}]
        #onlyNotRatedFilter = [{"relevanceScore": {"value": -1 }}]
        query={
            "query": {
                "bool": {
                    "must": [
                        { "match": { "topic": topic } },
                        { "match": { "relevanceScore": -1 } }
                    ]
                 }
             }
        }


        hits = helpers.scan(es, index="urls", query=query, size=1000)

        for hit in hits:
            self.process_es_hit(hit)

        self.pump_prediction_queue()
        self.pump_es_update_queue()

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




