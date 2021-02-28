package org.cf.acks;

import com.amazonaws.transform.StaxUnmarshallerContext;
import com.fasterxml.jackson.core.io.JsonStringEncoder;
import com.gliwka.hyperscan.wrapper.Database;
import com.gliwka.hyperscan.wrapper.Match;
import com.gliwka.hyperscan.wrapper.Scanner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.http.HttpHost;

import java.io.*;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;
import java.util.stream.*;
import java.util.Arrays;

import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchScrollRequest;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.core.CountRequest;
import org.elasticsearch.client.core.CountResponse;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.common.document.DocumentField;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchAllQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermQueryBuilder;
import org.elasticsearch.index.reindex.BulkByScrollResponse;
import org.elasticsearch.index.reindex.UpdateByQueryRequest;
import org.elasticsearch.rest.RestStatus;
import org.elasticsearch.script.Script;
import org.elasticsearch.script.ScriptType;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import net.openhft.hashing.LongHashFunction;

//TODO: Use same method to calculate connection strengths

public class BuildTopicDistanceGraph implements Runnable {

    class UpdateData {
        public final Long pHash;
        public final String domainName;
        public boolean ext;
        public long count;

        UpdateData(Long pHash, String domainName, boolean ext, long count) {
            this.pHash = pHash;
            this.domainName = domainName;
            this.ext = ext;
            this.count = count;
        }
    }

    private static final Logger logger = LogManager.getLogger(BuildTopicDistanceGraph.class);

    private final String esHostname;
    private final Integer esPort;
    private final String esProtocol;
    private final String locale;
    private Hashtable<String, Boolean> alreadyProcessedDomains;
    private Hashtable<String, Boolean> alreadyProcessedUrls;
    private HashMap<String, Float> topicPairStrengths;

 //   private Hashtable<Long, Boolean> isUpdatingInt;
 //   private Hashtable<Long, Boolean> isUpdatingExt;

    private List<UpdateData> stateResultsList;

    final static int MAX_DOCUMENT_RESULTS=1000;
    private RestHighLevelClient esClient;

    BuildTopicDistanceGraph(String esHostname, Integer esPort, String esProtocol, String locale) {
        this.esHostname = esHostname;
        this.esPort = esPort;
        this.esProtocol = esProtocol;
        this.locale = locale;
        this.alreadyProcessedDomains = new Hashtable<String, Boolean>();
        this.alreadyProcessedUrls =  new Hashtable<String, Boolean>();
        this.topicPairStrengths = new HashMap<String, Float>();
        System.out.println(""+esProtocol+esHostname+esPort);
        this.esClient = new RestHighLevelClient(
            RestClient.builder(new HttpHost(this.esHostname, this.esPort, this.esProtocol)));
    }

