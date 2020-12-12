#!/bin/bash
importPath="/home/robert/data/CommonCrawl/$1/$2/wet.paths.importList"
echo $importPath
java -jar target/ackeywordscanner-1.0-jar-with-dependencies.jar scan "$importPath" exampleKeywords/pace_v1.txt
