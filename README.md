# ac-keyword-scanner
Scans CommonCrawl datasets for keywords. Scans the whole month of CommonCrawl data using Amazon EC2 c5.24xlarge instance for hundreds of keywords in about 6 hours. Developed with support from the EU and the Populism &amp; Civic Engagement H2020 project.


![eu logo](https://demos-h2020.eu/img/EU_logo.jpg)

This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 822337. Any dissemination of results here presented reflects only the consortium’s view. The Agency is not responsible for any use that may be made of the information it contains.

![screenshot](https://yrpri-direct-asset.s3.amazonaws.com/Screenshot+from+2020-12-13+23-36-41.png)

![screenshot2](https://yrpri-direct-asset.s3.amazonaws.com/Screenshot+from+2020-12-14+00-10-55.png)

## Various setup steps for installing on a AWS Ubuntu v20.04
```bash
wget -O- https://apt.corretto.aws/corretto.key | sudo apt-key add - 
sudo add-apt-repository 'deb https://apt.corretto.aws stable main'
sudo apt-get update; sudo apt-get install -y java-15-amazon-corretto-jdk

sudo apt install build-essential cmake libboost-all-dev ragel maven iotop

git clone git://github.com/intel/hyperscan
cd hyperscan
cmake -DBUILD_SHARED_LIBS=YES
make 
sudo make install

cd

git clone https://github.com/CitizensFoundation/ac-keyword-scanner.git
cd ac-keyword-scanner
mvn clean package

mkdir /home/ubuntu/ac-keyword-scanner/results

cd /home
sudo ln -s ubuntu/ robert
```

## Connect ephemeral drives on EC2 
```bash
cd
mkdir data
lsblk
sudo mkfs -t xfs /dev/nvme1n1
sudo mkfs -t xfs /dev/nvme2n1
sudo mount /dev/nvme1n1 /home/ubuntu/data
sudo mount /dev/nvme2n1 /home/ubuntu/ac-keyword-scanner/results
cd /home/ubuntu/data
sudo chown ubuntu.ubuntu .
cd /home/ubuntu/ac-keyword-scanner/results
sudo chown ubuntu.ubuntu .

```

## Prepare the page ranks file into the condenced format
```bash
processScripts/getLatestPageRanking.sh 2020 11 https://commoncrawl.s3.amazonaws.com/projects/hyperlinkgraph/cc-main-2020-jul-aug-sep/host/cc-main-2020-jul-aug-sep-host-ranks.txt.gz
processScripts/processHostRanksFile.sh 2020 11
```

## Parallel Step 1 - Download files list and start parallel downloading
```bash
processScripts/getLatestWetPathsAndDownloadAll.sh 2020 11 https://commoncrawl.s3.amazonaws.com/crawl-data/CC-MAIN-2020-50/wet.paths.gz 72000
```

## Parallel Step 2- Scan the files (start a bit after the download starts)
```bash
processScripts/scan.sh 2020 11
```

## Parallel (or not) Step 3 - Import into ElasticSearch
```bash
processScripts/importToES.sh 2020 11
```

