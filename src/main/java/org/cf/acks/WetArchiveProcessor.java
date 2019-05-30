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

            Writer resultsWriter = new BufferedWriter(new FileWriter(new File("log/"+getFilename(archive)+".scanned")));

            String line;
            while ((line = contentReader.readLine()) != null) {
                if (line.startsWith(StringBundle.CONVERSION_MARKER)) {
                    processingEntry = true;
                    currentURL = null;
                    this.haveWrittenDomainLine = false;
                } else if (processingEntry && line.startsWith(StringBundle.TARGET_URI_MARKER)) {
                    currentURL = line;
                    currentURL = currentURL.replace(StringBundle.TARGET_URI_MARKER+" ", "");
                } else if (processingEntry && currentURL != null && line.startsWith(StringBundle.CONTENT_LENGTH)) {
                    line = contentReader.readLine();

                    try {
                        while ((line = contentReader.readLine()) != null && ! line.equals(StringBundle.WARC_VERSION)) {
                            if (line.length()>100) {
                                processLineForKeywords(scanner, currentURL, line.toLowerCase(), resultsWriter);
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
        } finally {
            schedulingSemaphore.release();
        }

        logger.info("Finished archive {}.", archive);
    }

    private void processLineForKeywords(Scanner scanner, String domain, String line, Writer resultsWriter) throws Throwable {
        final List<Match> matches = scanner.scan(patternDB, line);
        if (matches.size()>1) {
            if (!this.haveWrittenDomainLine) {
                this.haveWrittenDomainLine = true;
                resultsWriter.write("\n");
                resultsWriter.write("URL: "+domain+ "\n");
            }
            resultsWriter.write("MATCH: "+line+ "\n");
            resultsWriter.write("NUMBEROFMATCHES: "+matches.size()+ "\n");
            logger.info("Found {} matches m/s for domain {} page with length {}.", matches.size(), domain, line.length());
            for (Match match : matches) {
                logger.debug("{} - Pattern: {}", domain, match.getMatchedExpression().getExpression());
                resultsWriter.write("KEYWORD: "+match.getMatchedExpression().getExpression().replace("\\b", "")+ "\n");
            }
       }
    }

    private String getFilename(String path) {
        String[] paths = path.split("/");
        return paths[paths.length-1];
    }
}
