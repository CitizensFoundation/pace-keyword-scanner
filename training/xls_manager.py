import pandas as pd
import pathlib
import os
import pprint

class XlsManager:
    topics = {}
    language = None
    inFileNames = []
    inFilesPath = None
    outFilesPath = None
    xlsDataRounds = []
    keywordsSheet = None

    # default constructor
    def __init__(self, language):
        self.language = language
        currentPath = pathlib.Path().absolute()
        self.inFilesPath = f"{currentPath}/xls/fromXls/{self.language}/"
        self.inFileNames = sorted(os.listdir(self.inFilesPath))
        self.outFilesPath = f"{currentPath}/xls/toXls/{self.language}/"
        print(self.outFilesPath )

    def setup_all_from_xls(self):
        for fileName in self.inFileNames:
            round = []
            xlsx = pd.ExcelFile(f"{self.inFilesPath}/{fileName}")
            for sheet in xlsx.sheet_names:
                round.append(xlsx.parse(sheet))
            self.xlsDataRounds.append(round)
        self.keywordsSheet = self.xlsDataRounds[-1][0]
        print(self.keywordsSheet)

    def read_in_topics(self):
        topicNames = []
        for index, row in self.keywordsSheet.iterrows():
            if (index>1 and not pd.isnull(row[2]) and not pd.isnull(row[3])):
                topic = row[2]
                subTopic = row[3]
                if (not topic in self.topics):
                    self.topics[topic] = {}
                elif (not subTopic in self.topics[topic]):
                   self.topics[topic][subTopic] = subTopic
#        pp = pprint.PrettyPrinter(indent=4)
#        pp.pprint(self.topics)

        for topic in self.topics:
            print(topic)
            for subTopic in self.topics.get(topic):
                print(f"     {subTopic}")

test = XlsManager("en")
test.setup_all_from_xls()
test.read_in_topics()




