package org.cf.acks;

import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Match;
import com.gliwka.hyperscan.wrapper.Scanner;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;

public class TestKeywords implements Runnable {

    private static final Logger logger = LogManager.getLogger(TestKeywords.class);
    private final Database patternDB;
    private final String archive;

    TestKeywords(Database patternDB, String archive) {
        this.patternDB = patternDB;
        this.archive = archive;
    }

    String readFile(String path, Charset encoding)
    throws IOException
    {
        byte[] encoded = Files.readAllBytes(Paths.get(path));
        return new String(encoded, encoding);
    }

    @Override
    public void run() {
        System.out.println("Testing: "+archive);
        try {
            final Scanner scanner = new Scanner();
            String content = readFile(archive, StandardCharsets.UTF_8);
            scanner.allocScratch(patternDB); // Memory allocation. Scanner#close() will de-allocate resources.
            final List<Match> matches = scanner.scan(patternDB, content);
            System.out.println("Matches");
            for (Match match : matches) {
                System.out.println( match.getMatchedExpression().getExpression());
            }
            scanner.close();
        } catch (Throwable t) {
            System.out.println("Error: "+t.getMessage());
        }
    }
}
