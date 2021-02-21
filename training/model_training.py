from simpletransformers.classification import ClassificationModel, ClassificationArgs
import pandas as pd
import logging
import torch
import random
import wandb

from xls_manager import XlsManager

logging.basicConfig(level=logging.INFO)
transformers_logger = logging.getLogger("transformers")
transformers_logger.setLevel(logging.WARNING)

class ModelTraining:
    def train_model(self, options):
        wandb.init(project="pace-test-1", entity="citizensfoundation")
        #torch.cuda.empty_cache()
        manager = XlsManager("en")
        manager.setup_all_from_xls()
        trainingData = manager.get_training_data(options)
        #trainingData = manager.get_training_data({"topic": "Left behind", "subTopic": "Economics"})
        #trainingData = manager.get_training_data({"topic": "Left behind"})

        def random_seed():
            return 0.5

        length = len(trainingData)

        random.shuffle(trainingData, random_seed)

        splitIndex = int(length*0.8)

        # Preparing train data
        train_data = trainingData[:splitIndex]
        train_df = pd.DataFrame(train_data)
        train_df.columns = ["text", "labels"]

        # Preparing eval data
        eval_data =  trainingData[splitIndex:]
        eval_df = pd.DataFrame(eval_data)
        eval_df.columns = ["text", "labels"]

        # Optional model configuration
        model_args = ClassificationArgs(num_train_epochs=1, wandb_project="pace-test-1")

        # Create a ClassificationModel
        model = ClassificationModel(
            "bert", "bert-base-uncased", args=model_args, use_cuda = True
        )

        # Train the model
        model.train_model(train_df)

        # Evaluate the model
        result, model_outputs, wrong_predictions = model.eval_model(eval_df)

        print(model_outputs)
        #print(wrong_predictions)
        print(result)

        # Make predictions with the model
        #predictions, raw_outputs = model.predict(["Those people were left behind because the government did not understand them"])
        #print(predictions)

training = ModelTraining()
training.train_model({"topic": "Left behind"})
