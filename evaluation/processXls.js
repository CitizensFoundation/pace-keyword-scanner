const numberOfSampleHits = 250;
const language = "en";
const allTopics = [];
const allSubTopics = [];

const Excel = require("exceljs");

const addSampleHitsToWorkbook = require('./processSampleHits.js').addSampleHitsToWorkbook;

const xlsInFileName = process.argv[2];
const xlsOutFileName = process.argv[3];

const xlsWorkbook = new Excel.Workbook();

const FILTER_BY_IDEALOGY = "popai";

const setupTopicsAndSheets = () => {
  const firstSheet = xlsWorkbook.worksheets[0];

  firstSheet.pageSetup.showGridLines = true;

  if (xlsWorkbook.worksheets.length > 1) {
    const worksheetsLength = xlsWorkbook.worksheets.length;
    console.log(`Many worksheets ${worksheetsLength}`)
    while (xlsWorkbook.worksheets.length>1) {
      if (xlsWorkbook.worksheets[1]) {
        console.log(`Removed worksheet id ${xlsWorkbook.worksheets[1].id}`)
        xlsWorkbook.removeWorksheet(xlsWorkbook.worksheets[1].id);
      }
    }
    console.log(`After worksheet removals ${xlsWorkbook.worksheets.length}`)
  }

  for (let rowNumber = 3; rowNumber < firstSheet.rowCount; rowNumber++) {
    const row = firstSheet.getRow(rowNumber);
    if (
      row.getCell(1).value != null &&
      row.getCell(2).value != null &&
      row.getCell(3).value != null &&
      row.getCell(4).value != null
    ) {
      if (FILTER_BY_IDEALOGY==null || FILTER_BY_IDEALOGY==row.getCell(2).value) {
        let keywords = "";
        for (let n = 8; n < row.cellCount; n++) {
          if (row.getCell(n).text != null && row.getCell(n).text.length>0) {
            keywords += ` ${row.getCell(n).text}`;
            //console.log(row.getCell(n).text)
          }
        }

        let topic = row.getCell(3).value;
        topic = topic.trim();
        allSubTopics.push({
          locale: row.getCell(1).value,
          idealogy: row.getCell(2).value,
          topic: topic,
          subTopic: row.getCell(4).value.trim(),
          testParagraph: row.getCell(5).value,
          googleHits: row.getCell(6).value,
          ccHits: row.getCell(7).value,
          percentOfGoogle: row.getCell(8).value,
          keywords: keywords,
          rowNumber: rowNumber
        });

        if (allTopics.indexOf(topic)===-1) {
          allTopics.push(topic);
          console.log(topic);
          const worksheet = xlsWorkbook.addWorksheet(topic.substring(0,30));
          const topicRow = worksheet.addRow([`${topic}`]);
          topicRow.font = { bold: true, size: 20 };
          topicRow.height = 42.5;
          worksheet.addRow(["Sub Topic","Paragraph","Relevant?","Sentiment?","Notes for potential fixes"]);
        }
        console.log(row.getCell(4).value);
      } else {
        console.log(`Skipping ${row.getCell(2).value}`);
      }
    } else {
      //console.log("Skipping import of row: " + rowNumber);
    }
  }
};

const run = async () => {
  await xlsWorkbook.xlsx.readFile(xlsInFileName);
  setupTopicsAndSheets();

  await addSampleHitsToWorkbook(xlsWorkbook, allSubTopics, language, numberOfSampleHits);

  await xlsWorkbook.xlsx.writeFile(xlsOutFileName);
}

run();