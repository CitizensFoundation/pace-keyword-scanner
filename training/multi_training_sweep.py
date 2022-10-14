# INSTALLATION
# conda create -n st python pandas tqdm
# conda activate st
# conda install pytorch==1.11.0 torchvision==0.12.0 torchaudio==0.11.0 cudatoolkit=11.3 -c pytorch
# pip install simpletransformers wandb numba GPUtil openpyxl
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
         #   {"modelName": "binaryOnes", "wandbProject": "all-ones", "onlyOnes": True },
         #   {"modelName": "populismrelevant", "trainOnlyRelevant": True, "skipTopics": [
         #       "Citizen Engagement", "Democratic Innovation"
         #       ], "wandbProject": "populism-relevant" },
         #   {"modelName": "civicrelevant", "trainOnlyRelevant": True, "onlyTopics": [
         #       "Citizen Engagement", "Democratic Innovation"
         #       ], "wandbProject": "civic-relevant" },
            {"modelName": "binary", "wandbProject": "all-exes", "allowEmptyRatings": True, "dedupTexts": True},
        ]

        #for topic in xlsManager.topics:
        #    trainingOptions.append({"modelName": topic.replace(' ','').lower(),
        #        "topic": topic, "trainOnlyRelevant": True, "wandbProject": "topic-relevant"})

        #for topic in xlsManager.topics:
        #    trainingOptions.append({"modelName": f"binaryOnesTopic{topic.replace(' ','').lower()}",
        #        "topic": topic, "onlyOnes": True, "wandbProject": "topic-only-ones"})

        #for topic in xlsManager.topics:
        #    trainingOptions.append({"modelName": f"binaryOneTwosTopic{topic.replace(' ','').lower()}",
        #        "topic": topic, "onlyOneTwo": True, "wandbProject": "topic-only-one-two"})

        for options in trainingOptions:
            optionsString=json.dumps(options)
            print(optionsString)
            p = subprocess.Popen(["python", "model_training_sweep.py",f"{optionsString}"])
            p.wait()

multi = MultiTraining()
multi.start_training()
