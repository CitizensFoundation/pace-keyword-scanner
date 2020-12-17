package org.cf.acks;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import com.gliwka.hyperscan.wrapper.CompileErrorException;
import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Expression;
import com.gliwka.hyperscan.wrapper.ExpressionFlag;
import com.gliwka.hyperscan.wrapper.Scanner;

class KeywordEntry {
    public final String idealogyType;
    public final String topic;
    public final String subTopic;
    public final Integer numberOfKeywords;
    public final String language;
    public final List<String> scanExpressions;
    public final int index;

    KeywordEntry(String idealogyType, String topic, String subTopic,
                 Integer numberOfKeywords, String language,
                 List<String> scanExpressions, int index) {
        this.idealogyType = idealogyType;
        this.topic = topic;
        this.subTopic = subTopic;
        this.numberOfKeywords = numberOfKeywords;
        this.language = language;
        this.scanExpressions = scanExpressions;
        this.index = index;
    }

    public static String transformExpression(int index, String expressionPart) {
        expressionPart = expressionPart.replaceAll(" ",".");
        if (expressionPart.startsWith("*")) {
            expressionPart = expressionPart.substring(1);
        } else {
            expressionPart = "\\b"+expressionPart;
        }
        if (expressionPart.endsWith("*")) {
            expressionPart= expressionPart.substring(0, expressionPart.length() - 1);
        } else {
            //TODO: Get his working, getting a compile error
//            expressionPart = expressionPart+"\\b";
            expressionPart = expressionPart+"";
        }
        expressionPart = expressionPart.replaceAll("\\*",".");

        System.out.println(index+": "+expressionPart);

        return expressionPart;
    }

    //TODO: Don't add duplicate keywords, reused them somehow with a refrence hash so the combined points to the right place
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
                    if (!usedSingleKeywordExpressions.containsKey(expressionString)) {
                        Expression scanExpression = new Expression(transformExpression(expressionCounter, expressionString), EnumSet.of(ExpressionFlag.SINGLEMATCH));
                        scanExpressions.add(scanExpression);
                        usedSingleKeywordExpressions.put(expressionString, expressionCounter);
                        expressionCounter++;
                        expressionToKeywordEntries.put(scanExpression, keyIndex);
                    }
                } else {
                    String combinedString = "";
                    for (int eIndex = 0; eIndex < expressionStrings.size(); eIndex++) {
                        String expressionString = expressionStrings.get(eIndex);
                        System.out.println(expressionString);
                        if (expressionString.contains("|")) {
                            combinedString += "(";
                            String[] splitString = expressionString.split("\\|");
                            System.out.println(splitString.toString());
                            for (int s=0; s<splitString.length; s++) {
                                if (!usedExpressions.containsKey(splitString[s])) {
                                    Expression scanExpression = new Expression(transformExpression(expressionCounter, splitString[s]), EnumSet.of(ExpressionFlag.QUIET));
                                    scanExpressions.add(scanExpression);
                                    combinedString += expressionCounter;
                                    usedExpressions.put(splitString[s], expressionCounter);
                                    expressionCounter++;
                                } else {
                                    combinedString += usedExpressions.get(splitString[s]);
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
                                combinedString += usedExpressions.get(expressionString);
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
            throw new IllegalStateException("The expression '" + failedExpression.getExpression());
        }

        return keywordHyperDatabase;
    }
}