const readline = require('readline');
const fs = require('fs');
let outData = "";
let rl = readline.createInterface({
    input: fs.createReadStream(process.argv[2])
});

rl.on('line', function(line) {
//    line = line.replace(/ /g, "");
    line = line.toLowerCase();
    line = line.split(',')[1];
    outData+="\\b"+line;
    if (!line.endsWith(".")) {
      outData +="\\b";
    }
    outData+="\n";
});

// end
rl.on('close', function(line) {
  fs.writeFile(process.argv[3], outData, function (err) {
    if (err) {
      console.error(err);
      // append failed
    } else {
      console.log("Done");
      // done
    }
  })
});