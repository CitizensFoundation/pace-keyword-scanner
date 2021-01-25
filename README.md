# ac-keyword-scanner
Scans CommonCrawl datasets for keywords. Scans the whole month of CommonCrawl data using Amazon EC2 c5.24xlarge instance for hundreds of keywords in about 6 hours. Developed with support from the EU and the Populism &amp; Civic Engagement H2020 project.


![eu logo](https://demos-h2020.eu/img/EU_logo.jpg)

This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 822337. Any dissemination of results here presented reflects only the consortium’s view. The Agency is not responsible for any use that may be made of the information it contains.

![screenshot](https://yrpri-direct-asset.s3.amazonaws.com/Screenshot+from+2020-12-13+23-36-41.png)

![screenshot2](https://yrpri-direct-asset.s3.amazonaws.com/Screenshot+from+2020-12-14+00-10-55.png)

# Prepare the page ranks file into the condences format
processScripts/getLatestPageRanking.sh 2020 11 https://commoncrawl.s3.amazonaws.com/projects/hyperlinkgraph/cc-main-2020-jul-aug-sep/host/cc-main-2020-jul-aug-sep-host-ranks.txt.gz
processScripts/processHostRanksFile.sh 2020 11

# Parallel Step 1 - Download files list and start parallel downloading
processScripts/getLatestWetPathsAndDownloadAll.sh 2020 11 https://commoncrawl.s3.amazonaws.com/crawl-data/CC-MAIN-2020-50/wet.paths.gz 72000

# Parallel Step 2- Scan the files (start a bit after the download starts)
processScripts/scan.sh 2020 11

# Parallel (or not) Step 3 - Import into ElasticSearch
processScripts/importToES.sh 2020 11

