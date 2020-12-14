package org.cf.acks;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
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

    private static final Logger logger = LogManager.getLogger(WetArchiveProcessor.class);

    public final int BUFFER_SIZE = 128_000;
    public final int MIN_LINE_LENGTH = 120;
    public final int MAX_LINE_LENGTH = 2000;

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

    final static boolean DELETE_FILES = false;

    private final Semaphore schedulingSemaphore;
    private boolean haveWrittenDomainLine = false;
    private final String archive;
    private ArrayList<KeywordEntry> keywordEntries;

    WetArchiveProcessor(Semaphore schedulingSemaphore, ArrayList<KeywordEntry> keywordEntries, String archive)
            throws IOException {
        this.schedulingSemaphore = schedulingSemaphore;
        this.keywordEntries = keywordEntries;
        this.archive = archive;
    }

    @Override
    public void run() {
        System.out.println("Scanning: " + archive);
        if (archive != null & archive.length() > 0) {
            File file = new File(archive);
            while (file.exists() == false) {
                try {
                    Random rand = new Random();
                    int n = rand.nextInt(3500);
                    n += 4500;
                    System.out.println("Waiting on file to scan: " + archive + " " + n / 1000 + "s");
                    Thread.sleep(n);
                } catch (Exception ex) {
                    System.out.println("Error sleeping in thread: " + ex.getMessage());
                }
            }

            String currentURL = null; // Should never be null in practice.
            long startTime = System.currentTimeMillis();

            Scanner keywordHyperScanner = new Scanner();
            HashMap<Expression, KeywordEntry> expressionToKeywordEntries = new HashMap<Expression, KeywordEntry>();

            Database keywordHyperDatabase = setupExpressionsAndDatabase(keywordHyperScanner, expressionToKeywordEntries);

            try (final InputStream objectStream = new FileInputStream(new File(archive));
                final GZIPInputStream gzipObjectStream = new GZIPInputStream(new AlwaysAvailableStream(objectStream), BUFFER_SIZE);
                final BufferedReader contentReader = new BufferedReader(new InputStreamReader(gzipObjectStream, StandardCharsets.UTF_8), BUFFER_SIZE);) {

                boolean processingEntry = false;

                String outPath = "results/"+getFilename(archive)+".scanned";
                Writer resultsWriter = new BufferedWriter(new FileWriter(new File(outPath+".working")));

                String line;
                String currentDate = null;
                int paragraphNumber = 1;
                while ((line = contentReader.readLine()) != null) {
                    if (line.startsWith(CONVERSION_MARKER)) {
                        processingEntry = true;
                        currentURL = null;
                        currentDate = null;
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
                                    if (!hasTooManyCommas(line) && !(line.contains("function") && line.contains("{"))) {
                                        System.out.println(line);
                                        processLineForKeywords(expressionToKeywordEntries, keywordHyperScanner, keywordHyperDatabase, paragraphNumber, currentURL, line, resultsWriter, currentDate);
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
                keywordHyperScanner.close();
                if (DELETE_FILES) {
                    if (file.delete())
                    {
                        //System.out.println(archive+" deleted");
                    }
                    else
                    {
                        System.out.println(archive+" FAILED!");
                    }
                }
                long duration = System.currentTimeMillis() - startTime;
                resultsWriter.write("Duration\n");
                resultsWriter.write(duration + "\n");
                resultsWriter.close();
                File finalFile = new File(outPath+".working");
                boolean renameResult = finalFile.renameTo(new File(outPath));
            } catch (IOException io) {
                logger.catching(io);
                System.out.println("Error for: "+archive);
            } finally {
                schedulingSemaphore.release();
            }
        } else {
            System.out.println("Empty: "+archive);
        }
    }

    private String transformExpression(int index, String expressionPart) {
        expressionPart = expressionPart.replaceAll(" ",".");
        if (expressionPart.startsWith("*")) {
            expressionPart = expressionPart.substring(1);
        } else {
            expressionPart = "\\b"+expressionPart;
        }
        if (expressionPart.endsWith("*")) {
            expressionPart= expressionPart.substring(0, expressionPart.length() - 1);
        } else {
            expressionPart = expressionPart+"\\b";
        }
        expressionPart = expressionPart.replaceAll("\\*",".");

        System.out.println(index+": "+expressionPart);

        return expressionPart;
    }

    private Database setupExpressionsAndDatabase(Scanner keywordHyperScanner, HashMap<Expression, KeywordEntry> expressionToKeywordEntries) {
        Database keywordHyperDatabase;
        try {
            Integer expressionCounter = 0;
            int keywordEntriesSize = keywordEntries.size();
            List<Expression> scanExpressions = new ArrayList<Expression>();
            for (int keyIndex = 0; keyIndex < keywordEntriesSize; keyIndex++) {
                List<String> expressionStrings = keywordEntries.get(keyIndex).scanExpressions;
                if (expressionStrings.size()==1) {
                    Expression scanExpression = new Expression(transformExpression(expressionCounter, expressionStrings.get(0)));
                    scanExpressions.add(scanExpression);
                    expressionCounter++;
                } else {
                    String combinedString = "(";
                    for (int eIndex = 0; eIndex < expressionStrings.size(); eIndex++) {
                        String expressionString = expressionStrings.get(eIndex);
                        if (expressionString.contains("|")) {
                            combinedString += expressionCounter + "(";
                            String[] splitString = expressionString.split("|");
                            for (int s=0; s<splitString.length; s++) {
                                Expression scanExpression = new Expression(transformExpression(expressionCounter, expressionString),  EnumSet.of(ExpressionFlag.QUIET));
                                scanExpressions.add(scanExpression);
                                combinedString += expressionCounter;
                                if (s!=splitString.length-1) {
                                    combinedString += " | ";
                                }
                                expressionCounter++;
                            }
                            combinedString += expressionCounter + ")";
                            if (eIndex!=expressionStrings.size()-1) {
                                combinedString += " & ";
                            }
                        } else if (expressionString.startsWith("-")) {
                            expressionString = expressionString.substring(1);
                            Expression scanExpression = new Expression(transformExpression(expressionCounter, expressionString),  EnumSet.of(ExpressionFlag.QUIET));
                            scanExpressions.add(scanExpression);
                            combinedString += "!" + expressionCounter;
                            if (eIndex!=expressionStrings.size()-1) {
                                combinedString += " & ";
                            }
                            expressionCounter++;
                        } else {
                            Expression scanExpression = new Expression(transformExpression(expressionCounter, expressionString),  EnumSet.of(ExpressionFlag.QUIET));
                            scanExpressions.add(scanExpression);
                            combinedString += expressionCounter;
                            if (eIndex!=expressionStrings.size()-1) {
                                combinedString += " & ";
                            }
                            expressionCounter++;
                        }
                    }
                    combinedString += ")";
                    System.out.println(expressionCounter+": "+combinedString);
                    Expression scanExpression = new Expression(combinedString,  EnumSet.of(ExpressionFlag.COMBINATION));
                    scanExpressions.add(scanExpression);
                    expressionCounter++;
                    expressionToKeywordEntries.put(scanExpression, keywordEntries.get(keyIndex));
                }
            }

            keywordHyperDatabase = Database.compile(scanExpressions);

            try {
                keywordHyperScanner.allocScratch(keywordHyperDatabase);
            } catch (Throwable t) {
                try {
                    throw new IOException(t);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } catch (CompileErrorException ce) {
            logger.catching(ce);
            Expression failedExpression = ce.getFailedExpression();
            throw new IllegalStateException("The expression '" + failedExpression.getExpression());
        }

        return keywordHyperDatabase;
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

    private void processLineForKeywords(HashMap<Expression, KeywordEntry> expressionToKeywordEntries, Scanner keywordHyperScanner, Database keywordHyperDatabase, int paragraphNumber, String domain, String line, Writer resultsWriter, String currentDate) throws Throwable {
        String lowerCaseLine = line.toLowerCase();

        List<Integer> matchedIndexes = new ArrayList<Integer>();

        long startTime = System.nanoTime();

        List<Match> matches = keywordHyperScanner.scan(keywordHyperDatabase,lowerCaseLine);

        if (matches.size()>0) {
            HashSet<Match> unqiueMatches = new HashSet<Match>(matches);
            for (Match match : unqiueMatches) {
                matchedIndexes.add(expressionToKeywordEntries.get(match.getMatchedExpression()).index);
             }
        }

        //System.out.println(System.nanoTime() - startTime);

        if (matchedIndexes.size()>0) {
            System.out.print(".");
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

            resultsWriter.write(line+keywords+"\n");
       }
    }

    private String getFilename(String path) {
        String[] paths = path.split("/");
        return paths[paths.length-1];
    }
}
