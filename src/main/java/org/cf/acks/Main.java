package org.cf.acks;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.http.HttpHost;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequest;
import org.elasticsearch.action.admin.indices.settings.put.UpdateSettingsRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.common.settings.Settings;
import org.apache.commons.collections4.ListUtils;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.*;
import java.util.zip.GZIPInputStream;
import com.gliwka.hyperscan.wrapper.CompileErrorException;
import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Expression;
import com.gliwka.hyperscan.wrapper.Match;
import com.gliwka.hyperscan.wrapper.Scanner;

public class Main {

    private static final Logger logger = LogManager.getLogger(Main.class);
    public static final int BUFFER_SIZE = 128_000;

    // TEST

    private static final String esHostname="127.0.0.1";
    private static final Integer esPort=9200;
    private static final String esProtocol="http";


    // PRODUCTION
    /*private static final String esHostname="search-pace-dev-1-jv4lkhrngfqvb3wiwkrcvpsr7m.us-east-1.es.amazonaws.com";
    private static final Integer esPort=443;
    private static final String esProtocol="https";*/

    private static ArrayList<KeywordEntry> keywordEntries;
    private static HashMap<Expression, Integer> expressionToKeywordEntries = new HashMap<Expression, Integer>();
    private static Database keywordHyperDatabase;

    private static HashMap<String,KeywordEntry> keywordsMap = new HashMap<String,KeywordEntry>();

    private static void setESIndexRefreshAndReplicas(String refreshInterval, Integer numberOfReplicas) {
        RestHighLevelClient esClient = new RestHighLevelClient(
            RestClient.builder(
                    new HttpHost(Main.esHostname, Main.esPort, Main.esProtocol)
                    ));
        UpdateSettingsRequest request = new UpdateSettingsRequest("urls");
        Map<String, Object> map = new HashMap<>();
        map.put("index.refresh_interval", refreshInterval);
        map.put("index.number_of_replicas", numberOfReplicas);
        request.settings(map);
        try {
            esClient.indices().putSettings(request, RequestOptions.DEFAULT);
            esClient.close();
        } catch (IOException ex) {
            System.out.println("esError setESIndexRefreshAndReplicas: "+ex.getMessage());
        }
    }

    private static void disableESIndexRefreshAndReplicas() {
        setESIndexRefreshAndReplicas("-1", 0);
    }

    private static void enableESIndexRefreshAndReplicas() {
        setESIndexRefreshAndReplicas("1s", 1);
    }

    private static void ensureIndexIsCreated() {
        RestHighLevelClient esClient = new RestHighLevelClient(
            RestClient.builder(
                    new HttpHost(Main.esHostname, Main.esPort, Main.esProtocol)
                    ));

        GetIndexRequest request = new GetIndexRequest("urls");
        try {
            boolean exists = esClient.indices().exists(request, RequestOptions.DEFAULT);
            if (!exists) {
                CreateIndexRequest createRequest = new CreateIndexRequest("urls");
                    esClient.indices().create(createRequest, RequestOptions.DEFAULT);
                    esClient.close();
            }
        } catch (IOException ex) {
            System.out.println("esError ensureIndexIsCreated: "+ex.getMessage());
        }
    }

    private static void startScan(String[] args) throws Throwable {
        logger.info("CPU cores available: {}", Runtime.getRuntime().availableProcessors());
        System.out.println("CPU cores available: "+Runtime.getRuntime().availableProcessors());

        final int availableProcessors = Runtime.getRuntime().availableProcessors();
        Path mainFilePath = Paths.get(args[1]);
        final List<String> allWetFiles = Files.readAllLines(mainFilePath);
        final List<List<String>> splitWetFiles = ListUtils.partition(allWetFiles, allWetFiles.size()/availableProcessors);
        final String filesPathName = mainFilePath.getParent().toAbsolutePath().toString();

        System.out.println("Filespath:" +filesPathName);

        for (int i=0; i<splitWetFiles.size();i++) {
            String newOutFileContent = "";
            String wetFilesSplitFilename=filesPathName+"/"+"wetfiles_split_by_cpu."+i;

            for (String wetFile : splitWetFiles.get(i)) {
                newOutFileContent+=wetFile+"\n";
            }
            Files.write(Paths.get(wetFilesSplitFilename), newOutFileContent.getBytes());
            Runtime.getRuntime().exec("./processScripts/scanPerCPU.sh "+wetFilesSplitFilename+" "+args[2]);
        }

        logger.info("Start Scan complete.");
    }

