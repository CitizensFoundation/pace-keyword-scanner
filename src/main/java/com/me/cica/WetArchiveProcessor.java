package com.me.cica;

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

    private final Semaphore schedulingSemaphore;
    private final Database patternDB;
    private final String archive;
    private final Writer domainsWithAds;
    private final Writer domainsWithoutAds;
    private final Writer matchingStatistics;

    WetArchiveProcessor(Semaphore schedulingSemaphore, Database patternDB, String archive,
                         Writer domainsWithAds, Writer domainsWithoutAds, Writer matchingStatistics) {
        this.schedulingSemaphore = schedulingSemaphore;
        this.patternDB = patternDB;
        this.archive = archive;
        this.domainsWithAds = domainsWithAds;
        this.domainsWithoutAds = domainsWithoutAds;
        this.matchingStatistics = matchingStatistics;
    }

    @Override
    public void run() {
        try (final InputStream objectStream = new URL(archive).openStream();
            final GZIPInputStream gzipObjectStream = new GZIPInputStream(new AlwaysAvailableStream(objectStream), BUFFER_SIZE);
            final BufferedReader contentReader = new BufferedReader(new InputStreamReader(gzipObjectStream, StandardCharsets.UTF_8), BUFFER_SIZE);
            final Scanner scanner = new Scanner()) {

            try {
                scanner.allocScratch(patternDB); // Memory allocation. Scanner#close() will de-allocate resources.
            } catch (Throwable t) {
                throw new IOException(t);
            }

            boolean processingEntry = false;
            String currentURL = null; // Should never be null in practice.

            String line;
            while ((line = contentReader.readLine()) != null) {
                if (line.startsWith(StringBundle.CONVERSION_MARKER)) {
                    processingEntry = true;
                    currentURL = null;
                } else if (processingEntry && line.startsWith(StringBundle.TARGET_URI_MARKER)) {
                    currentURL = getValue(line);
                    currentURL = currentURL.replace(StringBundle.TARGET_URI_MARKER+" ", "");
                } else if (processingEntry && currentURL != null && line.startsWith(StringBundle.HTTP_HEADER_RESPONSE_OK)) {
                    // HTTP header found. Read lines until Content-Length and Content-Type are found.
                    line = readUntilStartsWith(StringBundle.CONTENT_TYPE, contentReader);

                    if (line == null) {
                        logger.warn("WARC entry incomplete due to archive split for domain {}. Skipping.", currentURL);
                        processingEntry = false;
                        continue;
                    }

                    String contentType = getValue(line);

                    if (! contentType.toLowerCase().startsWith(StringBundle.ENTITY_TYPE)) {
                        logger.info("Unsupported entity {} found for {}. Skipping page.", contentType, currentURL);
                        processingEntry = false;
                        continue;
                    }

                    readUntilEmptyLine(contentReader);

                    StringBuilder htmlContent = new StringBuilder();
                    while ((line = contentReader.readLine()) != null && ! line.equals(StringBundle.WARC_VERSION)) {
                        htmlContent.append(line);
                    }

                    // Now check for advertisements.
                    try {
                        boolean servesAds = doesPageServeAds(scanner, currentURL, htmlContent.toString());

                        if (servesAds) {
                            logger.info("Domain {} serves ads.", currentURL);
                            domainsWithAds.write(currentURL);
                            domainsWithAds.write('\n');
                        } else {
                            logger.info("No ads served by {} domain.", currentURL);
                            domainsWithoutAds.write(currentURL);
                            domainsWithoutAds.write('\n');
                        }
                    } catch (Throwable t) {
                        // This signifies a serious error that is likely to be environmental and cannot be handled.
                        throw new IOException(t);
                    }

                    processingEntry = false;
                }
            }
        } catch (IOException io) {
            logger.catching(io);
        } finally {
            schedulingSemaphore.release();
        }

        logger.info("Finished archive {}.", archive);
    }

    private boolean doesPageServeAds(Scanner scanner, String domain, String pageContent) throws Throwable {
        long startTime = System.currentTimeMillis();

        final List<Match> matches = scanner.scan(patternDB, pageContent);

        long duration = System.currentTimeMillis() - startTime;

        logger.info("Found {} matches in {} m/s for domain {} page with length {}.", matches.size(), duration, domain, pageContent.length());
        matchingStatistics.write(pageContent.length() + ":" + duration + "\n");
        /*if (debugMode) {
            for (Match match : matches) {
                logger.debug("{} - Pattern: {}", domain, match.getMatchedExpression().getExpression());
            }
        }*/

        return ! matches.isEmpty();
    }

    private String getValue(String header) {
        return header.split(":")[1].trim();
    }

    private String readUntilEmptyLine(BufferedReader contentReader) throws IOException {
        String line;
        while ((line = contentReader.readLine()) != null && ! line.isEmpty()) {
            // Intentionally blank.
        }

        return line;
    }

    private String readUntilStartsWith(String text, BufferedReader contentReader) throws IOException {
        String line;
        while ((line = contentReader.readLine()) != null && ! line.startsWith(text)) {
            // Intentionally blank.
        }

        return line;
    }
}
