#!/bin/bash
importPath="/home/robert/data/CommonCrawl/$1/$2/wet.paths.importList2"
echo $importPath
sudo nice -n -17 sudo su robert -c "java -jar target/ackeywordscanner-1.0-jar-with-dependencies.jar scan $importPath /home/robert/Downloads/keywords6.csv cfa"
