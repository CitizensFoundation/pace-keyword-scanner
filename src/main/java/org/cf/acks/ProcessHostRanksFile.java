package org.cf.acks;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import net.openhft.hashing.LongHashFunction;

import org.apache.http.HttpHost;

import java.io.*;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class ProcessHostRanksFile implements Runnable {

    private static final Logger logger = LogManager.getLogger(ImportToES.class);

    public final int BUFFER_SIZE = 128_000;

    private final String archive;

    private final int PAGE_RANK_MIN = 4_000_001;

    private final boolean FORCE_ALL = true;

    ProcessHostRanksFile(String archive) {
        this.archive = archive;
    }

    @Override
    public void run() {
        try {
            final InputStream objectStream = new FileInputStream(new File(archive));
            final GZIPInputStream gzipObjectStream = new GZIPInputStream(new AlwaysAvailableStream(objectStream), BUFFER_SIZE);
            final BufferedReader contentReader = new BufferedReader(new InputStreamReader(gzipObjectStream, StandardCharsets.UTF_8), BUFFER_SIZE);

            final OutputStream outputStream = new FileOutputStream(new File(archive+".processed.gz"));
            final GZIPOutputStream gzipOutputStream = new GZIPOutputStream(outputStream, BUFFER_SIZE);
            final BufferedWriter contentWriter = new BufferedWriter(new OutputStreamWriter(gzipOutputStream, StandardCharsets.UTF_8), BUFFER_SIZE);

            String line;
            while ((line = contentReader.readLine()) != null) {
                if (!line.contains("#harmonicc_pos")) {
                    String[] parts = line.split("\\t");
                    final List<String> components = Arrays.asList(parts[4].split("\\."));
                    Collections.reverse(components);
                    String domainName = String.join(".", components);
                    domainName = domainName.replace("www.","");
                    Long position = Long.valueOf(parts[0]);
                    Double score = Double.valueOf(parts[1]);
                    Long domainHash = LongHashFunction.xx().hashChars(domainName);
                    if (FORCE_ALL || position<PAGE_RANK_MIN) {
                        contentWriter.write(position.toString()+" "+domainHash.toString()+"\n");
                    } else {
                        break;
                    }
                }
            }
            contentReader.close();
            contentWriter.close();
        } catch (IOException io) {
            logger.catching(io);
        }
    }
}
