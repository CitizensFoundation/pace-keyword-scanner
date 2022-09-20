package org.cf.acks;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.zip.GZIPInputStream;
import com.gliwka.hyperscan.wrapper.CompileErrorException;
import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Expression;
import com.gliwka.hyperscan.wrapper.ExpressionFlag;
import com.gliwka.hyperscan.wrapper.Match;
import com.gliwka.hyperscan.wrapper.Scanner;

public class WetArchiveProcessor implements Runnable {

    final static boolean DELETE_FILES = true;

    final static boolean PAGE_MODE = false;

    private static final Logger logger = LogManager.getLogger(WetArchiveProcessor.class);

    public final int BUFFER_SIZE = 2_000_000;
    public final int MIN_LINE_LENGTH = 25;
    public final int MAX_LINE_LENGTH = 3500;

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
    private boolean haveWrittenDomainLine = false;
    private String archive;
    private HashMap<Expression, Integer> expressionToKeywordEntries;

    private Database keywordHyperDatabase;

    WetArchiveProcessor(Semaphore schedulingSemaphore,
                        Database keywordHyperDatabase,
                        HashMap<Expression, Integer>expressionToKeywordEntries,
                        String archive)
            throws IOException {
        this.schedulingSemaphore = schedulingSemaphore;
        this.expressionToKeywordEntries = expressionToKeywordEntries;
        this.keywordHyperDatabase = keywordHyperDatabase;
        this.archive = archive;
    }

    @Override
    public void run() {
        archive = archive.replace("commoncrawl.s3.amazonaws.com", "data.commoncrawl.org");
        System.out.println("Scanning: " + archive);
        logger.info("Scanning: " + archive);
        if (archive != null & archive.length() > 0) {

            String currentURL = null; // Should never be null in practice.
            long startTime = System.currentTimeMillis();

            Scanner keywordHyperScanner = new Scanner();
            HttpURLConnection myURLConnection;

            int maxRetry = 25000;
            int retryCount = 0;
            Boolean retry = true;


            while (retry && retryCount<maxRetry) {
                retryCount+=1;
                try {
                    keywordHyperScanner.allocScratch(keywordHyperDatabase);
                    URL archiveUrl = new URL(archive);
                    myURLConnection = (HttpURLConnection) archiveUrl.openConnection();
                    try (
                        final GZIPInputStream gzipObjectStream = new GZIPInputStream(new AlwaysAvailableStream(myURLConnection.getInputStream()), BUFFER_SIZE);
                        final BufferedReader contentReader = new BufferedReader(new InputStreamReader(gzipObjectStream, StandardCharsets.UTF_8), BUFFER_SIZE);) {

                        boolean processingEntry = false;

                        String outPath = "results/"+getFilename(archive)+".scanned";
                        Writer resultsWriter = new BufferedWriter(new FileWriter(new File(outPath+".working")));

                        String line;
                        String currentDate = null;
                        int paragraphNumber = 1;
                        String wholePage = "";
                        while ((line = contentReader.readLine()) != null) {
                            if (line.startsWith(CONVERSION_MARKER)) {
                                if (PAGE_MODE && wholePage.length()>0) {
                                    processStringForKeywords(expressionToKeywordEntries, keywordHyperScanner, keywordHyperDatabase, paragraphNumber, currentURL, wholePage, resultsWriter, currentDate);
                                }
                                processingEntry = true;
                                currentURL = null;
                                currentDate = null;
                                wholePage = "";
                                paragraphNumber = 1;
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
                                            if (!hasTooManyCommas(line) &&
                                                !line.startsWith("http") &&
                                                !(line.contains("function") && line.contains("{"))) {
                                                    if (PAGE_MODE) {
                                                        wholePage+=line.replaceAll("\\R"," ");
                                                    } else {
                                                        processStringForKeywords(expressionToKeywordEntries, keywordHyperScanner, keywordHyperDatabase, paragraphNumber, currentURL, line, resultsWriter, currentDate);
                                                    }
                                                }
                                        }
                                        paragraphNumber++;
                                    }
                                } catch (Throwable t) {
                                    resultsWriter.close();
                                    throw new IOException(t);
                                }
                                processingEntry = false;
                            }
                        }
                        // Catch the end the WET file in page mode
                        if (PAGE_MODE && wholePage.length()>0) {
                            processStringForKeywords(expressionToKeywordEntries, keywordHyperScanner, keywordHyperDatabase, paragraphNumber, currentURL, wholePage, resultsWriter, currentDate);
                        }
                        keywordHyperScanner.close();
                        long duration = System.currentTimeMillis() - startTime;
                        resultsWriter.write("Duration\n");
                        resultsWriter.write(duration + "\n");
                        resultsWriter.close();
                        File finalFile = new File(outPath+".working");
                        boolean renameResult = finalFile.renameTo(new File(outPath));
                        retry = false;
                    } catch (IOException io) {
                        System.out.println(io.getMessage());
                        if (retryCount<maxRetry) {
                            System.out.println("Retry "+retryCount+" for: "+archive);
                            logger.info("Retry "+retryCount+" for: "+archive);
                            try {
                                Thread.sleep(500);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        } else {
                            retry = false;
                            System.out.println("Error for: "+archive);
                            logger.error("Error for: "+archive);
                            logger.catching(io);
                        }
                    } finally {
                        schedulingSemaphore.release();
                    }
                } catch (Throwable t) {
                    if (retryCount<maxRetry) {
                        System.out.println("Retry "+retryCount+" for: "+archive);
                        logger.info("Retry "+retryCount+" for: "+archive);
                        try {
                            Thread.sleep(1100);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else {
                        retry = false;
                        try {
                            throw new IOException(t);
                        } catch (IOException e) {
                            logger.catching(e);
                            e.printStackTrace();
                        }
                    }
                }
            }

        } else {
            System.out.println("Empty: "+archive);
            logger.error("Empty: "+archive);
        }
        logger.info("Completed: " + archive);
        System.gc();
    }

