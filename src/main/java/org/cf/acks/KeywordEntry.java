package org.cf.acks;

import java.util.HashSet;
import java.util.List;

class KeywordEntry {
    public final String idealogyType;
    public final String topic;
    public final String subTopic;
    public final Integer numberOfKeywords;
    public final String language;
    public final List<String> minusWords;
    public final List<String> scanExpressions;
    public final HashSet<String> scanExpressionHash;

    KeywordEntry(String idealogyType, String topic, String subTopic,
                 Integer numberOfKeywords, String language, List<String> minusWords,
                 List<String> scanExpressions, HashSet<String> scanExpressionHash) {
        this.idealogyType = idealogyType;
        this.topic = topic;
        this.subTopic = subTopic;
        this.numberOfKeywords = numberOfKeywords;
        this.language = language;
        this.minusWords = minusWords;
        this.scanExpressions = scanExpressions;
        this.scanExpressionHash = scanExpressionHash;
    }
}