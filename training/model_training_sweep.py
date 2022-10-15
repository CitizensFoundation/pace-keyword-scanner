import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"

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
import json

from xls_manager import XlsManager

MODEL_SIZE = "base"
MODEL_CLASS = "bert" # "bert"
MODEL_TYPE = f"{MODEL_CLASS}-{MODEL_SIZE}-uncased" # f"{MODEL_CLASS}-{MODEL_SIZE}-uncased"
#MODEL_TYPE = "distilbert-base-uncased-finetuned-sst-2-english"
#MODEL_TYPE = "distilbert-base-uncased"
WANDB_MODE = "test"
MODEL_ROUND = "3d"

SWEEP_PROJECT_NAME = "Final PopAI Sweep Six Base"

logging.basicConfig(level=logging.INFO)
transformers_logger = logging.getLogger("transformers")
transformers_logger.setLevel(logging.WARNING)

class ModelTraining:
    def free_gpu_cache(self):
        print("Initial GPU Usage")
        gpu_usage()
        torch.cuda.empty_cache()
        print("GPU Usage after emptying the cache")
        gpu_usage()

    def train_model(self, xlsManager, options):
        #wandaProject = f"popai-{WANDB_MODE}-{options.get('wandbProject')}-{MODEL_ROUND}"
        #wandaProject = "pace-large-only-relevant"
        #wandb.init(project=wandaProject, entity="citizensfoundation")
        #wandb.run.name = f"{options.get('modelName')}-{wandb.run.id}"
        #wandb.run.save()
        #wandb.log({"Options": options})
        gc.collect()
        self.free_gpu_cache()

        trainingData = xlsManager.get_training_data(options)
        #trainingData = manager.get_training_data({"topic": "Left behind", "subTopic": "Economics"})
        #trainingData = manager.get_training_data({"topic": "Left behind"})

        def random_seed():
            return 0.45

        #foundText = []
        #newTrainingData = []
        #for item in trainingData:
        #    if item[0] not in foundText:
        #        foundText.append(item[0])
        #        newTrainingData.append(item)

        #trainingData = newTrainingData

        length = len(trainingData)

        random.shuffle(trainingData, random_seed)

        #wandb.log({"Train data len": len(trainingData)})

        splitIndex = int(length*0.85)

        # Preparing train data
        train_data = trainingData[:splitIndex]
        print(f"Training items: {len(train_data)}")
        train_df = pd.DataFrame(train_data)
        train_df.columns = ["text", "labels"]
        print(train_df)

        # Preparing eval data
        eval_data =  trainingData[splitIndex:]
        print(f"Eval items: {len(eval_data)}")

        eval_df = pd.DataFrame(eval_data)
        eval_df.columns = ["text", "labels"]
        print(eval_df)

        # Create a ClassificationModel
        def inner_train():
                print("Using binary model")
                wandb.init()
                model_args = ClassificationArgs(
                                                #train_batch_size = 16,
                                                eval_batch_size = 8,
                                                evaluate_during_training = True,
                                                manual_seed = 4,
                                                overwrite_output_dir = True,
                                                use_multiprocessing = False,
                                                use_multiprocessing_for_evaluation = False,
                                                reprocess_input_data=True,
                                                do_lower_case=True,
                                                #num_train_epochs=num_epochs,
                                                wandb_project=SWEEP_PROJECT_NAME,
                                                labels_list = [1, 0]
                                                )
                model = ClassificationModel(
                    MODEL_CLASS, MODEL_TYPE, args=model_args, use_cuda = True, sweep_config=wandb.config
                )

                model.train_model(train_df, eval_df=eval_df)
                model.eval_model(eval_df)
                wandb.join()

        sweep_config = {
            "method": "bayes",  # grid, random
            "metric": {"name": "eval_loss", "goal": "minimize"},
            "parameters": {
                "num_train_epochs": {"values": [2, 3, 5, 10]},
                "train_batch_size": {"values": [8, 16, 32]},
                "learning_rate": {"min": 5e-5, "max": 4e-4},
            },
        }

        sweep_id = wandb.sweep(sweep_config, project=SWEEP_PROJECT_NAME)

        wandb.agent(sweep_id, inner_train)

    def start_training(self):
        xlsManager = XlsManager("en")
        xlsManager.setup_all_from_xls()

        trainingOptions = [
        ]

        for topic in xlsManager.topics:
            trainingOptions.append({"modelName": topic.replace(' ','').lower(),
                "topic": topic, "trainOnlyRelevant": True})

        for options in trainingOptions:
            self.train_model(xlsManager, options)

modelName = sys.argv[1]
topic = None
trainOnlyRelevant = None

print(sys.argv)

options = json.loads(sys.argv[1])

print(options)

xlsManager = XlsManager("en")
xlsManager.setup_all_from_xls()
trainer = ModelTraining()
trainer.train_model(xlsManager, options)
