#!/bin/bash
importPath="/home/robert/data/CommonCrawl/$1/$2/wet.paths.importList"
echo $importPath
java -jar target/ackeywordscanner-1.0-jar-with-dependencies.jar scan /home/robert/data/CommonCrawl/2019/04/files3.txt exampleKeywords/en_v1.csv
