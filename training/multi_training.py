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

from xls_manager import XlsManager

logging.basicConfig(level=logging.INFO)
transformers_logger = logging.getLogger("transformers")
transformers_logger.setLevel(logging.WARNING)

class MultiTraining:
    def start_training(self):
        xlsManager = XlsManager("en")
        xlsManager.setup_all_from_xls()

        trainingOptions = [{"modelName": "binary" }]

        for topic in xlsManager.topics:
            trainingOptions.append({"modelName": topic.replace(' ','').lower(),
                "topic": topic, "trainOnlyRelevant": True})

        for options in trainingOptions:
            if (options.get("topic")):
                p = subprocess.Popen(["python", "model_training.py",f"{options.get('modelName')}",f"{options.get('topic')}",f"{options.get('trainOnlyRelevant')}"])
            else:
                p = subprocess.Popen(["python", "model_training.py",f"{options.get('modelName')}"])
            p.wait()

multi = MultiTraining()
multi.start_training()
