#!/bin/bash
java -jar target/ackeywordscanner-1.0-jar-with-dependencies.jar importToES "/home/robert/data/CommonCrawl/2019/04/files3.txt" "keywords/en_v1.csv" "/home/robert/data/CommonCrawl/2019/04/hostranks.txt.gz.processed.gz"
