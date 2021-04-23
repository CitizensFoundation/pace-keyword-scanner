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
import subprocess

from xls_manager import XlsManager

from elasticsearch import Elasticsearch, helpers, exceptions

logging.basicConfig(level=logging.INFO)
transformers_logger = logging.getLogger("transformers")
transformers_logger.setLevel(logging.WARNING)

es_url = os.environ['AC_ANALYTICS_ES_URL'] if os.environ.get('AC_ANALYTICS_ES_URL')!=None else 'localhost:9200'
es = Elasticsearch(es_url)

class MultiEsOneTwos:
    def chunks(self, lst, n):
        """Yield successive n-sized chunks from lst."""
        for i in range(0, len(lst), n):
            yield lst[i:i + n]

    def start_evaluating(self, chunkNumber):
        xlsManager = XlsManager("en")
        xlsManager.setup_all_from_xls()

        evalOptions = []

        for topic in xlsManager.topics:
            if topic!="Citizen Engagement" and topic!="Resentment of elite" and topic!="UKIP" and topic!="Loss of sovereignty":
                evalOptions.append({"topic": topic, "modelName": topic.replace(' ','').lower()})

        chunkedList = list(self.chunks(evalOptions, int(len(evalOptions)/2)))
        chunkedList.append([{"topic": "Citizen Engagement", "modelName": "Citizen Engagement".replace(' ','').lower()}])
        chunkedList.append([{"topic": "Resentment of elite", "modelName": "Resentment of elite".replace(' ','').lower()}])

        print(chunkedList)
        print(chunkNumber)
        print(len(chunkedList))

        currentList = chunkedList[int(chunkNumber)-1]

        print(currentList)

        for options in currentList:
            optionsString=json.dumps(options)
            print(optionsString)
            p = subprocess.Popen(["python", "es_one_twos.py",optionsString])
            p.wait()

chunkNumber = sys.argv[1]

multi = MultiEsOneTwos()
multi.start_evaluating(chunkNumber)