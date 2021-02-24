package org.cf.acks;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.TimeUnit;

import com.gliwka.hyperscan.wrapper.CompileErrorException;
import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Expression;
import com.gliwka.hyperscan.wrapper.ExpressionFlag;
import com.gliwka.hyperscan.wrapper.Scanner;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;

class KeywordEntry {
    public final String idealogyType;
    public final String topic;
    public final String subTopic;
    public final Integer numberOfKeywords;
    public final String language;
    public final List<String> scanExpressions;
    public final int index;
    public final String validationParagraph;

    KeywordEntry(String idealogyType, String topic, String subTopic,
                 Integer numberOfKeywords, String language,
                 List<String> scanExpressions, int index, String validationParagraph) {
        this.idealogyType = idealogyType;
        this.topic = topic;
        this.subTopic = subTopic;
        this.numberOfKeywords = numberOfKeywords;
        this.language = language;
        this.scanExpressions = scanExpressions;
        this.index = index;
        this.validationParagraph = validationParagraph;
    }

    public static String transformExpression(int index, String expressionPart) {
        if (expressionPart.startsWith("*")) {
            expressionPart = expressionPart.substring(1);
        } else {
            expressionPart = "\\b"+expressionPart;
        }
        expressionPart = expressionPart.replaceAll("-",".");
        expressionPart = expressionPart.replaceAll(" ",".");
        expressionPart = expressionPart.replaceAll("\\*",".");

        System.out.println(index+": "+expressionPart);

        return expressionPart;
    }


    public static Integer addSingleOrExpression(String expressionString, int keyIndex, List<Expression> scanExpressions,
        HashMap<String, Integer> usedExpressions, Integer expressionCounter, HashMap<Expression, Integer> expressionToKeywordEntries) {
        String combinedString = "(";
        String[] splitString = expressionString.split("\\|");
        for (int s=0; s<splitString.length; s++) {
            String splitStringItem = splitString[s].trim();
            //System.out.println(splitStringItem);
            if (!usedExpressions.containsKey(splitStringItem)) {
                Expression scanExpression = new Expression(transformExpression(expressionCounter, splitString[s]), EnumSet.of(ExpressionFlag.QUIET));
                scanExpressions.add(scanExpression);
                combinedString += expressionCounter;
                usedExpressions.put(splitStringItem, expressionCounter);
                expressionCounter++;
            } else {
                combinedString += usedExpressions.get(splitStringItem);
            }

            if (s!=splitString.length-1) {
                combinedString += " | ";
            } else {
                combinedString += "";
            }
        }
        combinedString += ")";
        System.out.println(expressionCounter+": "+combinedString);
        Expression scanExpression = new Expression(combinedString,  EnumSet.of(ExpressionFlag.COMBINATION,ExpressionFlag.SINGLEMATCH));
        scanExpressions.add(scanExpression);
        expressionCounter++;
        expressionToKeywordEntries.put(scanExpression, keyIndex);

        return expressionCounter;
    }

