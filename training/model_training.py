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
        wandb.init(project="pace-test-large-binary", entity="citizensfoundation")
        wandb.log({"Options": options})
        #torch.cuda.empty_cache()
        manager = XlsManager("en")
        manager.setup_all_from_xls()
        trainingData = manager.get_training_data(options)
        #trainingData = manager.get_training_data({"topic": "Left behind", "subTopic": "Economics"})
        #trainingData = manager.get_training_data({"topic": "Left behind"})

        def random_seed():
            return 0.5

        foundText = []
        newTrainingData = []
        for item in trainingData:
            if item[0] not in foundText:
                foundText.append(item[0])
                newTrainingData.append(item)

        traininData = newTrainingData

        length = len(trainingData)

        random.shuffle(trainingData, random_seed)

        splitIndex = int(length*0.8)

        # Preparing train data
        train_data = trainingData[:splitIndex]
        print(f"Training items: {len(train_data)}")
        train_df = pd.DataFrame(train_data)
        train_df.columns = ["text", "labels"]

        # Preparing eval data
        eval_data =  trainingData[splitIndex:]
        print(f"Eval items: {len(eval_data)}")

        eval_df = pd.DataFrame(eval_data)
        eval_df.columns = ["text", "labels"]

        # Optional model configuration
        num_epochs = 1
        model_args = ClassificationArgs(overwrite_output_dir = True, num_train_epochs=num_epochs, wandb_project="pace-test-large-binary")

        # Create a ClassificationModel
        model_class = "bert"
        model_type = "bert-large-uncased"
        model = ClassificationModel(
            model_class, model_type, args=model_args, use_cuda = True
        )

        # Train the model
        model.train_model(train_df)

        # Evaluate the model
        result, model_outputs, wrong_predictions = model.eval_model(eval_df)

        #print(model_outputs)
        #print(wrong_predictions)
        print(result)
        wandb.log({"Eval loss": result.get("eval_loss"), "Epochs": num_epochs })
        wandb.log({"Model class": model_class, "Model type": model_type})
        # Make predictions with the model
        #predictions, raw_outputs = model.predict(["Those people were left behind because the government did not understand them"])
        #print(predictions)

training = ModelTraining()
training.train_model({})
#training.train_model({"topic": "Left behind"})
