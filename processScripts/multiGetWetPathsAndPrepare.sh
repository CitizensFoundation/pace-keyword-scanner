#!/bin/bash
echo "Starting"

downloadList="/home/robert/data/CommonCrawl/downloadList"
touch "$downloadList"
truncate -s 0 "$downloadList"

importList="/home/robert/data/CommonCrawl/importList"
touch "$importList"
truncate -s 0 "$importList"

declare -a filePathsTEST=(
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2020-05/wet.paths.gz"
)

declare -a filePaths=(
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2013-20/wet.paths.gz"
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2014-52/wet.paths.gz"
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2015-48/wet.paths.gz"
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2016-50/wet.paths.gz"
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2017-51/wet.paths.gz"
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2018-51/wet.paths.gz"
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2019-51/wet.paths.gz"
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2020-50/wet.paths.gz"
  "https://data.commoncrawl.org/crawl-data/CC-MAIN-2021-49/wet.paths.gz"
)

for Path in "${filePaths[@]}"
do
  echo "$Path"
#  OLDIFS=$IFS
#  IFS='/'
#  toSplit="$Path"
# read -a strarr <<<"$toSplit"
#  echo "${strarr[4]}"
#  IFS=$OLDIFS
  masterpath="/home/robert/data/CommonCrawl/Downloads"
  mkdir -p "$masterpath"
  cd "$masterpath"
  wget --retry-connrefused --waitretry=1 --read-timeout=30 --timeout=25 $Path
  url=$Path
  mastergzfile=${url##*/}
  yes y | gunzip $mastergzfile
  masterfile="${mastergzfile::-3}"

  while IFS= read -r line
  do
    sub='.gz'
    if [[ "$line" =~ .*"$sub".* ]]; then
      echo "https://data.commoncrawl.org/$line" >> $downloadList
    fi
  done < "$masterfile"

  while IFS= read -r line
  do
    sub='.gz'
    if [[ "$line" =~ .*"$sub".* ]]; then
      echo "$masterpath/${line##*/}" >> $importList
    fi
  done < "$masterfile"

  rm $masterfile
done

