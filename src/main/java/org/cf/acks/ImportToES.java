package org.cf.acks;

import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Match;
import com.gliwka.hyperscan.wrapper.Scanner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.http.HttpHost;

import java.io.*;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;

import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;


public class ImportToES implements Runnable {

    private static final Logger logger = LogManager.getLogger(ImportToES.class);

    public final int BUFFER_SIZE = 128_000;

    private final Semaphore schedulingSemaphore;
    private boolean haveWrittenDomainLine = false;
    private final String archive;
    private final String esHostname;

    ImportToES(Semaphore schedulingSemaphore, String archive, String esHostname) {
        this.schedulingSemaphore = schedulingSemaphore;
        this.archive = archive;
        if (esHostname!=null) {
            this.esHostname = esHostname;
        } else {
            this.esHostname = "localhost";
        }
    }

    @Override
    public void run() {
        String currentURL = null; // Should never be null in practice.
        long startTime = System.currentTimeMillis();
        RestHighLevelClient esClient = new RestHighLevelClient(
            RestClient.builder(
                    new HttpHost(this.esHostname, 9200, "http"),
                    new HttpHost(this.esHostname, 9201, "http")));

        try {
            final InputStream objectStream = new FileInputStream(new File(archive);
            final BufferedReader contentReader = new BufferedReader(new InputStreamReader(objectStream, StandardCharsets.UTF_8), BUFFER_SIZE);

            boolean processingEntry = false;

            Writer resultsWriter = new BufferedWriter(new FileWriter(new File("results/"+getFilename(archive)+".scanned")));

            String line;
            String currentDate = null;
            while ((line = contentReader.readLine()) != null) {
                if (line.length()==0) {
                    processingEntry = true;
                    currentURL = null;
                    currentDate = null;
                    this.haveWrittenDomainLine = false;
                } else if (processingEntry && line.startsWith(StringBundle.TARGET_URI_MARKER)) {
                    currentURL = line;
                    currentURL = currentURL.replace(StringBundle.TARGET_URI_MARKER+" ", "");
                } else if (processingEntry && line.startsWith(StringBundle.TARGET_DATE)) {
                    currentDate = line;
                    currentDate = currentDate.replace(StringBundle.TARGET_DATE+" ", "");
                } else if (processingEntry && currentURL != null && currentDate != null && line.startsWith(StringBundle.CONTENT_LENGTH)) {
                    line = contentReader.readLine();
                    try {
                        while ((line = contentReader.readLine()) != null && ! line.equals("")) {
                            importLinesToES(currentURL, line, resultsWriter, currentDate);
                        }
                    } catch (Throwable t) {
                        throw new IOException(t);
                    }
                    processingEntry = false;
                }
            }
            long duration = System.currentTimeMillis() - startTime;
            resultsWriter.write("Duration\n");
            resultsWriter.write(duration + "\n");
            resultsWriter.close();
        } catch (IOException io) {
            logger.catching(io);
        } finally {
            schedulingSemaphore.release();
        }
        esClient.close();
        logger.info("Finished archive {}.", archive);
    }

    private void importLinesToES(String url, String line, Writer resultsWriter, String currentDate) throws Throwable {
        String splitLines[] = line.split("#!kw&72$!");
        String paragraph = splitLines[0];
        String keywords[] = splitLines[1].split(":");
        UpdateRequest request = new UpdateRequest("urls", url);
        String jsonString = "{\"createdAt\":\""+currentDate+"\"},\"paragraph:\""+paragraph+"\",\"keywords:[";
        for (String keywords : keywords) {
            jsonString += '{"keyword"}';
        }


    }

    private String getFilename(String path) {
        String[] paths = path.split("/");
        return paths[paths.length-1];
    }
}
