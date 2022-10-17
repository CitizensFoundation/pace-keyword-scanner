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
from transformers import pipeline

from opensearchpy import OpenSearch, helpers, exceptions

from es_predictions import EsPredictions

logging.basicConfig(level=logging.INFO)
transformers_logger = logging.getLogger("transformers")
transformers_logger.setLevel(logging.WARNING)

es_url = os.environ['AC_ANALYTICS_ES_URL'] if os.environ.get('AC_ANALYTICS_ES_URL')!=None else 'localhost:9200'
es = OpenSearch(es_url)

hasParagraphsLeft = True

class EsSentiment(EsPredictions):
    totalProcessedParagraphs = 0
    sentiment_pipeline = None

    def updateScore(self, id, score):
         super(EsSentiment, self).updateScore(id, score, "sentimentScore")

    def process_es_hit(self, hit):
        id = hit["_id"]
        source = hit["_source"]
        paragraph = source.get("paragraph").strip()

        self.predictionQueue.append({ "id": id, "paragraph": paragraph })

        if len(self.predictionQueue)>=self.maxPredictionQueueSize:
            self.pump_prediction_queue()

    def predict_sentiment(self):
        print(f"Predicting")

        #relevanceFilter = [{"relevanceScore": {"value": {"gte": 0 }}}]
        #onlyNotRatedFilter = [{"relevanceScore": {"value": -1 }}]
        query={
            "query": {
                "bool": {
                    "must": [
#                        { "match": { "topic": topic } },
                         { "match": { "relevanceScore": 1 } },
                    ],
                    "must_not": [
                        #{ "exists": {"field": "secondRelevanceScore"} }
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

    def pump_prediction_queue(self):
        if len(self.predictionQueue)>0:
            ids = []
            paragraphs = []
            for predictFor in self.predictionQueue:
                ids.append(predictFor.get("id"))
                paragraphs.append(predictFor.get("paragraph")[:512])

            sentimentPredictions = self.sentiment_pipeline(paragraphs)

            if len(sentimentPredictions)!=len(paragraphs):
                raise Exception("len(sentimentPredictions)!=len(paragraphs)")

            for i in range(len(ids)):
                #print(f"{i}: {sentimentPredictions[i]}\n")
                sentimentValue = 0.0
                if sentimentPredictions[i]['label']=="Negative":
                    sentimentValue = -abs(sentimentPredictions[i]['score'])
                elif sentimentPredictions[i]['label']=="Positive":
                    sentimentValue = sentimentPredictions[i]['score']
                #print(f"Updating {ids[i]} with {sentimentValue}")
                self.updateScore(ids[i], sentimentValue)

            self.predictionQueue = []

    def load_and_predict(self):
        print("Loading main model")
        if self.sentiment_pipeline==None:
           self.sentiment_pipeline = pipeline(
               "sentiment-analysis",
               model="cardiffnlp/twitter-roberta-base-sentiment-latest",
               device=0)
           print("Have loaded main model")

        self.predict_sentiment()

ex_type=Exception
limit=0
wait_ms=1000
wait_increase_ratio=1
attempt = 0

print(f"In sentiment score")

simpleZeroOne = EsSentiment()

while hasParagraphsLeft:
    try:
        simpleZeroOne.totalProcessedParagraphs = 0
        simpleZeroOne.load_and_predict()
        if simpleZeroOne.totalProcessedParagraphs==0:
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



