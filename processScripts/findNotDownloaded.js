const fs = require('fs');

const allFilename = process.argv[2];
const downloadedFilename = process.argv[3];
const outFilename = process.argv[4];

let outFileContents = "";
let inAll, inDownloaded;

try {
  inAll = fs.readFileSync(allFilename).toString();
} catch (err) {
  console.error(err);
}

console.log(inAll.length)

try {
  inDownloaded = fs.readFileSync(downloadedFilename).toString();
} catch (err) {
  console.error(err);
}

inAll.split("\n").forEach( inFile => {

  const splitFilename = inFile.split("/");

  const onlyFilename = splitFilename[splitFilename.length - 1];

  if (inDownloaded.indexOf(onlyFilename) == -1) {
    outFileContents += inFile + "\n";
  }
})


try {
    fs.writeFileSync(outFilename, outFileContents);
    console.log("File has been saved.");
} catch (error) {
    console.error(err);
}q