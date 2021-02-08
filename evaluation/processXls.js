const numberOfSampleHits = 100;
const allTopics = [];
const allSubTopics = [];

const Excel = require("exceljs");

const addSampleHitsToWorkbook = require('./processSampleHits.js').addSampleHitsToWorkbook;

const xlsInFileName = process.argv[2];
const xlsOutFileName = process.argv[3];

const xlsWorkbook = new Excel.Workbook();

const setupTopicsAndSheets = () => {
  const firstSheet = xlsWorkbook.worksheets[0];

  if (xlsWorkbook.worksheets.length > 1) {
    for (let i = 1; i < xlsWorkbook.worksheets.length; i++) {
      xlsWorkbook.removeWorksheet(xlsWorkbook.worksheets[i].id);
    }
  }

  for (let rowNumber = 3; rowNumber < firstSheet.rowCount; rowNumber++) {
    const row = firstSheet.getRow(rowNumber);
    if (
      row.getCell(1).value != null &&
      row.getCell(2).value != null &&
      row.getCell(3).value != null &&
      row.getCell(4).value != null
    ) {
      let keywords;
      for (let n = 9; n < row.cellCount; n++) {
        if (row.getCell(n) != null) {
          keywords += ` ${row.getCell(n)}`;
        }
      }

      const topic = row.getCell(3).value;
      allSubTopics.push({
        locale: row.getCell(1).value,
        idealogy: row.getCell(2).value,
        topic: topic,
        subTopic: row.getCell(4).value,
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
        const worksheet = xlsWorkbook.addWorksheet(topic);
        const topicRow = worksheet.addRow([`Topic: ${topic}`]);
        topicRow.font = { bold: true, size: 20 };
        topicRow.height = 42.5;
        worksheet.addRow(["Sub Topic","Paragraph","Relevant?"]);
      }
      console.log(row.getCell(4).value);
    } else {
      //console.log("Skipping import of row: " + rowNumber);
    }
  }
};

const run = async () => {
  await xlsWorkbook.xlsx.readFile(xlsInFileName);
  setupTopicsAndSheets();

  await addSampleHitsToWorkbook(xlsWorkbook, allSubTopics, numberOfSampleHits);
  //await addGooleSearchResults(xlsWorkbook);

  await xlsWorkbook.xlsx.writeFile(xlsOutFileName);
}

run();