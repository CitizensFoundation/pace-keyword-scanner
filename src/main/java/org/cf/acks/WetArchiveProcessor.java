package org.cf.acks;

import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Match;
import com.gliwka.hyperscan.wrapper.Scanner;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;


public class WetArchiveProcessor implements Runnable {

    private static final Logger logger = LogManager.getLogger(WetArchiveProcessor.class);

    public final int BUFFER_SIZE = 128_000;
    public final int MIN_LINE_LENGTH = 120;
    public final int MAX_LINE_LENGTH = 1000;
    public final int MIN_ESSENTIAL_KEYWORDS_FOR_RECORDING = 1;

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
    private final Database essentialPatternDB;
    private final Database additionalPatternDB;
    private boolean haveWrittenDomainLine = false;
    private final String archive;

    WetArchiveProcessor(Semaphore schedulingSemaphore, Database essentialPatternDB, Database additionalPatternDB, String archive) {
        this.schedulingSemaphore = schedulingSemaphore;
        this.essentialPatternDB = essentialPatternDB;
        this.additionalPatternDB = additionalPatternDB;
        this.archive = archive;
    }

    @Override
    public void run() {
        System.out.println("Scanning: "+archive);
        if (archive!=null & archive.length()>0) {
            File file = new File(archive);
            while (file.exists()==false) {
                try {
                    Random rand = new Random();
                    int n = rand.nextInt(3500);
                    n += 4500;
                    System.out.println("Waiting on file to scan: "+archive+" "+n/1000+"s");
                    Thread.sleep(n);
                } catch (Exception ex) {
                    System.out.println("Error sleeping in thread: "+ex.getMessage());
                }
            }

            String currentURL = null; // Should never be null in practice.
            long startTime = System.currentTimeMillis();
            try (final InputStream objectStream = new FileInputStream(new File(archive));
                final GZIPInputStream gzipObjectStream = new GZIPInputStream(new AlwaysAvailableStream(objectStream), BUFFER_SIZE);
                final BufferedReader contentReader = new BufferedReader(new InputStreamReader(gzipObjectStream, StandardCharsets.UTF_8), BUFFER_SIZE);
                final Scanner essentialScanner = new Scanner();
                final Scanner additionalScanner = new Scanner();) {

                try {
                    essentialScanner.allocScratch(essentialPatternDB);
                    additionalScanner.allocScratch(additionalPatternDB);
                } catch (Throwable t) {
                    throw new IOException(t);
                }

                boolean processingEntry = false;

                String outPath = "results/"+getFilename(archive)+".scanned";
                Writer resultsWriter = new BufferedWriter(new FileWriter(new File(outPath+".working")));

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
                                    if (!hasTooManyCommas(line)) {
                                        processLineForKeywords(essentialScanner, additionalScanner, currentURL, line, resultsWriter, currentDate);
                                    }
                                }
                            }
                        } catch (Throwable t) {
                            throw new IOException(t);
                        }
                        processingEntry = false;
                    }
                }
                if (file.delete())
                {
                    //System.out.println(archive+" deleted");
                }
                else
                {
                    System.out.println(archive+" FAILED!");
                }
                long duration = System.currentTimeMillis() - startTime;
                resultsWriter.write("Duration\n");
                resultsWriter.write(duration + "\n");
                resultsWriter.close();
                File finalFile = new File(outPath+".working");
                boolean renameResult = finalFile.renameTo(new File(outPath));
                essentialScanner.close();
                additionalScanner.close();
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

    private void processLineForKeywords(Scanner essentialScanner, Scanner additionalScanner, String domain, String line, Writer resultsWriter, String currentDate) throws Throwable {
        String lowerCaseLine = line.toLowerCase();
        final List<Match> essentialMatches = essentialScanner.scan(essentialPatternDB, lowerCaseLine);
        if (essentialMatches.size()>=MIN_ESSENTIAL_KEYWORDS_FOR_RECORDING) {
            final List<Match> additionalMatches = additionalScanner.scan(additionalPatternDB, lowerCaseLine);

            if (!this.haveWrittenDomainLine) {
                this.haveWrittenDomainLine = true;
                resultsWriter.write("\n");
                resultsWriter.write(domain+ "\n");
                resultsWriter.write(currentDate+ "\n");
            }
            String keywords = "kd8x72dAx";
            for (Match match : essentialMatches) {
                keywords += match.getMatchedExpression().getExpression().replace("\\b", "")+ "E:";
            }
            for (Match match : additionalMatches) {
                keywords += match.getMatchedExpression().getExpression().replace("\\b", "")+ "A:";
            }
            resultsWriter.write(line+keywords+"\n");
       }
    }

    private String getFilename(String path) {
        String[] paths = path.split("/");
        return paths[paths.length-1];
    }
}
