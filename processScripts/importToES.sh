#!/bin/bash
java -Xmx90g -jar target/ackeywordscanner-1.0-jar-with-dependencies.jar importToES "/home/robert/data/CommonCrawl/$1/$2/wet.paths.importList" "keywords/en_v1.csv" "/home/robert/data/CommonCrawl/$1/$2/hostranks.txt.gz.processed.gz"
