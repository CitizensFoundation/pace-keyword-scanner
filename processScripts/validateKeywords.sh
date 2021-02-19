#!/bin/bash
java -jar -Djna.library.path=/usr/local/lib target/ackeywordscanner-1.0-jar-with-dependencies.jar validateKeywords "/home/robert/data/CommonCrawl/2019/04/files3.txt" "keywords/en_v1.csv"
