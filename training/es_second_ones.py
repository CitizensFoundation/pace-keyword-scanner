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
import json

from elasticsearch import Elasticsearch, helpers, exceptions

from es_predictions import EsPredictions

logging.basicConfig(level=logging.INFO)
transformers_logger = logging.getLogger("transformers")
transformers_logger.setLevel(logging.WARNING)

es_url = os.environ['AC_ANALYTICS_ES_URL'] if os.environ.get('AC_ANALYTICS_ES_URL')!=None else 'localhost:9200'
es = Elasticsearch(es_url)

hasParagraphsLeft = True


class EsSecondOne(EsPredictions):
    totalProcessedParagraphs = 0

    def updateScore(self, id, score):
         super(EsSecondOne, self).updateScore(id, score, "secondRelevanceScore")

    def predict_all_for_ones_topic(self, topic):
        print(f"Predicting for {topic}")

        #relevanceFilter = [{"relevanceScore": {"value": {"gte": 0 }}}]
        #onlyNotRatedFilter = [{"relevanceScore": {"value": -1 }}]
        query={
            "query": {
                "bool": {
                    "must": [
                        { "match": { "topic": topic } },
                        { "match": { "relevanceScore": 1 } },
                    ],
                    "must_not": [
                        { "exists": {"field": "secondRelevanceScore"} }
                        #{ "match": { "relevanceScore": -1 } }
                    ]
                 }
             }
        }

        hits = helpers.scan(es, index="urls", query=query, size=1000)

        for hit in hits:
            self.process_es_hit(hit)
            self.totalProcessedParagraphs+=1

        self.pump_prediction_queue()
        self.pump_es_update_queue()

    def predict_ones_for_topic(self, options):
        print("Loading exes model")
        self.exesModel = ClassificationModel(
             "bert", "models/binary",  use_cuda = True
        )

        print("Loading ones model")
        self.onesModel = ClassificationModel(
             "bert", f"models/binaryOnesTopic{options.get('modelName')}",  use_cuda = True
        )

        self.predict_all_for_ones_topic(options.get("topic"))

ex_type=Exception
limit=0
wait_ms=1000
wait_increase_ratio=1
attempt = 0

options = json.loads(sys.argv[1])

print(f"In second ones with {options.get('topic')}")
print(options)

secondOpinion = EsSecondOne()

while hasParagraphsLeft:
    try:
        secondOpinion.totalProcessedParagraphs = 0
        secondOpinion.predict_ones_for_topic(options)
        if secondOpinion.totalProcessedParagraphs==0:
            hasParagraphsLeft = False
    except Exception as ex:
        print(ex)
        if not isinstance(ex, ex_type):
            raise ex
        if 0 < limit <= attempt:
            print("no more attempts")
            raise ex

        print("failed execution attempt", attempt)

        attempt += 1
        time.sleep(wait_ms / 1000)
        wait_ms *= wait_increase_ratio



