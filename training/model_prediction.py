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

from xls_manager import XlsManager

logging.basicConfig(level=logging.INFO)
transformers_logger = logging.getLogger("transformers")
transformers_logger.setLevel(logging.WARNING)

class ModelPrediction:
    def fill_out_predictions(self, modelName, topic):
        manager = XlsManager("en")
        manager.setup_all_from_xls()

        items = manager.get_items_to_rate()

        if not topic:
            print("Training binary")
            model_class = "bert"
            model_path = f"models/{modelName}"
            model = ClassificationModel(
                model_class, model_path,  use_cuda = True
            )

            for item in items:
                if item.get('rateAble')==True:
                    predictions, raw_outputs = model.predict([item.get("text")])
                    if predictions[0]==0:
                        item.get("ratingCol").value="x"
                        print(item.get("ratingCol").value)
                        #print(f"predictions x for {item.get('text')}")
        else:
            print(f"Training {topic}")
            model_class = "bert"
            model_path = "models/{modelName}"
            model = ClassificationModel(
                model_class, model_path, use_cuda = True
            )

            for item in items:
                if item.get('rateAble')==True:
                    if item.get("topic")==topic and not item.get("ratingCol").value=="x":
                        predictions, raw_outputs = model.predict([item.get("text")])
                        item.get("ratingCol").value=predictions[0]
                        print(f"Prediction {predictions[0]} {item.get('text')}")

        manager.save_predicted_items()

modelName = sys.argv[1]
topic = None

print(sys.argv)

if (len(sys.argv)>2):
    topic=sys.argv[2]

predictor = ModelPrediction()
if (topic):
    predictor.fill_out_predictions(modelName, topic)
else:
    predictor.fill_out_predictions(modelName, None)