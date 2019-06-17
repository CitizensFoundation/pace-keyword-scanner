#!/bin/bash
numberOfFiles=${4:-56}
echo $numberOfFiles
masterpath="/home/robert/data/CommonCrawl/$1/$2"
mkdir -p "$masterpath"
cd "$masterpath"
wget $3
url=$3
mastergzfile=${url##*/}
yes y | gunzip $mastergzfile
masterfile="${mastergzfile::-3}"
truncOptions="-i ${numberOfFiles}q ${masterfile}"
echo $truncOptions
sed $truncOptions
touch "$masterfile.downloadList"
while IFS= read -r line
do
  echo "https://commoncrawl.s3.amazonaws.com/$line" >> $masterfile.downloadList
done < "$masterfile"

touch "$masterfile.importList"
while IFS= read -r line
do
  echo "$masterpath/${line##*/}" >> $masterfile.importList
done < "$masterfile"

aria2c -x 8 -i $masterfile.downloadList
