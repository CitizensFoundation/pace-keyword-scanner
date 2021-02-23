#!/bin/bash
importPath="/home/robert/data/CommonCrawl/downloadList"
echo $importPath
java -jar -Djna.library.path=/usr/local/lib target/ackeywordscanner-1.0-jar-with-dependencies.jar scan "$importPath" keywords/en_v1.csv
