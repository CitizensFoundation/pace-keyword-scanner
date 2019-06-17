#!/bin/bash
numberOfFiles=${4:-56}
startFile=${5:-0}
echo $numberOfFiles
masterpath="/home/robert/data/CommonCrawl/$1/$2"
mkdir -p "$masterpath"
cd "$masterpath"
wget $3
url=$3
mastergzfile=${url##*/}
yes y | gunzip $mastergzfile
masterfile="${mastergzfile::-3}"

cp $masterfile $masterfile.bck

if [ $startFile -gt 0 ]
then
  tail -n +${startFile} ${masterfile} > ${masterfile}.btrunc
  cp ${masterfile}.btrunc ${masterfile}.truncated
fi

truncOptions="-i ${numberOfFiles}q ${masterfile}.truncated"
echo $truncOptions
sed $truncOptions

touch "$masterfile.downloadList"
while IFS= read -r line
do
  echo "https://commoncrawl.s3.amazonaws.com/$line" >> $masterfile.downloadList
done < "$masterfile.truncated"

touch "$masterfile.importList"
while IFS= read -r line
do
  echo "$masterpath/${line##*/}" >> $masterfile.importList
done < "$masterfile.truncated"

FREEDISK_LIMITSIZE=20000000
while IFS= read -r line
do
  downloadDocument="$masterpath/${line##*/}.downloading"
  masterDlDocument="$masterpath/${line##*/}"
  echo "wget $line --output-document=$downloadDocument"
  #mv $downloadDocumnet $masterDlDocument
  MOUNTP="."
  FREE=$(df -k --output=avail "$MOUNTP" | tail -n1) # df -k not df -h

  while (($FREE<$FREEDISK_LIMITSIZE)); do
    sleep 5;
    echo "Waitin on free diskspace, free now $FREE"
  done
done < "$masterfile.importList"

