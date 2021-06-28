package org.cf.acks;

import com.amazonaws.transform.StaxUnmarshallerContext;
import com.fasterxml.jackson.core.io.JsonStringEncoder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.http.HttpHost;

import java.io.*;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.*;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;

import org.elasticsearch.action.DocWriteRequest.OpType;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.DocWriteRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.common.document.DocumentField;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.rest.RestStatus;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import net.openhft.hashing.LongHashFunction;

public class ImportToES implements Runnable {

    private static final Logger logger = LogManager.getLogger(ImportToES.class);

    public final int BUFFER_SIZE = 128_000;
    public final int ES_BULK_MAX_SIZE = 150;

    private final Semaphore schedulingSemaphore;
    private final String archive;
    private final String esHostname;
    private final Integer esPort;
    private final String esProtocol;
    private final String path;
    private List<IndexRequest> bulkUpdateQueue;

    // private Integer esPort=9200;
    // private String esProtocol="http";
    final static String TARGET_URI_MARKER = "WARC-Target-URI:";
    final static String TARGET_DATE = "WARC-Date:";
    final static String CONTENT_LENGTH = "Content-Length";
    private RestHighLevelClient esClient;
    private HashMap<Long, Long> pageRanks;
    private HashMap<String,KeywordEntry> keywordsMap;
    private ArrayList<KeywordEntry> keywordEntries;

    ImportToES(Semaphore schedulingSemaphore, String path, String archive, String esHostname, Integer esPort, String esProtocol,
            HashMap<Long, Long> pageRanks,
            HashMap<String,KeywordEntry> keywordsMap,
            ArrayList<KeywordEntry> keywordEntries) {
        this.schedulingSemaphore = schedulingSemaphore;
        this.archive = archive;
        this.esHostname = esHostname;
        this.esPort = esPort;
        this.esProtocol = esProtocol;
        this.path = path;
        this.pageRanks = pageRanks;
        this.keywordsMap = keywordsMap;
        this.keywordEntries = keywordEntries;
        this.bulkUpdateQueue = new ArrayList<IndexRequest>();
    }

    @Override
    public void run() {
        String currentURL = null; // Should never be null in practice.
        long startTime = System.currentTimeMillis();

        String[] paths = archive.split("/");
        String fileNameWithHashCode = "results/"+paths[paths.length-1]+"."+archive.hashCode()+".scanned";

        String filename = fileNameWithHashCode;

        File file = new File(fileNameWithHashCode);

        //TODO: Remove this hack after this round
        if (file.exists() == false) {
            System.out.println("Not found: "+fileNameWithHashCode);
            String fileNameWithoutHashCode = "results/"+paths[paths.length-1]+".scanned";
            filename = fileNameWithoutHashCode;
            file = new File(fileNameWithoutHashCode);
        }

        if (false) {
            while (file.exists() == false) {
                try {
                    Random rand = new Random();
                    int n = rand.nextInt(2500);
                    n += 3500;
                    System.out.println("Waiting on file import: " + archive + " " + n / 1000 + "s");
                    long retryDuration = System.currentTimeMillis() - startTime;
                    if (retryDuration < 5 * 60 * 1000) {
                        Thread.sleep(n);
                    } else {
                        break;
                    }
                } catch (Exception ex) {
                    System.out.println("Error sleeping in thread: " + ex.getMessage());
                }
            }
        }

        if (file.exists()) {
            System.out.println("Importing: " + filename);
            if (!hasBeenImported(filename)) {
                BufferedReader contentReader = null;
                try {
                    final InputStream objectStream = new FileInputStream(new File(filename));
                    contentReader = new BufferedReader(new InputStreamReader(objectStream, StandardCharsets.UTF_8),
                            BUFFER_SIZE);
                    this.esClient = new RestHighLevelClient(
                            RestClient.builder(new HttpHost(this.esHostname, this.esPort, this.esProtocol)));

                    String line;
                    String currentDate = null;
                    int bulkCounter = 0;
                    outerloop: while ((line = contentReader.readLine()) != null) {
                        if (line.length() == 0) {
                            currentURL = null;
                            currentDate = null;
                            //System.out.println("RESET - RESET - RESET");
                        } else if (!line.contains("kx72dAx")
                                   && (line.startsWith("http://") || line.startsWith("https://"))) {
                            currentURL = line;
                            //System.out.println("URL: "+currentURL);
                            currentDate = contentReader.readLine();
                            //System.out.println("Date: "+currentDate);
                        } else if (currentURL != null && currentDate != null) {
                            //System.out.println(("Import: "+line));
                            try {
                                if (line.startsWith("Duration")) {
                                    break outerloop;
                                } else {
                                    importLinesToES(currentURL, line, currentDate);
                                    bulkCounter += 1;
                                    if (bulkCounter > ES_BULK_MAX_SIZE) {
                                        pumpBulkUpdateQueue();
                                        bulkCounter = 0;
                                    }
                                }
                            } catch (Throwable t) {
                                throw new IOException(t);
                            }
                        } else {
                            System.out.println("NOT PROCESSING - NOT PROCESSING "+line);
                        }
                    }
                    try {
                        pumpBulkUpdateQueue();
                    } catch (Throwable t) {
                        throw new IOException(t);
                    }
                    contentReader.close();
                    esClient.close();
                    setState(filename, "completed");
                    /*
                     * if (file.delete()) { System.out.println(archive+" deleted after ESImport"); }
                     * else { System.out.println(archive+" FAILED! after ESImport"); }
                     */
                } catch (IOException io) {
                    logger.catching(io);
                    setState(filename, io.getMessage());
                } finally {
                    try {
                        contentReader.close();
                        esClient.close();
                    } catch (IOException io) {
                        logger.catching(io);
                    }
                    schedulingSemaphore.release();
                }
            } else {
                System.out.println("File already imported: " + filename);
                schedulingSemaphore.release();
            }
        } else {
            System.out.println("Timeout on file: " + filename);
            schedulingSemaphore.release();
        }
    }

