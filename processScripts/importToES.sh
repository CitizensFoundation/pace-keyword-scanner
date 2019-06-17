#!/bin/bash
java -jar target/ackeywordscanner-1.0-jar-with-dependencies.jar importToES "/home/robert/data/CommonCrawl/$1/$2/wet.paths.importList" search-ec-ac-pace-dev-wyysxnkri3j5ohunwbd4lb6zju.us-east-1.es.amazonaws.com "/home/robert/data/CommonCrawl/$1/$2/hostranks.txt.gz.processed.gz"
