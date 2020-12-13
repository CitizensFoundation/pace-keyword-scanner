package org.cf.acks;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.zip.GZIPInputStream;
import com.gliwka.hyperscan.wrapper.CompileErrorException;
import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Expression;
import com.gliwka.hyperscan.wrapper.Match;
import com.gliwka.hyperscan.wrapper.Scanner;

public class WetArchiveProcessor implements Runnable {

    private static final Logger logger = LogManager.getLogger(WetArchiveProcessor.class);

    public final int BUFFER_SIZE = 128_000;
    public final int MIN_LINE_LENGTH = 120;
    public final int MAX_LINE_LENGTH = 2500;

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
    private ArrayList<KeywordEntry> keywordEntriesInt;
    private boolean haveWrittenDomainLine = false;
    private final String archive;
    private final String configFilePath;

    WetArchiveProcessor(Semaphore schedulingSemaphore, String configFilePath, String archive)
            throws IOException {
        this.schedulingSemaphore = schedulingSemaphore;
        this.configFilePath = configFilePath;
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

            List<Scanner> keywordHyperScanners = new ArrayList<Scanner>();
            List<Database> keywordHyperDatabases = new ArrayList<Database>();

            ArrayList<KeywordEntry> keywordEntries = getKeywordConfig();

            int keywordEntriesSize = keywordEntries.size();
            for (int keyIndex = 0; keyIndex < keywordEntriesSize; keyIndex++) {
                List<Expression> scanExpressions = new ArrayList<Expression>();
                try {
                    List<String> expressions = keywordEntries.get(keyIndex).scanExpressions;
                    for (int eIndex = 0; eIndex < expressions.size(); eIndex++) {
                        Expression scanExpression = new Expression(expressions.get(eIndex));
                        Database.compile(scanExpression);
                        scanExpressions.add(scanExpression);
                    }
                    Database mainDB;
                    mainDB = Database.compile(scanExpressions);
                    keywordHyperDatabases.add(mainDB);
                } catch (CompileErrorException ce) {
                    logger.catching(ce);
                    Expression failedExpression = ce.getFailedExpression();
                    throw new IllegalStateException("The expression '" + failedExpression.getExpression());
                }
            }

            for (int i = 0; i < keywordHyperDatabases.size(); i++) {
                try {
                    Scanner scanner = new Scanner();
                    scanner.allocScratch(keywordHyperDatabases.get(i));
                    keywordHyperScanners.add(scanner);
                } catch (Throwable t) {
                    try {
                        throw new IOException(t);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

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
                                    if (!hasTooManyCommas(line)) {
                                        processLineForKeywords(keywordEntries, keywordHyperScanners, keywordHyperDatabases, paragraphNumber, currentURL, line, resultsWriter, currentDate);
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

    private  ArrayList<KeywordEntry> getKeywordConfig()  {
        ArrayList<KeywordEntry> keywordEntries =  new ArrayList<KeywordEntry>();
        try {
            BufferedReader reader = new BufferedReader(new FileReader(configFilePath));
            long startTime = System.currentTimeMillis();

            String entry;
            while ((entry = reader.readLine()) != null) {
                if (entry.isEmpty()) {
                    continue;
                }

                String[] entryParts = entry.split(",");

                if (entryParts.length>4) {
                    String language = entryParts[0];
                    String idealogyType = entryParts[1];
                    String topic = entryParts[2];
                    String subTopic = entryParts[3];
                    String searchPattern = "";
                    List<String> minusWords = new ArrayList<String>();
                    List<String> scanExpressions = new ArrayList<String>();

                    for (int i=4; i<entryParts.length; i++) {
                        String expressionPart = entryParts[i];
                        expressionPart = expressionPart.toLowerCase().trim();
                        if (expressionPart.length()>1) {
                            expressionPart = expressionPart.replaceAll(" ",".");
                            if (expressionPart!=null) {
                                if (expressionPart.startsWith("-")) {
                                    expressionPart = expressionPart.replaceAll("-","");
                                    System.out.println("=-=:"+expressionPart);
                                    minusWords.add(expressionPart);
                                } else {
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
                                    scanExpressions.add(expressionPart);
                                    System.out.println(expressionPart);
                                }
                            }
                        }
                    }

                    if (scanExpressions.size()>0) {
                        KeywordEntry keywordEntry = new KeywordEntry(idealogyType, topic, subTopic,
                                                              scanExpressions.size(),
                                                              language, minusWords, scanExpressions);
                        keywordEntries.add(keywordEntry);
                    }
                }
            }

            reader.close();

            long duration = System.currentTimeMillis() - startTime;
            logger.info("Time taken to load and setup keywordEntries (seconds): {}", TimeUnit.SECONDS.convert(duration, TimeUnit.MILLISECONDS));

        } catch (Exception e) {
            logger.error(e);
        }

        return keywordEntries;
    }

    private boolean hasTooManyCommas(String text) {
        Double count = Double.valueOf(StringUtils.countMatches(text, ","));
        Double textLength = Double.valueOf(text.length());
        Double ratio = count/textLength;
        if (ratio>0.05) {
            //System.out.println("Skipping ("+ratio+"): "+text);
            return true;
        } else {
            return false;
        }
    }

    private void processLineForKeywords(ArrayList<KeywordEntry> keywordEntries, List<Scanner> keywordHyperScanners, List<Database> keywordHyperDatabases, int paragraphNumber, String domain, String line, Writer resultsWriter, String currentDate) throws Throwable {
        String lowerCaseLine = line.toLowerCase();

        List<Integer> matchedIndexes = new ArrayList<Integer>();

        long startTime = System.currentTimeMillis();

        List<Expression> expressions = new ArrayList<Expression>();
        int datbasesSize = keywordHyperDatabases.size();
        for (int i=0; i<datbasesSize; i++) {
            List<Match> matches = keywordHyperScanners.get(i).scan(keywordHyperDatabases.get(i),lowerCaseLine);
            if (matches.size()>0) {
                //TODO: Look if we can optimize this distinct
                int matchesSize = matches.size();
                expressions.clear();
                for (int n=0;n<matchesSize;n++) {
                    expressions.add(matches.get(n).getMatchedExpression());
                }
                List<Expression> unqiqueMatches = new ArrayList<>(new HashSet<>(expressions));
                if (unqiqueMatches.size()==keywordEntries.get(i).numberOfKeywords) {
                    boolean skipBecauseOfMinus = false;
                    List<String> minusWords = keywordEntries.get(i).minusWords;
                    for (int x=0;x<minusWords.size();x++) {
                        if (lowerCaseLine.contains(minusWords.get(x))) {
                            skipBecauseOfMinus = true;
                            break;
                        }
                    }

                    if (!skipBecauseOfMinus) {
                        matchedIndexes.add(i);
                    }
                }
            }
        }

        //System.out.println(System.currentTimeMillis() - startTime);

        if (matchedIndexes.size()>0) {
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