    public static Database setupExpressionsAndDatabase(List<KeywordEntry> keywordEntries, HashMap<Expression, Integer> expressionToKeywordEntries) {
        Database keywordHyperDatabase;

        try {
            Integer expressionCounter = 0;
            int keywordEntriesSize = keywordEntries.size();
            List<Expression> scanExpressions = new ArrayList<Expression>();
            HashMap<String, Integer> usedExpressions = new HashMap<String, Integer>();
            HashMap<String, Integer> usedSingleKeywordExpressions = new HashMap<String, Integer>();
            for (int keyIndex = 0; keyIndex < keywordEntriesSize; keyIndex++) {
                List<String> expressionStrings = keywordEntries.get(keyIndex).scanExpressions;
                if (expressionStrings.size()==1) {
                    String expressionString = expressionStrings.get(0);
                    if (expressionString.contains("|")) {
                        expressionCounter = KeywordEntry.addSingleOrExpression(expressionString, keyIndex, scanExpressions, usedExpressions, expressionCounter, expressionToKeywordEntries);
                    } else {
                        if (!usedSingleKeywordExpressions.containsKey(expressionString)) {
                            Expression scanExpression = new Expression(transformExpression(expressionCounter, expressionString), EnumSet.of(ExpressionFlag.SINGLEMATCH));
                            scanExpressions.add(scanExpression);
                            usedSingleKeywordExpressions.put(expressionString, expressionCounter);
                            expressionCounter++;
                            expressionToKeywordEntries.put(scanExpression, keyIndex);
                        }
                    }
                } else {
                    String combinedString = "";
                    for (int eIndex = 0; eIndex < expressionStrings.size(); eIndex++) {
                        String expressionString = expressionStrings.get(eIndex);
                        //System.out.println(expressionString);
                        if (expressionString.contains("|")) {
                            combinedString += "(";
                            String[] splitString = expressionString.split("\\|");
                            for (int s=0; s<splitString.length; s++) {
                                String splitStringItem = splitString[s].trim();
                                //System.out.println(splitStringItem);
                                if (!usedExpressions.containsKey(splitStringItem)) {
                                    Expression scanExpression = new Expression(transformExpression(expressionCounter, splitString[s]), EnumSet.of(ExpressionFlag.QUIET));
                                    scanExpressions.add(scanExpression);
                                    combinedString += expressionCounter;
                                    usedExpressions.put(splitStringItem, expressionCounter);
                                    expressionCounter++;
                                } else {
                                    combinedString += usedExpressions.get(splitStringItem);
                                }

                                if (s!=splitString.length-1) {
                                    combinedString += " | ";
                                } else {
                                    combinedString += "";
                                }
                            }
                            combinedString += ")";
                            if (eIndex!=expressionStrings.size()-1) {
                                combinedString += " & ";
                            }
                        } else if (expressionString.startsWith("-")) {
                            expressionString = expressionString.substring(1);
                            if (!usedExpressions.containsKey(expressionString)) {
                                Expression scanExpression = new Expression(transformExpression(expressionCounter, expressionString), EnumSet.of(ExpressionFlag.QUIET));
                                scanExpressions.add(scanExpression);
                                combinedString += "!" + expressionCounter;
                                usedExpressions.put(expressionString, expressionCounter);
                                expressionCounter++;
                            } else {
                                combinedString +=  "!" + usedExpressions.get(expressionString);
                            }
                            if (eIndex!=expressionStrings.size()-1) {
                                combinedString += " & ";
                            }
                        } else {
                            if (!usedExpressions.containsKey(expressionString)) {
                                Expression scanExpression = new Expression(transformExpression(expressionCounter, expressionString), EnumSet.of(ExpressionFlag.QUIET));
                                scanExpressions.add(scanExpression);
                                combinedString += expressionCounter;
                                usedExpressions.put(expressionString, expressionCounter);
                                expressionCounter++;
                            } else {
                                combinedString += usedExpressions.get(expressionString);
                            }
                            if (eIndex!=expressionStrings.size()-1) {
                                combinedString += " & ";
                            }
                        }
                    }
                    combinedString += "";
                    System.out.println(expressionCounter+": "+combinedString);
                    Expression scanExpression = new Expression(combinedString,  EnumSet.of(ExpressionFlag.COMBINATION,ExpressionFlag.SINGLEMATCH));
                    scanExpressions.add(scanExpression);
                    expressionCounter++;
                    expressionToKeywordEntries.put(scanExpression, keyIndex);
                }
            }

            keywordHyperDatabase = Database.compile(scanExpressions);
        } catch (CompileErrorException ce) {
            Expression failedExpression = ce.getFailedExpression();
            throw new IllegalStateException("The expression " + ce.getMessage());
        }

        return keywordHyperDatabase;
    }

    public static Database createPatternDataFromFile(String configFilePath,
                HashMap<Expression, Integer> expressionToKeywordEntries,
                ArrayList<KeywordEntry> keywordEntries) {

        File configFile = new File(configFilePath);

        int index = 0;
        try {
            Reader in = new FileReader(configFile);
            Iterable<CSVRecord> records = CSVFormat.EXCEL.parse(in);
            for (CSVRecord record : records) {
                if (!record.get(3).isEmpty() && !record.get(7).isEmpty() && record.getRecordNumber()>2) {
                    String language = record.get(0);
                    String idealogyType = record.get(1);
                    String topic = record.get(2);
                    String subTopic = record.get(3);
                    System.out.println(topic+" "+subTopic);
                    String validationParagraph = record.get(4);
                    List<String> scanExpressions = new ArrayList<String>();

                    for (int i=7; i<record.size(); i++) {
                        if (record.get(i)!="") {
                            String expressionPart = record.get(i);
                            expressionPart = expressionPart.toLowerCase().trim();
                            if (expressionPart.length()>1) {
                               scanExpressions.add(expressionPart);
                            }
                        }
                    }

                    if (scanExpressions.size()>0) {
                        if (idealogyType!="DROP") {
                            KeywordEntry keywordEntry = new KeywordEntry(idealogyType, topic,
                                    subTopic, scanExpressions.size(),
                                    language, scanExpressions, index, validationParagraph);
                            keywordEntries.add(keywordEntry);
                        } else {
                            System.out.println("DROP: "+topic+" "+subTopic);
                        }
                        index++;
                    }

                }
            }
        } catch (Exception ex) {
            System.out.println(ex);
        }

        return KeywordEntry.setupExpressionsAndDatabase(keywordEntries, expressionToKeywordEntries);
    }
}