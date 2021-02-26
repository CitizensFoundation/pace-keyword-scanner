#!/bin/bash
java -Xmx90g -jar target/ackeywordscanner-1.0-jar-with-dependencies.jar importToES "/home/robert/data/CommonCrawl/" "keywords/en_v1.csv" "/home/robert/data/CommonCrawl/hostranks.txt.gz.processed.gz"
