#!/bin/bash
importPath="/home/robert/data/CommonCrawl/$1/$2/wet.paths.importList"
echo $importPath
java -Xmx100g -jar -Djna.library.path=/usr/local/lib target/ackeywordscanner-1.0-jar-with-dependencies.jar scan "$importPath" exampleKeywords/en_v1.csv