    private boolean hasBeenImported(String archive) {
        String path = "state/" + getFilename(archive) + ".importCompleted";
        File file = new File(path);
        return file.exists();
    }

    private String getFilename(String path) {
        String[] paths = path.split("/");
        return paths[paths.length - 1];
    }

    private int checkBulkFailures(BulkResponse bulkResponse) {
        int count = 0;
        if (bulkResponse.hasFailures()) {
            for (BulkItemResponse bulkItemResponse : bulkResponse) {
                if (bulkItemResponse.isFailed()) {
                    BulkItemResponse.Failure failure = bulkItemResponse.getFailure();
                    if (failure.getStatus().getStatus()==409) {
                        //
                    } else {
                        System.out.println(failure.toString());
                    }
                    count += 1;
                }
            }
        }

        return count;
    }

    private void pumpBulkUpdateQueue() {
        if (this.bulkUpdateQueue.size() > 0) {
            BulkRequest request = new BulkRequest();
            //TODO: Get this working so it will only save the same url+pHash once
            //request.opType = OpType.CREATE;
            for (IndexRequest update : this.bulkUpdateQueue) {
                request.add(update);
            }
            try {
                BulkResponse bulkResponse = esClient.bulk(request, RequestOptions.DEFAULT);
                int failureCount = this.checkBulkFailures(bulkResponse);
                System.out.println("+"+this.bulkUpdateQueue.size()+" -"+failureCount);
        } catch (IOException ioex) {
                try {
                    System.out.println("Sleeping because of IOException "+ioex.getMessage());
                    Thread.sleep(5 * 1000);
                    System.out.println("Retrying after IOException");
                    BulkResponse bulkResponse = esClient.bulk(request, RequestOptions.DEFAULT);
                    int failureCount = this.checkBulkFailures(bulkResponse);
                    System.out.println("After failure +"+this.bulkUpdateQueue.size()+" -"+failureCount);
                } catch (Exception ex) {
                    System.out.println("ERROR: pumpBulkUpdateQueue: " + ex.getMessage());
                }
            }
            this.bulkUpdateQueue.clear();
        }
    }

    private void setState(String archive, String status) {
        String outPath = "state/" + getFilename(archive) + ".importCompleted";
        try {
            Writer stateWrite = new BufferedWriter(new FileWriter(new File(outPath)));
            stateWrite.write(status);
            stateWrite.close();
        } catch (IOException io) {
            logger.catching(io);
        }
    }

    private String stripParagraph(String paragraph) {
        return paragraph.toLowerCase().replace(" ", "").replace("'", "")
        .replace("`", "").replace("´", "").replace("‘", "").replace("’", "").replace("”", "")
        .replace(":", "").replace("?", "").replace(";", "").replace("“", "");
    }

