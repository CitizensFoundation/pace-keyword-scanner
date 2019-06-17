package org.cf.acks;

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
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;

import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.common.xcontent.XContentType;

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

        try {
            final InputStream objectStream = new FileInputStream(new File(archive));
            final BufferedReader contentReader = new BufferedReader(new InputStreamReader(objectStream, StandardCharsets.UTF_8), BUFFER_SIZE);
            this.esClient = new RestHighLevelClient(
                RestClient.builder(
                        new HttpHost(this.esHostname, 9200, "http"),
                        new HttpHost(this.esHostname, 9201, "http")));

            GetIndexRequest request = new GetIndexRequest("urls");
            boolean exists = this.esClient.indices().exists(request, RequestOptions.DEFAULT);
            if (!exists) {
                CreateIndexRequest createRequest = new CreateIndexRequest("urls");
                CreateIndexResponse createIndexResponse = this.esClient.indices().create(createRequest, RequestOptions.DEFAULT);
            }

            boolean processingEntry = false;

            Writer resultsWriter = new BufferedWriter(new FileWriter(new File("results/"+getFilename(archive)+".scanned")));

            String line;
            String currentDate = null;
            while ((line = contentReader.readLine()) != null) {
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
                                break;
                            } else {
                                importLinesToES(currentURL, line, resultsWriter, currentDate);
                            }
                        }
                    } catch (Throwable t) {
                        throw new IOException(t);
                    }
                    processingEntry = false;
                }
            }
            esClient.close();
            long duration = System.currentTimeMillis() - startTime;
            resultsWriter.write("Duration\n");
            resultsWriter.write(duration + "\n");
            resultsWriter.close();
        } catch (IOException io) {
            logger.catching(io);
        } finally {
            schedulingSemaphore.release();
        }
    }

    private void importLinesToES(String url, String line, Writer resultsWriter, String currentDate) throws Throwable {
        String splitLines[] = line.split("kd8x72dAx");
        url = url.substring(0, Math.min(512, url.length()));
        URI uri = new URI(url);
        String domainName = uri.getHost();
        Long domainHash = LongHashFunction.xx().hashChars(domainName);
        Long pageRank = this.pageRanks.get(domainHash);

        if (pageRank!=null) {
            if (splitLines.length>1) {
                String paragraph = splitLines[0].replaceAll("\"","");
                JsonStringEncoder e = JsonStringEncoder.getInstance();
                paragraph = new String(e.quoteAsString(paragraph));
                String keywords[] = splitLines[1].split(":");
                Map<String,Integer> keyWordsmap = new HashMap<String,Integer>();

                for(String keyword:keywords){
                    if (!keyWordsmap.containsKey(keyword)) {
                        keyWordsmap.put(keyword,1);
                    } else{
                        keyWordsmap.put(keyword, keyWordsmap.get(keyword)+1);
                    }
                }

                String jsonString = "{\"createdAt\":\""+currentDate+"\",\"paragraph\":\""+paragraph+"\",\"keywords\":[";

                for (Map.Entry<String, Integer> entry : keyWordsmap.entrySet()) {
                    jsonString += "{\"keyword\":\""+entry.getKey()+"\",\"count\":"+entry.getValue().toString()+"},";
                }
                jsonString = jsonString.substring(0, jsonString.length() - 1);

                jsonString+="],\"pageRank\":"+pageRank+"}";

                UpdateRequest esRequest = new UpdateRequest("urls", url);
                esRequest.doc(jsonString, XContentType.JSON);
                esRequest.docAsUpsert(true);
                UpdateResponse updateResponse = this.esClient.update(esRequest, RequestOptions.DEFAULT);
            } else {
                throw new Exception("Splitlines! "+line);
            }
        } else {
            String go = "go";
        }
    }
    private String getFilename(String path) {
        String[] paths = path.split("/");
        return paths[paths.length-1];
    }
}
