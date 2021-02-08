const elasticsearch = require("elasticsearch");
const async = require("async");

const esClient = new elasticsearch.Client({
  host:
    "https://search-ec-ac-pace-dev-wyysxnkri3j5ohunwbd4lb6zju.us-east-1.es.amazonaws.com",
  log: "error",
});

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

const getEsSubTopicHits = async (subTopic, language, numberOfSampleHits) => {
  return new Promise((resolve, reject) => {
    resolve(createRandomHundred());
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
        subTopic,
        language,
        numberOfSampleHits
      );
      const subTopicHits = hitResults.subTopicHits;

      const worksheet = xlsWorkbook.getWorksheet(currentTopic);
      worksheet.getColumn(1).width = 20;
      worksheet.getColumn(2).width = 75;


      let lastRow;

      for (let n = 0; n < subTopicHits.length; n++) {
        lastRow = worksheet.addRow([subTopic, subTopicHits[n].paragraph]);
        lastRow.getCell(2).alignment = { wrapText: true };
        lastRow.height = 100;
        currentRow++;
      }

      const sumRow = worksheet.addRow();
      sumRow.getCell(3).value = {
        formula: `COUNTIF(C${currentRow-subTopicHits.length}:C${currentRow-1},"x")/${subTopicHits.length}`,
      };
      sumRow.getCell(3).numFmt = "0%";
      const masterRow = xlsWorkbook.worksheets[0].getRow(
        allSubTopics[i].rowNumber
      );
      masterRow.getCell(9).value = {
        formula: `'${currentTopic}'!C${currentRow}`,
      };
      masterRow.getCell(9).numFmt = "0%";
      masterRow.getCell(7).value = hitResults.totalHits;
      masterRow.getCell(7).numFmt = "#,##0";
      worksheet.addRow();
      currentRow += 2;
    }

    resolve();
  });
};

module.exports = {
  addSampleHitsToWorkbook,
};
