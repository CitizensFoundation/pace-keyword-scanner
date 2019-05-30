package org.cf.acks;

import com.gliwka.hyperscan.wrapper.CompileErrorException;
import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Expression;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.*;

public class Main {

    private static final Logger logger = LogManager.getLogger(Main.class);

    private static List<Expression> loadExpressions(File adPatternFile) throws Throwable {
        BufferedReader reader = new BufferedReader(new FileReader(adPatternFile));

        List<Expression> expressions = new ArrayList<>(10_000);

        long startTime = System.currentTimeMillis();

        String pattern;
        while ((pattern = reader.readLine()) != null) {
            if (pattern.isEmpty()) {
                continue;
            }

            Expression scanExpression = new Expression("\\b"+pattern);

            expressions.add(scanExpression);
            Database.compile(scanExpression);
        }

        reader.close();

        long duration = System.currentTimeMillis() - startTime;
        logger.info("Time taken to load patterns (seconds): {}", TimeUnit.SECONDS.convert(duration, TimeUnit.MILLISECONDS));

        return expressions;
    }

    // Throwable originates from the JNI interface to Hyperscan.
    public static void main(String[] args) throws Throwable {
        final List<String> s3KeyList = Files.readAllLines(Paths.get(args[0]));

        List<Expression> expressions = loadExpressions(new File(args[1]));

        Database patternDB;
        try {
             patternDB = Database.compile(expressions);
        } catch (CompileErrorException ce) {
            logger.catching(ce);
            Expression failedExpression = ce.getFailedExpression();
            throw new IllegalStateException("The expression '" + failedExpression.getExpression() + "' failed to compile: " + failedExpression.getContext());
        }

        logger.info("CPU cores available: {}", Runtime.getRuntime().availableProcessors());

        final int poolSize = Runtime.getRuntime().availableProcessors() - 1;
        final int maxScheduled = poolSize * 3;

        logger.info("Allocating a thread pool of size {}.", poolSize);

        final ExecutorService executorService = Executors.newFixedThreadPool(poolSize);

        long startTime = System.currentTimeMillis();

        try (Writer timingResultsStats = new BufferedWriter(new FileWriter(new File("log/timingResults.stats")))) {

            Semaphore schedulingSemaphore = new Semaphore(maxScheduled);

            for (String key : s3KeyList) {
                schedulingSemaphore.acquire();

                try {
                    executorService.submit(new WetArchiveProcessor(schedulingSemaphore, patternDB, key));
                } catch (RejectedExecutionException ree) {
                    logger.catching(ree);
                }
            }

            // If all permits can be acquired, it can be assumed no more callables are executing.
            schedulingSemaphore.acquire(maxScheduled);

            executorService.shutdown();

            long duration = System.currentTimeMillis() - startTime;
            timingResultsStats.write("Duration\n");
            timingResultsStats.write(duration + "\n");
            timingResultsStats.close();

            logger.info("Analysis complete.");
        }
    }
}
