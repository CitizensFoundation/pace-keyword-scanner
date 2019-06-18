package org.cf.acks;

import com.amazonaws.transform.StaxUnmarshallerContext;
import com.fasterxml.jackson.core.io.JsonStringEncoder;
import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Match;
import com.gliwka.hyperscan.wrapper.Scanner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.http.HttpHost;

import java.io.*;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
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

    private final Semaphore schedulingSemaphore;
    private final String archive;
    private final String esHostname;
    final static String TARGET_URI_MARKER = "WARC-Target-URI:";
    final static String TARGET_DATE = "WARC-Date:";
    final static String CONTENT_LENGTH = "Content-Length";
    private RestHighLevelClient esClient;
    private final HashMap<Long, Long> pageRanks;

    ImportToES(Semaphore schedulingSemaphore, String archive, String esHostname, HashMap<Long, Long> pageRanks) {
        this.schedulingSemaphore = schedulingSemaphore;
        String[] archiveParts = archive.split("/");
        this.archive = "results/"+archiveParts[archiveParts.length-1];
        if (esHostname!=null) {
            this.esHostname = esHostname;
        } else {
            this.esHostname = "127.0.0.1";
        }
        this.pageRanks = pageRanks;
    }

    @Override
    public void run() {
        String currentURL = null; // Should never be null in practice.
        long startTime = System.currentTimeMillis();
        System.out.println("Importing: "+archive);
        File file = new File(archive);
        while (file.exists()==false) {
            try {
                Random rand = new Random();
                int n = rand.nextInt(2500);
                n += 3500;
                System.out.println("Waiting on file import: "+archive+" "+n/1000+"s");
                long retryDuration = System.currentTimeMillis() - startTime;
                if (retryDuration<60000) {
                    Thread.sleep(n);
                }
            } catch (Exception ex) {
                System.out.println("Error sleeping in thread: "+ex.getMessage());
            }
        }

        if (file.exists()) {
            if (!hasBeenImported(archive)) {
                BufferedReader contentReader = null;
                try {
                    final InputStream objectStream = new FileInputStream(new File(archive));
                    contentReader = new BufferedReader(new InputStreamReader(objectStream, StandardCharsets.UTF_8), BUFFER_SIZE);
                    System.out.println("esHostname: "+this.esHostname);
                    this.esClient = new RestHighLevelClient(
                        RestClient.builder(
                                new HttpHost(this.esHostname, 443, "https")
                                ));

                    GetIndexRequest request = new GetIndexRequest("urls");
                    boolean exists = this.esClient.indices().exists(request, RequestOptions.DEFAULT);
                    if (!exists) {
                        CreateIndexRequest createRequest = new CreateIndexRequest("urls");
                        this.esClient.indices().create(createRequest, RequestOptions.DEFAULT);
                    }

                    boolean processingEntry = false;

                    String line;
                    String currentDate = null;
                    outerloop: while ((line = contentReader.readLine()) != null) {
                        if (line.length()==0) {
                            processingEntry = true;
                            currentURL = null;
                            currentDate = null;
                        } else if (processingEntry && !line.contains("kd8x72dAx") && (line.startsWith("http://") || line.startsWith("https://"))) {
                            currentURL = line;
                            currentDate = contentReader.readLine();
                        } else if (processingEntry && currentURL != null && currentDate != null) {
                            try {
                                while ((line = contentReader.readLine()) != null && line.length()!=0) {
                                    if (line.startsWith("Duration")) {
                                        break outerloop;
                                    } else {
                                        importLinesToES(currentURL, line, currentDate);
                                    }
                                }
                            } catch (Throwable t) {
                                throw new IOException(t);
                            }
                            processingEntry = false;
                        }
                    }
                    contentReader.close();
                    esClient.close();
                   /* if (file.delete())
                    {
                        System.out.println(archive+" deleted after ESImport");
                    }
                    else
                    {
                        System.out.println(archive+" FAILED! after ESImport");
                    }*/
                } catch (IOException io) {
                    logger.catching(io);
                } finally {
                    schedulingSemaphore.release();
                    try {
                        contentReader.close();
                        esClient.close();
                    } catch (IOException io) {
                        logger.catching(io);
                    }
                }
            } else {
                System.out.println("File already imported: "+archive);
                schedulingSemaphore.release();
            }
        } else {
            System.out.println("Timeout on file: "+archive);
            schedulingSemaphore.release();
        }
    }

    private boolean hasBeenImported(String archive) {
        String path = "state/"+getFilename(archive)+".importCompleted";
        File file = new File(path);
        return file.exists();
    }

    private void setState(String archive, String status) {
        String outPath = "state/"+getFilename(archive)+".importCompleted";
        try {
            Writer stateWrite = new BufferedWriter(new FileWriter(new File(outPath)));
            stateWrite.write(status);
            stateWrite.close();
            }
        catch (IOException io) {
            logger.catching(io);
        }
    }

    private void importLinesToES(String url, String line, String currentDate) throws Throwable {
        String splitLines[] = line.split("kd8x72dAx");
        url = url.substring(0, Math.min(512, url.length()));
        URL uri = new URL(url);
        String domainName = uri.getHost();

        if (domainName!=null) {
            domainName = domainName.replace("www.","");
            Long domainHash = LongHashFunction.xx().hashChars(domainName);
            Long pageRank = this.pageRanks.get(domainHash);

            if (pageRank!=null) {
                if (splitLines.length>1) {
                    String paragraph = splitLines[0].replaceAll("\"","");
                    JsonStringEncoder e = JsonStringEncoder.getInstance();
                    paragraph = new String(e.quoteAsString(paragraph));
                    String strippedParagraph = paragraph.toLowerCase().replace(" ","").replace("'","").
                    replace("`","").
                    replace("´","").
                    replace("‘","").
                    replace("’","").
                    replace("”","").
                    replace(":","").
                    replace("?","").
                    replace(";","").
                    replace("“","");

                    Long pHashLong = LongHashFunction.xx().hashChars(strippedParagraph);
                    String pHash = Long.toString(pHashLong);
                    String urlIdHash = Long.toString(LongHashFunction.xx().hashChars(url+pHash));

                    MatchQueryBuilder matchQueryBuilder = new MatchQueryBuilder("pHash", pHashLong);

                    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
                    sourceBuilder.fetchSource(true);
                    SearchRequest searchRequest = new SearchRequest("urls");
                    sourceBuilder.query(matchQueryBuilder);
                    searchRequest.source(sourceBuilder);
                    SearchResponse searchResponse = esClient.search(searchRequest, RequestOptions.DEFAULT);
                    RestStatus status = searchResponse.status();

                    String foundId = null;
                    if (status.getStatus()==200) {
                        SearchHits hits = searchResponse.getHits();
                        if (hits.getTotalHits()>0 || (hits.getHits()!=null && hits.getHits().length>0)) {
                            foundId = hits.getAt(0).getId();
                            if (!foundId.equals(urlIdHash)) {
                                Map<String, Object> fieldMap = hits.getAt(0).getSourceAsMap();
                                Integer intRepostCount = 0;
                                Integer extRepostCount = 0;
                                if (fieldMap.get("intRepostCount")!=null) {
                                    intRepostCount = (Integer) fieldMap.get("intRepostCount");
                                }
                                if (fieldMap.get("extRepostCount")!=null) {
                                    extRepostCount = (Integer) fieldMap.get("extRepostCount");
                                }

                                String otherDomainName = (String) fieldMap.get("domainName");
                                String jsonStringUpdateOld;
                                if (domainName.equals(otherDomainName)) {
                                    intRepostCount+=1;
                                    jsonStringUpdateOld = "{\"intRepostCount\":"+Integer.toString(intRepostCount)+"}";
                                } else {
                                    extRepostCount+=1;
                                    jsonStringUpdateOld = "{\"extRepostCount\":"+Integer.toString(extRepostCount)+"}";
                                }

                                UpdateRequest esRequest = new UpdateRequest("urls", "doc", foundId);
                                esRequest.retryOnConflict(7);
                                esRequest.doc(jsonStringUpdateOld, XContentType.JSON);
                                this.esClient.update(esRequest, RequestOptions.DEFAULT);
                            } else {
                                foundId = null;
                            }
                        }
                    }

                    String jsonString = "{\"createdAt\":\""+currentDate+"\",";
                    if (foundId==null) {
                        String keywords[] = splitLines[1].split(":");
                        Map<String,Integer> keyWordsmap = new HashMap<String,Integer>();

                        for(String keyword:keywords){
                            if (!keyWordsmap.containsKey(keyword)) {
                                keyWordsmap.put(keyword,1);
                            } else{
                                keyWordsmap.put(keyword, keyWordsmap.get(keyword)+1);
                            }
                        }

                        jsonString+="\"paragraph\":\""+paragraph+"\",\"keywords\":[";

                        for (Map.Entry<String, Integer> entry : keyWordsmap.entrySet()) {
                            jsonString += "{\"keyword\":\""+entry.getKey()+"\",\"count\":"+entry.getValue().toString()+"},";
                        }
                        jsonString = jsonString.substring(0, jsonString.length() - 1);

                        jsonString+="],";
                        jsonString+="\"uniqueKwCount\":"+keyWordsmap.entrySet().size()+",";
                        jsonString+="\"extRepostCount\": 0,";
                        jsonString+="\"intRepostCount\": 0,";
                        jsonString+="\"pHash\":"+pHash+",";
                    }

                    jsonString+="\"pageRank\":"+pageRank+",";
                    if (foundId!=null) {
                        jsonString+="\"masterParagraphUrlId\":\""+foundId+"\",";
                    }
                    jsonString+="\"domainName\":\""+domainName+"\"";
                    jsonString+="}";

                    UpdateRequest esRequest = new UpdateRequest("urls", "doc", urlIdHash);
		            esRequest.retryOnConflict(7);
                    esRequest.doc(jsonString, XContentType.JSON);
                    esRequest.docAsUpsert(true);
                    this.esClient.update(esRequest, RequestOptions.DEFAULT);
                    setState(archive,"completed");
                } else {
                    throw new Exception("Splitlines! "+line);
                }
            } else {
                setState(archive,"belowPageRankLimit");
            }
        } else {
            setState(archive,"errorNoDomainFound");
        }
    }
    private String getFilename(String path) {
        String[] paths = path.split("/");
        return paths[paths.length-1];
    }
}