    private static void scanFilesOneCPU(String[] args) throws Throwable {
        final List<String> s3KeyList = Files.readAllLines(Paths.get(args[1]));

        logger.info("CPU cores available: {}", Runtime.getRuntime().availableProcessors());

        final int poolSize = 1;
        final int maxScheduled = poolSize * 3;

        logger.info("Allocating a thread pool of size {}.", poolSize);

        final ExecutorService executorService = Executors.newFixedThreadPool(poolSize);

        long startTime = System.currentTimeMillis();

        expressionToKeywordEntries = new HashMap<Expression, Integer>();
        keywordEntries = new ArrayList<KeywordEntry>();

        keywordHyperDatabase = KeywordEntry.createPatternDataFromFile(args[2], expressionToKeywordEntries, keywordEntries);

        Semaphore schedulingSemaphore = new Semaphore(maxScheduled);

        for (String key : s3KeyList) {
            schedulingSemaphore.acquire();

            try {
                executorService.submit(new WetArchiveProcessor(schedulingSemaphore, keywordHyperDatabase, expressionToKeywordEntries, key));
            } catch (RejectedExecutionException ree) {
                logger.catching(ree);
            }
        }

        // If all permits can be acquired, it can be assumed no more callables are executing.
        schedulingSemaphore.acquire(maxScheduled);

        executorService.shutdown();
    }

    private static HashMap<Long, Long> getPageRanks(String pageRanksFile) {
        HashMap<Long, Long> pageRanks = new HashMap<Long, Long>();
        System.out.println("Starting to read pageRanks file");
        try {
            final InputStream objectStream = new FileInputStream(new File(pageRanksFile));
            final GZIPInputStream gzipObjectStream = new GZIPInputStream(objectStream, BUFFER_SIZE);
            final BufferedReader contentReader = new BufferedReader(new InputStreamReader(gzipObjectStream, StandardCharsets.UTF_8), BUFFER_SIZE);

            String line;
            while ((line = contentReader.readLine()) != null) {
                String[] parts = line.split(" ");
                pageRanks.put(Long.parseLong(parts[1]), Long.parseLong(parts[0]));
            }
            contentReader.close();
            System.out.println("Have read pageRanks file");
        } catch (IOException io) {
            logger.catching(io);
        }
        return pageRanks;
    }

    private static void importToEs(String[] args) throws Throwable {
        final List<String> scannedResultsFilesList = Files.readAllLines(Paths.get(args[1]));

        logger.info("CPU cores available: {}", Runtime.getRuntime().availableProcessors());

        //final int poolSize = 1;
        //final int maxScheduled = poolSize * 1;
        //final int poolSize = Runtime.getRuntime().availableProcessors() - 1;
        //final int maxScheduled = poolSize * 3;

        // Production
        final int poolSize = Runtime.getRuntime().availableProcessors() - 1;
        final int maxScheduled = poolSize * 3;

        logger.info("Allocating a thread pool of size {}.", poolSize);

        final ExecutorService executorService = Executors.newFixedThreadPool(poolSize);

        long startTime = System.currentTimeMillis();

        HashMap<Long, Long> pageRanks = getPageRanks(args[3]);
        expressionToKeywordEntries = new HashMap<Expression, Integer>();
        keywordEntries = new ArrayList<KeywordEntry>();
        keywordHyperDatabase = KeywordEntry.createPatternDataFromFile(args[2], expressionToKeywordEntries, keywordEntries);

        try (Writer timingResultsStats = new BufferedWriter(new FileWriter(new File("log/importToESTimingResults.stats")))) {

            Semaphore schedulingSemaphore = new Semaphore(maxScheduled);

            for (String file : scannedResultsFilesList) {
                schedulingSemaphore.acquire();

                try {
                    executorService.submit(new ImportToES(schedulingSemaphore,
                                                          file+".scanned",
                                                          Main.esHostname,
                                                          Main.esPort,
                                                          Main.esProtocol,
                                                          pageRanks,
                                                          keywordsMap,
                                                          keywordEntries));
                } catch (RejectedExecutionException ree) {
                    logger.catching(ree);
                }
            }

            // If all permits can be acquired, it can be assumed no more callables are executing.
            schedulingSemaphore.acquire(maxScheduled);

            executorService.shutdown();

            long duration = System.currentTimeMillis() - startTime;
            timingResultsStats.write("Duration\n");
            timingResultsStats.write(duration + "\n");
            timingResultsStats.close();

            logger.info("importToEs complete.");
            System.out.println("importToEs complete");
        } catch (Exception ex) {
            System.out.println("importToEs error: "+ex.getMessage());
        }
    }

