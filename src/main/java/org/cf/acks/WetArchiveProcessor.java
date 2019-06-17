package org.cf.acks;

import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Match;
import com.gliwka.hyperscan.wrapper.Scanner;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;


public class WetArchiveProcessor implements Runnable {

    private static final Logger logger = LogManager.getLogger(WetArchiveProcessor.class);

    public final int BUFFER_SIZE = 128_000;
    public final int MIN_LINE_LENGTH = 100;
    public final int MAX_LINE_LENGTH = 750;
    public final int MIN_KEYWORDS_FOR_RECORDING = 2;

    final static String WARC_VERSION = "WARC/1.0";
    final static String REQUEST_MARKER = "WARC-Type: request";
    final static String CONVERSION_MARKER = "WARC-Type: conversion";
    final static String TARGET_URI_MARKER = "WARC-Target-URI:";
    final static String TARGET_DATE = "WARC-Date:";
    final static String CONTENT_TYPE = "Content-Type";
    final static String CONTENT_LENGTH = "Content-Length";
    final static String ENTITY_TYPE = "text/html";
    final static String HTTP_HEADER_RESPONSE_OK = "HTTP/1.1 200 OK";
    final static String HTTP_HEADER_HOST = "Host: ";

    private final Semaphore schedulingSemaphore;
    private final Database patternDB;
    private boolean haveWrittenDomainLine = false;
    private final String archive;

    WetArchiveProcessor(Semaphore schedulingSemaphore, Database patternDB, String archive) {
        this.schedulingSemaphore = schedulingSemaphore;
        this.patternDB = patternDB;
        this.archive = archive;
    }

    @Override
    public void run() {
        System.out.println("Scanning: "+archive);
        if (archive!=null & archive.length()>0) {
            String currentURL = null; // Should never be null in practice.
            long startTime = System.currentTimeMillis();
            try (final InputStream objectStream = new FileInputStream(new File(archive));
                final GZIPInputStream gzipObjectStream = new GZIPInputStream(new AlwaysAvailableStream(objectStream), BUFFER_SIZE);
                final BufferedReader contentReader = new BufferedReader(new InputStreamReader(gzipObjectStream, StandardCharsets.UTF_8), BUFFER_SIZE);
                final Scanner scanner = new Scanner()) {

                try {
                    scanner.allocScratch(patternDB); // Memory allocation. Scanner#close() will de-allocate resources.
                } catch (Throwable t) {
                    throw new IOException(t);
                }

                boolean processingEntry = false;

                Writer resultsWriter = new BufferedWriter(new FileWriter(new File("results/"+getFilename(archive)+".scanned")));

                String line;
                String currentDate = null;
                while ((line = contentReader.readLine()) != null) {
                    if (line.startsWith(CONVERSION_MARKER)) {
                        processingEntry = true;
                        currentURL = null;
                        currentDate = null;
                        this.haveWrittenDomainLine = false;
                    } else if (processingEntry && line.startsWith(TARGET_URI_MARKER)) {
                        currentURL = line;
                        currentURL = currentURL.replace(TARGET_URI_MARKER+" ", "");
                    } else if (processingEntry && line.startsWith(TARGET_DATE)) {
                        currentDate = line;
                        currentDate = currentDate.replace(TARGET_DATE+" ", "");
                    } else if (processingEntry && currentURL != null && currentDate != null && line.startsWith(CONTENT_LENGTH)) {
                        line = contentReader.readLine();

                        try {
                            while ((line = contentReader.readLine()) != null && ! line.equals(WARC_VERSION)) {
                                if (line.length()>MIN_LINE_LENGTH && line.length()<MAX_LINE_LENGTH) {
                                    processLineForKeywords(scanner, currentURL, line, resultsWriter, currentDate);
                                }
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
                System.out.println("Error for: "+archive);
            } finally {
                schedulingSemaphore.release();
            }
        } else {
            System.out.println("Empty: "+archive);
        }

        logger.info("Finished archive {}.", archive);
    }

    private void processLineForKeywords(Scanner scanner, String domain, String line, Writer resultsWriter, String currentDate) throws Throwable {
        final List<Match> matches = scanner.scan(patternDB, line.toLowerCase());
        if (matches.size()>=MIN_KEYWORDS_FOR_RECORDING) {
            if (!this.haveWrittenDomainLine) {
                this.haveWrittenDomainLine = true;
                resultsWriter.write("\n");
                resultsWriter.write(domain+ "\n");
                resultsWriter.write(currentDate+ "\n");
            }
            String keywords = "kd8x72dAx";
            for (Match match : matches) {
                keywords += match.getMatchedExpression().getExpression().replace("\\b", "")+ ":";
            }
            resultsWriter.write(line+keywords+"\n");
       }
    }

    private String getFilename(String path) {
        String[] paths = path.split("/");
        return paths[paths.length-1];
    }
}
