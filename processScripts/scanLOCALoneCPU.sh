#!/bin/bash
importPath="/home/robert/data/CommonCrawl/$1/$2/wet.paths.importList"
echo $importPath
java -jar target/ackeywordscanner-1.0-jar-with-dependencies.jar scanPerCPU /home/robert/data/CommonCrawl/2019/04/dllist.txt keywords/en_v1.csv