    @Override
    public void run() {
        System.out.println("Start");
        String scrollId = null;
        boolean hasHits = true;
        int testCount=0;
        this.stateResultsList = new ArrayList<UpdateData>();

        while (hasHits && testCount<38000) {
            testCount+=1;
            System.out.println("Nr: "+testCount);
            if (scrollId==null) {
                SearchRequest searchRequest = new SearchRequest("urls");
                SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
                searchSourceBuilder.query(new MatchAllQueryBuilder());
                searchSourceBuilder.size(MAX_DOCUMENT_RESULTS);
                searchRequest.source(searchSourceBuilder);
                searchRequest.scroll(TimeValue.timeValueMinutes(60L));
                SearchResponse searchResponse;
                try {
                    searchResponse = this.esClient.search(searchRequest, RequestOptions.DEFAULT);
                } catch (IOException ex) {
                    System.out.println("ES Error first: "+ex.getMessage());
                    continue;
                }
                scrollId = searchResponse.getScrollId();
                SearchHits hits = searchResponse.getHits();
                if (hits!=null && hits.getHits().length>0) {
                    processHits(hits);
                } else {
                    hasHits=false;
                }
            } else {
                SearchScrollRequest scrollRequest = new SearchScrollRequest(scrollId);
                scrollRequest.scroll(TimeValue.timeValueMinutes(60L));
                SearchResponse searchScrollResponse;
                try {
                    searchScrollResponse = this.esClient.scroll(scrollRequest, RequestOptions.DEFAULT);
                } catch (IOException ex) {
                    System.out.println("ES Error second: "+ex.getMessage());
                    continue;
                }
                scrollId = searchScrollResponse.getScrollId();
                SearchHits hits = searchScrollResponse.getHits();
                if (scrollId!=null && hits!=null && hits.getHits().length>0) {
                    processHits(hits);
                } else {
                    System.out.println("Reoccurring NO MORE HITS");
                    hasHits=false;
                }
            }
        }

        this.normalizeTopicStrengths();

        LinkedHashMap<String, Integer> topics = new LinkedHashMap<String, Integer>();

        Integer idCounter = 1;
        for (Map.Entry<String, Float> entry : topicPairStrengths.entrySet()) {
            String[] topicPair = entry.getKey().split("-");
            String topicA = topicPair[0];
            String topicB = topicPair[1];
            Float value = entry.getValue();

            Integer topicAId = topics.get(topicA);

            if (topicAId==null) {
                topics.put(topicA, idCounter);
                topicAId = idCounter++;
            }

            Integer topicBId = topics.get(topicB);

            if (topicBId==null) {
                topics.put(topicB, idCounter);
                topicBId = idCounter++;
            }

            System.out.println(topicA+" - "+topicB+" = "+value);
            System.out.println(topicAId+" - "+topicBId+" = "+value);
        }

        try {
            this.esClient.close();
        } catch (IOException ex) {
            System.out.println("ES Error: "+ex.getMessage());
        }
        System.out.println("End");
    }

    private List<SearchHit> getAllHitsForQuery(BoolQueryBuilder bQuery) {
        System.out.println("GetAllHitsForQuery");
        String scrollId = null;
        boolean hasHits = true;
        List<SearchHit> searchHits = new ArrayList<SearchHit>();

        while (hasHits) {
            if (scrollId==null) {
                SearchRequest searchRequest = new SearchRequest("urls");

                SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
                searchSourceBuilder.query(bQuery);
                searchSourceBuilder.fetchSource(new String[]{"id", "topic", "paragraphNumber"}, null);
                searchSourceBuilder.size(MAX_DOCUMENT_RESULTS);
                searchRequest.source(searchSourceBuilder);
                searchRequest.scroll(TimeValue.timeValueMinutes(60L));
                SearchResponse searchResponse;
                try {
                    searchResponse = this.esClient.search(searchRequest, RequestOptions.DEFAULT);
                } catch (IOException ex) {
                    System.out.println("ES Error first: "+ex.getMessage());
                    continue;
                }
                scrollId = searchResponse.getScrollId();
                SearchHits hits = searchResponse.getHits();
                if (hits!=null && hits.getHits().length>0) {
                    for (SearchHit hit : hits){
                        searchHits.add(hit);
                    }
                } else {
                    hasHits=false;
                }
            } else {
                SearchScrollRequest scrollRequest = new SearchScrollRequest(scrollId);
                scrollRequest.scroll(TimeValue.timeValueMinutes(60L));
                SearchResponse searchScrollResponse;
                try {
                    searchScrollResponse = this.esClient.scroll(scrollRequest, RequestOptions.DEFAULT);
                } catch (IOException ex) {
                    System.out.println("ES Error second: "+ex.getMessage());
                    continue;
                }
                scrollId = searchScrollResponse.getScrollId();
                SearchHits hits = searchScrollResponse.getHits();
                if (scrollId!=null && hits!=null && hits.getHits().length>0) {
                    for (SearchHit hit : hits){
                        searchHits.add(hit);
                    }
                } else {
                    System.out.println("Reoccurring");
                    hasHits=false;
                }
            }
        }

        return searchHits;
    }

