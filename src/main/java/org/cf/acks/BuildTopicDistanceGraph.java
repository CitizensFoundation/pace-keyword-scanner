package org.cf.acks;

import com.amazonaws.transform.StaxUnmarshallerContext;
import com.fasterxml.jackson.core.io.JsonStringEncoder;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.elasticsearch.action.search.ClearScrollRequest;
import org.elasticsearch.action.search.ClearScrollResponse;
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

class Node {
    public String id;
}

class Link {
    public String source;
    public String target;
    public Double value;
}

class ForceGraph {
    public List<Node> nodes;
    public List<Link> links;
}


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
    private final String year;
    private Hashtable<String, Boolean> alreadyProcessedDomains;
    private Hashtable<String, Boolean> alreadyProcessedUrls;
    private HashMap<String, Double> topicPairStrengths;

 //   private Hashtable<Long, Boolean> isUpdatingInt;
 //   private Hashtable<Long, Boolean> isUpdatingExt;

    private List<UpdateData> stateResultsList;

    final static int MAX_DOCUMENT_RESULTS=1000;
    private RestHighLevelClient esClient;

    BuildTopicDistanceGraph(String esHostname, Integer esPort, String esProtocol, String locale, String year) {
        this.esHostname = esHostname;
        this.esPort = esPort;
        this.esProtocol = esProtocol;
        this.locale = locale;
        this.year = year;
        this.alreadyProcessedDomains = new Hashtable<String, Boolean>();
        this.alreadyProcessedUrls =  new Hashtable<String, Boolean>();
        this.topicPairStrengths = new HashMap<String, Double>();
        System.out.println("ESHost: "+esProtocol+"://"+esHostname+":"+esPort);
        this.esClient = new RestHighLevelClient(RestClient.builder(new HttpHost(this.esHostname, this.esPort, this.esProtocol)));
    }

    @Override
    public void run() {
        System.out.println("Start");
        String scrollId = null;
        boolean hasHits = true;
        int testCount=0;
        this.stateResultsList = new ArrayList<UpdateData>();

        BoolQueryBuilder bQuery = QueryBuilders.boolQuery();
        bQuery.must(QueryBuilders.termQuery("oneTwoRelevanceScore", 1));

        if (this.year!=null && this.year!="") {
            bQuery.must(QueryBuilders.rangeQuery("createdAt").gte(this.year+"-01-01T00:00:00.000Z"))
            .must(QueryBuilders.rangeQuery("createdAt").lte(this.year+"-12-31T23:59:59.990Z"));
        }

        System.out.println("Year: "+this.year);

        while (hasHits) {
            testCount+=1;
            System.out.println("Nr: "+testCount);
            if (scrollId==null) {
                SearchRequest searchRequest = new SearchRequest("urls");
                SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
                searchSourceBuilder.query(bQuery);
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
                    System.out.println("No more main hits");
                    hasHits=false;
                }
            }
        }

        try {
            ClearScrollRequest clearScrollRequest = new ClearScrollRequest();
            clearScrollRequest.addScrollId(scrollId);
            ClearScrollResponse clearScrollResponse = this.esClient.clearScroll(clearScrollRequest, RequestOptions.DEFAULT);
            boolean succeeded = clearScrollResponse.isSucceeded();
        } catch (IOException ex) {
            System.out.println("ES Scroll second: "+ex.getMessage());
        }

        this.normalizeTopicStrengths();

        LinkedHashMap<String, Integer> topics = new LinkedHashMap<String, Integer>();

        ForceGraph graph = new ForceGraph();
        graph.links = new ArrayList<Link>();
        graph.nodes = new ArrayList<Node>();

        Integer idCounter = 1;
        for (Map.Entry<String, Double> entry : topicPairStrengths.entrySet()) {
            String[] topicPair = entry.getKey().split("-");
            String topicA = topicPair[0];
            String topicB = topicPair[1];
            Double value = entry.getValue();

            Integer topicAId = topics.get(topicA);

            if (topicAId==null) {
                topics.put(topicA, idCounter);
                topicAId = idCounter++;
                Node node = new Node();
                node.id = topicA;
                graph.nodes.add(node);
            }

            Integer topicBId = topics.get(topicB);

            if (topicBId==null) {
                topics.put(topicB, idCounter);
                topicBId = idCounter++;
                Node node = new Node();
                node.id = topicB;
                graph.nodes.add(node);
            }

            System.out.println(topicA+" - "+topicB+" = "+value);

            Link link = new Link();
            link.source = topicA;
            link.target = topicB;
            link.value = value;
            graph.links.add(link);
        }

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            objectMapper.writeValue(new File(this.year+"distanceGraph.json"), graph);
        } catch (IOException ex) {
            System.out.println("ES Error: "+ex.getMessage());
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
                searchSourceBuilder.fetchSource(new String[]{"id", "topic", "paragraphNumber","urlHash"}, null);
                searchSourceBuilder.size(MAX_DOCUMENT_RESULTS);
                searchRequest.source(searchSourceBuilder);
                searchRequest.scroll(TimeValue.timeValueMinutes(5L));
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
                    System.out.println("No more domain hits");
                    hasHits=false;
                }
            }
        }

        try {
            ClearScrollRequest clearScrollRequest = new ClearScrollRequest();
            clearScrollRequest.addScrollId(scrollId);
            ClearScrollResponse clearScrollResponse = this.esClient.clearScroll(clearScrollRequest, RequestOptions.DEFAULT);
            boolean succeeded = clearScrollResponse.isSucceeded();
        } catch (IOException ex) {
            System.out.println("ES Scroll second: "+ex.getMessage());
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
        System.gc();
        //this.processUrl((String) fieldMap.get("urlHash"));
    }


    private String getTopicPairKey(String topicA, String topicB) {
        List<String> topicList = Arrays.asList(topicA, topicB);
        List<String> sortedList = topicList.stream().sorted().collect(Collectors.toList());
        String topicPairKey = String.join("-", sortedList);
        //System.out.println(topicPairKey);
        return topicPairKey;
    }

    private void addToTopicPairStrengs(HashMap<String, Double> newStrengthsToAdd) {
        for (Map.Entry<String, Double> entry : newStrengthsToAdd.entrySet()) {
            String topic = entry.getKey();
            Double strength = entry.getValue();

            Double currentStrength = this.topicPairStrengths.get(topic);
            if (currentStrength==null) {
                this.topicPairStrengths.put(topic, 0.0);
                currentStrength = 0.0;
            }

            Double newStrength = currentStrength+strength;
            this.topicPairStrengths.put(topic,newStrength);
            System.out.println(topic);
            System.out.println(currentStrength);
        }
    }

    private void normalizeTopicStrengths() {
        Double min=null, max=null;

        // Find max and min
        for (Map.Entry<String, Double> entry : topicPairStrengths.entrySet()) {
            String topic = entry.getKey();
            Double strength = entry.getValue();

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

        for (Map.Entry<String, Double> entry : topicPairStrengths.entrySet()) {
            String topic = entry.getKey();
            Double strength = entry.getValue();

            Double normalizedStrength = (strength-min)/(max-min);

            this.topicPairStrengths.put(topic,normalizedStrength);
            System.out.println(topic+" new strength is "+normalizedStrength);
        }
    }

    private void processDomain(String domainName) {
        if (this.alreadyProcessedDomains.get(domainName)==null) {
            System.out.println(domainName);
            HashMap<String, Double> topicDomainPairStrengths = new HashMap<String, Double>();

            BoolQueryBuilder bQuery = QueryBuilders.boolQuery();
            bQuery.must(QueryBuilders.termQuery("domainName", domainName));
            bQuery.must(QueryBuilders.termQuery("oneTwoRelevanceScore", 1));

            if (this.year!=null && this.year!="") {
                bQuery.must(QueryBuilders.rangeQuery("createdAt").gte(this.year+"-01-01T00:00:00.000Z"))
                .must(QueryBuilders.rangeQuery("createdAt").lte(this.year+"-12-31T23:59:59.990Z"));
            }

            List<SearchHit> allDomainHits = this.getAllHitsForQuery(bQuery);
            System.out.println("Found domain hits: "+allDomainHits.size());
            Hashtable<Long, Boolean> alreadyProcessedPairs = new Hashtable<Long, Boolean>();

            int gcCounter = 0;

            // Declare here for memory optimization
            String domainTopic;
            String innerDomainTopic;
            String topicPairKey;
            Double currentStrength;
            Integer paragraphDistance;
            Long alreadyProcessedHash;

            for (SearchHit domainHit : allDomainHits) {
                System.out.print(".");
                gcCounter += 1;
                if (gcCounter==1000) {
                    System.gc();
                    gcCounter = 0;
                    System.out.println("GC at 1,000");
                }
                for (SearchHit innerDomainHit : allDomainHits) {
                    domainTopic = (String) domainHit.getSourceAsMap().get("topic");
                    innerDomainTopic = (String) innerDomainHit.getSourceAsMap().get("topic");

                    if (!domainTopic.equals(innerDomainTopic)) {
                        topicPairKey = this.getTopicPairKey(domainTopic, innerDomainTopic);
                        //System.out.println("DOMAIN Bonus: "+topicPairKey);
                        currentStrength = topicDomainPairStrengths.get(topicPairKey);

                        if (currentStrength==null) {
                            currentStrength = 0.0;
                        }

                        currentStrength += 0.005;

                        //System.out.println("URLHASH1"+(String) domainHit.getSourceAsMap().get("urlHash"));
                        //System.out.println("URLHASH2"+(String) innerDomainHit.getSourceAsMap().get("urlHash"));

                        if (((String) domainHit.getSourceAsMap().get("urlHash")).equals((String) innerDomainHit.getSourceAsMap().get("urlHash"))) {
                            currentStrength += 0.05;
                            //System.out.println("URL bonus");
                            paragraphDistance = Math.abs((int) domainHit.getSourceAsMap().get("paragraphNumber")-(int)innerDomainHit.getSourceAsMap().get("paragraphNumber"));

                            if (paragraphDistance==0) {
                                currentStrength += 0.05;
                              //  System.out.println("PARAGRAPH 0 bonus");
                            } else if (paragraphDistance<5) {
                                currentStrength += 0.04;
                               // System.out.println("PARAGRAPH 5 bonus");
                            } else if (paragraphDistance<10) {
                                currentStrength += 0.03;
                              //  System.out.println("PARAGRAPH 10 bonus");
                            } else if (paragraphDistance<20) {
                               // System.out.println("PARAGRAPH 20 bonus");
                                currentStrength += 0.02;
                            }
                        }

                        topicDomainPairStrengths.put(topicPairKey, currentStrength);
                    }
                }
            }
            this.addToTopicPairStrengs(topicDomainPairStrengths);
            this.alreadyProcessedDomains.put(domainName, true);
        } else {
            System.out.println("Already processed: "+domainName);
        }
    }


    private void processUrl(String urlHash) {
        if (!this.alreadyProcessedUrls.contains(urlHash)) {
            System.out.println("Processing url: "+urlHash);
            HashMap<String, Double> topicUrlPairStrengths = new HashMap<String, Double>();

            BoolQueryBuilder bQuery = QueryBuilders.boolQuery();
            bQuery.must(QueryBuilders.termQuery("urlHash", Long.parseLong(urlHash)));

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

                        Double urlAndParagraphBonus = 0.15;

                        Integer paragraphDistance = Math.abs((int) urlHitMap.get("paragraphNumber")-(int)innerUrlHitMap.get("paragraphNumber"));

                        if (paragraphDistance==0) {
                            urlAndParagraphBonus += 0.15;
                        } else if (paragraphDistance<5) {
                            urlAndParagraphBonus += 0.1;
                        } else if (paragraphDistance<10) {
                            urlAndParagraphBonus += 0.05;
                        } else if (paragraphDistance<20) {
                            urlAndParagraphBonus += 0.02;
                        }

                        Double currentStrength = topicUrlPairStrengths.get(topicPairKey);
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