    private void importLinesToES(String url, String line, String currentDate) throws Throwable {
        String splitLines[] = line.split("kx72dAx");
        url = url.substring(0, Math.min(512, url.length()));
        URL uri = new URL(url);
        String domainName = uri.getHost();

        if (domainName != null) {
            domainName = domainName.replace("www.", "");
            Long domainHash = LongHashFunction.xx().hashChars(domainName);
            Long pageRank = this.pageRanks.get(domainHash);

            if (pageRank == null) {
                pageRank = -1l;
            }

            if (splitLines.length > 1) {
                String paragraph = splitLines[0].replaceAll("\"", "");
                String rest = splitLines[1];
                String entryIds = rest.split(":")[0];
                String paragraphNumber = rest.split(":")[1];

                JsonStringEncoder e = JsonStringEncoder.getInstance();
                paragraph = new String(e.quoteAsString(paragraph));
                String strippedParagraph = stripParagraph(paragraph);

                Long pHashLong = LongHashFunction.xx().hashChars(strippedParagraph);
                String pHash = Long.toString(pHashLong);

                String[] splitEntryIds = entryIds.split(",");

                if (splitEntryIds.length==0) {
                    System.out.println("WARNING: entryIds null: "+line);
                }

                for (String entryId : splitEntryIds) {
                    KeywordEntry keywordEntry = keywordEntries.get(Integer.parseInt(entryId));

                    if (keywordEntry!=null) {
                        String urlHash = Long.toString(LongHashFunction.xx().hashChars(url));
                        String urlIdHash = entryId+"-"+paragraphNumber+"-"+urlHash+"-"+pHash;

                        String jsonString = "{\"createdAt\":\"" + currentDate + "\",";
                        jsonString +=  "\"idealogyType\":\"" + keywordEntry.idealogyType + "\",";
                        jsonString +=  "\"topic\":\"" + keywordEntry.topic + "\",";
                        jsonString +=  "\"subTopic\":\"" + keywordEntry.subTopic + "\",";
                        jsonString +=  "\"language\":\"" + keywordEntry.language + "\",";
                        jsonString +=  "\"urlHash\":\"" + urlHash + "\",";

                        jsonString += "\"paragraph\":\"" + paragraph + "\",\"keywordIds\":[";

                        for (String entrySaveId : entryIds.split(",")) {
                            jsonString += entrySaveId + ",";
                        }

                        jsonString = jsonString.substring(0, jsonString.length() - 1);

                        jsonString += "],";

                        jsonString += "\"foundInSubtopicsCount\":" + entryIds.split(",").length + ",";
                        jsonString += "\"extRepostCount\": -1,";
                        jsonString += "\"intRepostCount\": 1,";
                        jsonString += "\"relevanceScore\": -1,";
                        jsonString += "\"toxicityScore\": -1.0,";
                        jsonString += "\"sentimentScore\": -999.0,";
                        jsonString += "\"pHash\":" + pHash + ",";

                        jsonString += "\"pageRank\":" + pageRank + ",";
                        jsonString += "\"paragraphNumber\":" + Integer.parseInt(paragraphNumber) + ",";

                        //TODO: Get working by reading in files with URLs to match and check url endings for unis
                        //jsonString += "\"websiteType\":\"" + ["media","blogs","politicalParties","academia","other"] + "\"";

                        String domainRoot = domainName;
                        String[] domainParts = domainName.split(".");
                        if (domainParts.length>1) {
                            domainRoot = domainParts[domainParts.length-1];
                        }

                        jsonString += "\"domainName\":\"" + domainName + "\",";
                        jsonString += "\"domainRoot\":\"" + domainRoot + "\"";
                        jsonString += "}";

                        //System.out.println(jsonString);

                        //TODO: Make sure not to override the same found paragraph so we have dates for new content - see TODO above
                        this.bulkUpdateQueue.add(new IndexRequest("urls").
                                            id(urlIdHash).
                                            source(jsonString, XContentType.JSON).
                                            opType(DocWriteRequest.OpType.CREATE));
                    } else {
                        System.out.println("ERROR: Can't find keywordEntry for ES Import");
                    }
                }
            } else {
                System.out.println("ERROR: Splitlines! ES Import");
                throw new Exception("Splitlines! " + line);
            }
        } else {
            System.out.println("WARNING: Can't find domain for: "+line);
        }
    }

}
