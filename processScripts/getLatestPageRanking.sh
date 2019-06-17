#!/bin/bash
masterpath="/home/robert/data/CommonCrawl/$1/$2"
mkdir -p "$masterpath"
cd "$masterpath"
wget $3
url=$3
mastergzfile=${url##*/}
mv "$mastergzfile hostranks.txt.gz"
