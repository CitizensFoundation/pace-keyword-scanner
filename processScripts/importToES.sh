#!/bin/bash
java -jar target/ackeywordscanner-1.0-jar-with-dependencies.jar importToES "/home/robert/data/CommonCrawl/$1/$2/wet.paths.importList" "/home/robert/data/CommonCrawl/$1/$2/hostranks.txt.gz.processed.gz"