    private void processHits(SearchHits hits) {
        System.out.println("SearchHits:"+hits.getHits().length);
        long counter = 0;
        for (SearchHit hit : hits.getHits()) {
            counter+=1;
            System.out.println(counter);
            processHit(hit);
        }
    }

    private void processHit(SearchHit hit) {
        Map<String, Object> fieldMap = hit.getSourceAsMap();

        this.processDomain((String) fieldMap.get("domainName"));
        //this.processDomain((String) fieldMap.get("domainName"));

        /*String id = hit.getId();

        int firstDash = id.indexOf("-");
        int secondDash = id.indexOf("-", firstDash + 1);
        int thirdDash = id.indexOf("-", secondDash + 1);
        int fourthDash = id.indexOf("-", thirdDash + 1);

        String urlHash = null;

        if (thirdDash==(secondDash+1)) {
            urlHash = id.substring(secondDash+1, fourthDash);
        } else {
            urlHash = id.substring(secondDash+1, thirdDash);
        }

        System.out.println("Id: "+id);
        System.out.println("urlHash: "+urlHash);

        this.processUrl(fieldMap.get("urlHash"));*/
    }


    private String getTopicPairKey(String topicA, String topicB) {
        List<String> topicList = Arrays.asList(topicA, topicB);
        List<String> sortedList = topicList.stream().sorted().collect(Collectors.toList());
        String topicPairKey = String.join("-", sortedList);
        //System.out.println(topicPairKey);
        return topicPairKey;
    }

    private void addToTopicPairStrengs(HashMap<String, Float> newStrengthsToAdd) {
        for (Map.Entry<String, Float> entry : newStrengthsToAdd.entrySet()) {
            String topic = entry.getKey();
            Float strength = entry.getValue();

            Float currentStrength = this.topicPairStrengths.get(topic);
            if (currentStrength==null) {
                this.topicPairStrengths.put(topic, 0.0f);
                currentStrength = 0.0f;
            }

            this.topicPairStrengths.put(topic,currentStrength+strength);
            System.out.println(topic);
            System.out.printf("%.0f\n", currentStrength+strength);
        }
    }

    private void normalizeTopicStrengths() {
        Float min=null, max=null;

        // Find max and min
        for (Map.Entry<String, Float> entry : topicPairStrengths.entrySet()) {
            String topic = entry.getKey();
            Float strength = entry.getValue();

            if (max==null) {
                max = strength;
            }

            if (min==null) {
                min = strength;
            }

            if (strength>max) {
                max=strength;
            }

            if (strength<min) {
                min = strength;
            }
        }

        for (Map.Entry<String, Float> entry : topicPairStrengths.entrySet()) {
            String topic = entry.getKey();
            Float strength = entry.getValue();

            Float normalizedStrength = (strength-min)/(max-min);

            this.topicPairStrengths.put(topic,normalizedStrength);
            System.out.println(topic+" new strength is "+normalizedStrength);
        }
    }

    private void processDomain(String domainName) {
        if (!this.alreadyProcessedDomains.contains(domainName)) {
            System.out.println(domainName);
            HashMap<String, Float> topicDomainPairStrengths = new HashMap<String, Float>();

            BoolQueryBuilder bQuery = QueryBuilders.boolQuery();
            bQuery.must(QueryBuilders.termQuery("domainName", domainName));

            List<SearchHit> allDomainHits = this.getAllHitsForQuery(bQuery);
            System.out.println("Found domain hits: "+allDomainHits.size());

            for (SearchHit domainHit : allDomainHits) {
                for (SearchHit innerDomainHit : allDomainHits) {
                    Map<String, Object> domainHitMap = domainHit.getSourceAsMap();
                    Map<String, Object> innerDomainHitMap = innerDomainHit.getSourceAsMap();
                    String domainTopic = (String) domainHitMap.get("topic");
                    String innerDomainTopic = (String) innerDomainHitMap.get("topic");

                    if (!domainTopic.equals(innerDomainTopic)) {
                        String topicPairKey = this.getTopicPairKey(domainTopic, innerDomainTopic);
                        //System.out.println("PROCESSING: "+topicPairKey);
                        Float currentStrength = topicDomainPairStrengths.get(topicPairKey);
                        if (currentStrength==null) {
                            topicDomainPairStrengths.put(topicPairKey, 5.0f);
                        } else {
                            topicDomainPairStrengths.put(topicPairKey, currentStrength += 5.0f);
                        }
                    }
                }
            }
            this.addToTopicPairStrengs(topicDomainPairStrengths);
            this.alreadyProcessedDomains.put(domainName, true);
        }
    }


