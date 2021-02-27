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
import subprocess
import json

from xls_manager import XlsManager

logging.basicConfig(level=logging.INFO)
transformers_logger = logging.getLogger("transformers")
transformers_logger.setLevel(logging.WARNING)

class MultiTraining:
    def start_training(self):
        xlsManager = XlsManager("en")
        xlsManager.setup_all_from_xls()

        trainingOptions = [
            {"modelName": "binaryOnes", "wandbProject": "all-ones", "onlyOnes": True },
            {"modelName": "populismrelevant", "trainOnlyRelevant": True, "skipTopics": [
                "Citizen Engagement", "Democratic Innovation"
                ], "wandbProject": "populism-relevant" },
            {"modelName": "civicrelevant", "trainOnlyRelevant": True, "onlyTopics": [
                "Citizen Engagement", "Democratic Innovation"
                ], "wandbProject": "civic-relevant" },
            {"modelName": "binary", "wandbProject": "all-exes" },
        ]

        for topic in xlsManager.topics:
            trainingOptions.append({"modelName": topic.replace(' ','').lower(),
                "topic": topic, "trainOnlyRelevant": True, "wandbProject": "topic-relevant"})

        for options in trainingOptions:
            optionsString=json.dumps(options)
            print(optionsString)
            p = subprocess.Popen(["python", "model_training.py",f"{optionsString}"])
            p.wait()

multi = MultiTraining()
multi.start_training()
