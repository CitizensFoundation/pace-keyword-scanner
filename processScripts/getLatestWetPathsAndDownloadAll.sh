#!/bin/bash
mywget()
{
  FREEDISK_LIMITSIZE=20000000
  MOUNTP="."
  FREE=$(df -k --output=avail "$MOUNTP" | tail -n1) # df -k not df -h

  while (($FREE<$FREEDISK_LIMITSIZE)); do
    sleep 5;
    echo "Waitin on free diskspace, free now $FREE"
  done

  url=$1

  filename=${url##*/}

  wget -O $filename.downloading $1
  mv $filename.downloading $filename
}

export -f mywget

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

if [ $startFile -gt 0 ]
then
  tail -n +${startFile} ${masterfile} > ${masterfile}.btrunc
  mv ${masterfile}.btrunc ${masterfile}.truncated
else
 mv ${masterfile} ${masterfile}.truncated
fi

truncOptions="-i ${numberOfFiles}q ${masterfile}.truncated"
echo $truncOptions
sed $truncOptions

touch "$masterfile.downloadList"
truncate -s 0  "$masterfile.downloadList"
while IFS= read -r line
do
  echo "https://commoncrawl.s3.amazonaws.com/$line" >> $masterfile.downloadList
done < "$masterfile.truncated"

touch "$masterfile.importList"
truncate -s 0 "$masterfile.importList"
while IFS= read -r line
do
  echo "$masterpath/${line##*/}" >> $masterfile.importList
done < "$masterfile.truncated"

#xargs -P 6 -n 1 -I {} bash -c "mywget '{}'" < $masterfile.downloadList
