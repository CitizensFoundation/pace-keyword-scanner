"use strict";

const { Client } = require("@opensearch-project/opensearch");

const esClient = new Client({
  node:
    "https://search-popai-nlixyfy37n3b2zipuqzul6hklm.us-east-1.es.amazonaws.com/",
  log: "error",
});

const search = (index, body) => {
  return esClient.search({ index: index, body: body });
};

const count = (index, body) => {
  return esClient.count({ index: index, body: body });
};

const getBaseQuery = (topic, subTopic, language, numberOfSampleHits) => {
  console.log("Searching topic: " + topic);
  console.log("Searching subTopic: " + subTopic);
  console.log("Searching language: " + language);
  console.log("Searching number of hits: " + numberOfSampleHits);
  return {
    query: {
      function_score: {
        query: {
          bool: {
            must: [
              {
                term: { "subTopic.keyword": subTopic.trim() },
              },
              {
                term: { "topic.keyword": topic.trim() },
              },
              {
                term: { "language.keyword": language },
              },
              {
                range: {
                  pageRank: {
                    lt: 100000000,
                  },
                },
              },
              {
                range: {
                  pageRank: {
                    gt: 0,
                  },
                },
              },
            ],
          },
        },
        random_score: {},
      },
    },
    size: numberOfSampleHits,
  };
};

const getCountQuery = (topic, subTopic, language) => {
  return {
    query: {
      bool: {
        must: [
          {
            term: { "subTopic.keyword": subTopic },
          },
          {
            term: { "topic.keyword": topic },
          },
          {
            term: { "language.keyword": language },
          },
        ],
      },
    },
  };
};

const createRandomHundred = async () => {
  const arr = [];
  for (let i = 0; i < 100; i++) {
    arr.push({
      paragraph:
        "blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah ",
    });
  }

  return {
    subTopicHits: arr,
    totalHits: 12321321,
  };
};

const getEsSubTopicHits = async (
  topic,
  subTopic,
  language,
  numberOfSampleHits
) => {
  return new Promise((resolve, reject) => {
    count("urls", getCountQuery(topic, subTopic, language))
      .then((countResults) => {
        console.log(countResults);
        search(
          "urls",
          getBaseQuery(topic, subTopic, language, numberOfSampleHits)
        )
          .then((results) => {
            console.log(
              `found ${countResults.body.count} items in ${results.body.took}ms`
            );
            console.log(results);
            const returnResults = {
              totalHits: countResults.body.count,
              subTopicHits: [],
            };
            results.body.hits.hits.forEach((hitIn) => {
              const hit = hitIn._source;
              //console.log(hit.paragraph);
              returnResults.subTopicHits.push({ paragraph: hit.paragraph });
            });
            resolve(returnResults);
          })
          .catch(console.error);
      })
      .catch(console.error);
  });
};

const addSampleHitsToWorkbook = async (
  xlsWorkbook,
  allSubTopics,
  language,
  numberOfSampleHits
) => {
  return new Promise(async (resolve) => {
    let currentTopic = "";
    let isFirstSubTopic = true;
    let currentRow;
    for (let i = 0; i < allSubTopics.length; i++) {
      const subTopic = allSubTopics[i].subTopic;

      if (allSubTopics[i].topic != currentTopic) {
        currentTopic = allSubTopics[i].topic;
        currentRow = 3;
        isFirstSubTopic = true;
      }

      const hitResults = await getEsSubTopicHits(
        currentTopic,
        subTopic,
        language,
        numberOfSampleHits
      );
      const subTopicHits = hitResults.subTopicHits;

      console.log(`Current topic: ${currentTopic}`);
      const worksheet = xlsWorkbook.getWorksheet(currentTopic.substring(0,30));
      worksheet.getColumn(1).width = 17;
      worksheet.getColumn(2).width = 75;
      worksheet.getColumn(3).width = 15;
      worksheet.getColumn(4).width = 75;

      let lastRow;

      console.log(`\n\n${subTopicHits.length}\n\n`);

      for (let n = 0; n < subTopicHits.length; n++) {
        lastRow = worksheet.addRow([subTopic, subTopicHits[n].paragraph]);
        //console.log(subTopicHits[n].paragraph);
        lastRow.getCell(2).alignment = { wrapText: true };
        lastRow.height = 125;
        currentRow++;
      }

      const sumRow = worksheet.addRow();
      sumRow.getCell(3).value = {
        formula: `COUNTIF(C${currentRow - subTopicHits.length}:C${
          currentRow - 1
        },"x")/${subTopicHits.length}`,
      };
      sumRow.getCell(3).numFmt = "0%";
      const masterRow = xlsWorkbook.worksheets[0].getRow(
        allSubTopics[i].rowNumber
      );

      if (hitResults.totalHits > 0) {
        masterRow.getCell(7).value = {
          formula: `'${currentTopic.substring(0,30)}'!C${currentRow}`,
        };
        masterRow.getCell(7).numFmt = "0%";
      }

      masterRow.getCell(6).value = hitResults.totalHits;
      masterRow.getCell(6).numFmt = "#,##0";
      worksheet.addRow();
      currentRow += 2;
    }

    resolve();
  });
};

module.exports = {
  addSampleHitsToWorkbook,
};
