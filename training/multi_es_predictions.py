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

from es_predictions import EsPredictions

topics1 = [
    "Left behind",
    "Family disintegration",
    "Loss of religion",
    "Evolving social mores",
    "Technology and alienation",
    "Losing cultural identity",
    "Income inequality",
    "Qanon"
    ]

topics2 = [
    "Desire for strong man",
    "Feeling ignored",
    "Distrust of media"
    "False accusations of racism",
    "Nanny state",
    "Call to vigilante action",
    "Dehumanization of opponents",
    "Restrictions on free speech",
    "Loss of sovereignty",
    "Undeserving support"
    ]

topics3 = [
    "Citizen Engagement",
    "Democratic Innovation"
    ]

topics4 = ["Resentment of elite"]

esPredictions = EsPredictions()

ex_type=Exception
limit=0
wait_ms=250
wait_increase_ratio=1
attempt = 0
option = sys.argv[1]

while True:
    try:
        if option=="1":
            esPredictions.predict_for_topics(topics1)
        elif option=="2":
            esPredictions.predict_for_topics(topics2)
        elif option=="3":
            esPredictions.predict_for_topics(topics3)
        elif option=="4":
            esPredictions.predict_for_topics(topics4)
        elif option=="5":
            esPredictions.predict_for_topics(topics5)
    except Exception as ex:
        if not isinstance(ex, ex_type):
            raise ex
        if 0 < limit <= attempt:
            print("no more attempts")
            raise ex

        print("failed execution attempt", attempt)

        attempt += 1
        time.sleep(wait_ms / 1000)
        wait_ms *= wait_increase_ratio