    private static void findReoccurringParagraphsES(String[] args) throws Throwable {
        logger.info("CPU cores available: {}", Runtime.getRuntime().availableProcessors());

        final int poolSize = Runtime.getRuntime().availableProcessors() - 1;
        final int maxScheduled = poolSize;

        logger.info("Allocating a thread pool of size {}.", poolSize);

        final ExecutorService executorService = Executors.newFixedThreadPool(poolSize);

        long startTime = System.currentTimeMillis();

        try (Writer timingResultsStats = new BufferedWriter(new FileWriter(new File("log/findReoccurringParagraphsES.stats")))) {

            Semaphore schedulingSemaphore = new Semaphore(maxScheduled);

            for (int i = 0; i < 2; ++i) {
                schedulingSemaphore.acquire();

                try {
                    executorService.submit(new FindReoccurringParagraphsES(schedulingSemaphore, i, 2, Main.esHostname, Main.esPort, Main.esProtocol));
                } catch (RejectedExecutionException ree) {
                    logger.catching(ree);
                }
            }

            // If all permits can be acquired, it can be assumed no more callables are executing.
            schedulingSemaphore.acquire(maxScheduled);

            executorService.shutdown();

            long duration = System.currentTimeMillis() - startTime;
            timingResultsStats.write("Duration\n");
            timingResultsStats.write(duration + "\n");
            timingResultsStats.close();

            logger.info("findReoccurringParagraphsES complete.");
            System.out.println("findReoccurringParagraphsES complete");
        } catch (Exception ex) {
            System.out.println("findReoccurringParagraphsES error: "+ex.getMessage());
        }
    }

    private static void processHostRanksFile(String[] args) throws Throwable {

        long startTime = System.currentTimeMillis();

        try (Writer timingResultsStats = new BufferedWriter(new FileWriter(new File("log/processHostRankFile.stats")))) {
            ProcessHostRanksFile processor = new ProcessHostRanksFile(args[1]);
            processor.run();
            long duration = System.currentTimeMillis() - startTime;
            timingResultsStats.write("Duration\n");
            timingResultsStats.write(duration + "\n");
            timingResultsStats.close();

            logger.info("processHostRanksFile complete.");
       }
    }

    private static void validateKeywords(String[] args) throws Throwable {

        long startTime = System.currentTimeMillis();
        expressionToKeywordEntries = new HashMap<Expression, Integer>();
        keywordEntries = new ArrayList<KeywordEntry>();

        keywordHyperDatabase = KeywordEntry.createPatternDataFromFile(args[2], expressionToKeywordEntries, keywordEntries);

        Scanner keywordHyperScanner = new Scanner();

        try {
            keywordHyperScanner.allocScratch(keywordHyperDatabase);
        } catch (Throwable t) {
            try {
                throw new IOException(t);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        for (KeywordEntry entry: keywordEntries) {
            if (entry.validationParagraph!="") {
                String lowerCaseLine = entry.validationParagraph.toLowerCase();
                //System.out.println("P:"+entry.validationParagraph);

                List<Integer> matchedIndexes = new ArrayList<Integer>();

                List<Match> matches = keywordHyperScanner.scan(keywordHyperDatabase,lowerCaseLine);

                if (matches.size()>0) {
                    //System.out.println(matches.size());
                    int matchesSize = matches.size();
                    for (int m=0;m<matchesSize;m++) {
                        matchedIndexes.add(expressionToKeywordEntries.get(matches.get(m).getMatchedExpression()));
                        //System.out.println(matches.get(m).getMatchedExpression().getExpression());
                    }
                    System.out.println("OK: ("+entry.topic+" "+entry.subTopic+")");
                } else {
                    System.out.println("ERROR: ("+entry.topic+" "+entry.subTopic+") "+entry.validationParagraph);
                }
            } else {
                System.out.println("WARN: validateKeywords, no validation paragraph");
            }
        }
    }

    // Throwable originates from the JNI interface to Hyperscan.
    public static void main(String[] args) throws Throwable {
        if (args[0].equals("scan")) {
            startScan(args);
        } else if (args[0].equals("scanPerCPU")) {
            scanFilesOneCPU(args);
        } else if (args[0].equals("importToES")) {
            System.out.println("ImportES: ensureIndexIsCreated");
            ensureIndexIsCreated();
            System.out.println("ImportES: disableESIndexRefreshAndReplicas");
            disableESIndexRefreshAndReplicas();
            System.out.println("ImportES: importToEs");
            importToEs(args);
            System.out.println("ImportES: enableESIndexRefreshAndReplicas");
            enableESIndexRefreshAndReplicas();
            /*
            if (!Main.esHostname.equals("127.0.0.1")) {
                System.out.println("ImportES: sleep for 4 minutes to give the index time to refresh");
                Thread.sleep(4*60*1000);
            } else {
                System.out.println("ImportES: sleep for 30 sec to give the index time to refresh");
                Thread.sleep(30*1000);
            }
            System.out.println("ImportES: findReoccurringParagraphsES");
            findReoccurringParagraphsES(args);
            */
            System.out.println("ImportES Completed");
        } else if (args[0].equals("processHostRanksFile")) {
            processHostRanksFile(args);
        } else if (args[0].equals("validateKeywords")) {
            validateKeywords(args);
        } else if (args[0].equals("enableESIndexRefreshAndReplicas")) {
            enableESIndexRefreshAndReplicas();
        } else {
            logger.error("Cant find function to run");
        }
    }
}
