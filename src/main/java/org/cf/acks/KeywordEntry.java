package org.cf.acks;

class KeywordEntry {
    public final String idealogyType;
    public final String topic;
    public final String subTopic;
    public final String searchPattern;
    public final String language;

    KeywordEntry(String idealogyType, String topic, String subTopic, String searchPattern, String language) {
        this.idealogyType = idealogyType;
        this.topic = topic;
        this.subTopic = subTopic;
        this.searchPattern = searchPattern;
        this.language = language;
    }
}