    private void processUrl(String urlHash) {
        if (!this.alreadyProcessedUrls.contains(urlHash)) {
            HashMap<String, Float> topicUrlPairStrengths = new HashMap<String, Float>();

            BoolQueryBuilder bQuery = QueryBuilders.boolQuery();
            bQuery.must(QueryBuilders.termQuery("urlHash", urlHash));

            List<SearchHit> allUrlHits = this.getAllHitsForQuery(bQuery);
            System.out.println("Found url hits: "+allUrlHits.size());

            for (SearchHit urlHit : allUrlHits) {
                for (SearchHit innerUrlHit : allUrlHits) {
                    Map<String, Object> urlHitMap = urlHit.getSourceAsMap();
                    Map<String, Object> innerUrlHitMap = innerUrlHit.getSourceAsMap();

                    String urlTopic = (String) urlHitMap.get("topic");
                    String innerUrlTopic = (String) innerUrlHitMap.get("topic");

                    if (!urlTopic.equals(innerUrlTopic)) {
                        String topicPairKey = this.getTopicPairKey(urlTopic, innerUrlTopic);

                        Float urlAndParagraphBonus = 15.0f;

                        Integer paragraphDistance = Math.abs((int) urlHitMap.get("paragraphNumber")-(int)innerUrlHitMap.get("paragraphNumber"));

                        if (paragraphDistance==0) {
                            urlAndParagraphBonus += 15.0f;
                        } else if (paragraphDistance<5) {
                            urlAndParagraphBonus += 10.0f;
                        } else if (paragraphDistance<10) {
                            urlAndParagraphBonus += 5.0f;
                        } else if (paragraphDistance<20) {
                            urlAndParagraphBonus += 2.0f;
                        }

                        Float currentStrength = topicUrlPairStrengths.get(topicPairKey);
                        if (currentStrength==null) {
                            topicUrlPairStrengths.put(topicPairKey, urlAndParagraphBonus);
                        } else {
                            topicUrlPairStrengths.put(topicPairKey, currentStrength += urlAndParagraphBonus);
                        }
                    }
                }
            }

            this.addToTopicPairStrengs(topicUrlPairStrengths);
            this.alreadyProcessedUrls.put(urlHash, true);
        }
    }

    private void updateCounts(long pHash, String domainName, boolean external, long count) {
        String paramName = external ? "extRepostCount" : "intRepostCount";
        UpdateByQueryRequest request = new UpdateByQueryRequest("urls");
        request.setQuery(new TermQueryBuilder("pHash", pHash));
        request.setConflicts("proceed");
        String scriptString = "ctx._source."+paramName+"="+Long.toString(count);
        System.out.println("R1");
        request.setScript(
            new Script(
                ScriptType.INLINE,
                "painless",
                scriptString,
                Collections.emptyMap()));

        request.setRefresh(true);
        try {
            System.out.println("R2");
            this.esClient.updateByQuery(request, RequestOptions.DEFAULT);
            System.out.println("R3");
        } catch (IOException ex) {
            System.out.println("ES Error updateCounts: "+ex.getMessage());
            return;
        }
        System.out.println("R4");
    }
}
