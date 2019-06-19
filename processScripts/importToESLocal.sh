#!/bin/bash
java -jar target/ackeywordscanner-1.0-jar-with-dependencies.jar importToES "/home/robert/data/CommonCrawl/$1/$2/wet.paths.importList" 127.0.0.1 "/home/robert/data/CommonCrawl/$1/$2/hostranks.txt.gz.processed.gz"