    private boolean hasTooManyCommas(String text) {
        Double count = Double.valueOf(StringUtils.countMatches(text, ","));
        Double textLength = Double.valueOf(text.length());
        Double ratio = count/textLength;
        if (ratio>0.04) {
            //System.out.println("Skipping ("+ratio+"): "+text);
            return true;
        } else {
            return false;
        }
    }

    private void processStringForKeywords(HashMap<Expression, Integer> expressionToKeywordEntries, Scanner keywordHyperScanner, Database keywordHyperDatabase, int paragraphNumber, String domain, String line, Writer resultsWriter, String currentDate) throws Throwable {
        String lowerCaseLine = line.toLowerCase();

        List<Integer> matchedIndexes = new ArrayList<Integer>();

        long startTime = System.nanoTime();

        List<Match> matches = keywordHyperScanner.scan(keywordHyperDatabase,lowerCaseLine);

        if (matches.size()>0) {
            //System.out.println(lowerCaseLine);
            //System.out.println(matches.size());
            int matchesSize = matches.size();
            for (int m=0;m<matchesSize;m++) {
                matchedIndexes.add(expressionToKeywordEntries.get(matches.get(m).getMatchedExpression()));
                //System.out.println(match.getMatchedExpression().getExpression());
            }
        }

        //System.out.println(System.nanoTime() - startTime);

        if (matchedIndexes.size()>0) {
            //System.out.print(".");
            if (!this.haveWrittenDomainLine) {
                this.haveWrittenDomainLine = true;
                resultsWriter.write("\n");
                resultsWriter.write(domain+ "\n");
                resultsWriter.write(currentDate+ "\n");
            }
            String keywords = "kx72dAx";
            for (int x=0; x<matchedIndexes.size();x++) {
                Integer matchIndex = matchedIndexes.get(x);
                keywords += matchIndex+",";
            }
            if (keywords.endsWith(",")) {
                keywords= keywords.substring(0, keywords.length() - 1);
            }
            keywords += ":"+paragraphNumber;
            //keywords += "==="+matchedIndexes.size()+"===";
            //keywords += "!!!"+matches.size()+"!!!";

            resultsWriter.write(line+keywords+"\n");
       }
    }

    private String getFilename(String path) {
        String[] paths = path.split("/");
        return paths[paths.length-1]+"."+path.hashCode();
    }
}
