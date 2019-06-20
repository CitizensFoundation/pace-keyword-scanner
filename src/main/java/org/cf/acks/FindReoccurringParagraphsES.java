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
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;

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
import org.elasticsearch.search.slice.SliceBuilder;

import net.openhft.hashing.LongHashFunction;

public class FindReoccurringParagraphsES implements Runnable {

    private static final Logger logger = LogManager.getLogger(FindReoccurringParagraphsES.class);

    private final Semaphore schedulingSemaphore;
    private final String esHostname;
    private final Integer esPort;
    private final String esProtocol;
    private final Integer sliceId;
    private final Integer maxSlices;

    final static int MAX_DOCUMENT_RESULTS=200;
    private RestHighLevelClient esClient;

    FindReoccurringParagraphsES(Semaphore schedulingSemaphore, Integer sliceId, Integer maxSlices, String esHostname, Integer esPort, String esProtocol) {
        this.schedulingSemaphore = schedulingSemaphore;
        this.esHostname = esHostname;
        this.esPort = esPort;
        this.esProtocol = esProtocol;
        this.sliceId = sliceId;
        this.maxSlices = maxSlices;
    }

    @Override
    public void run() {
        this.esClient = new RestHighLevelClient(
            RestClient.builder(new HttpHost(this.esHostname, this.esPort, this.esProtocol)));

        String scrollId = null;
        boolean hasHits = true;

        while (hasHits) {
            if (scrollId==null) {
                SearchRequest searchRequest = new SearchRequest("urls");
                SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
                SliceBuilder sliceBuilder = new SliceBuilder(this.sliceId, this.maxSlices);
                searchSourceBuilder.slice(sliceBuilder);
                searchSourceBuilder.query(new MatchAllQueryBuilder());
                searchSourceBuilder.size(MAX_DOCUMENT_RESULTS);
                searchRequest.source(searchSourceBuilder);
                searchRequest.scroll(TimeValue.timeValueMinutes(1L));
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
                scrollRequest.scroll(TimeValue.timeValueSeconds(30));
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
                    hasHits=false;
                }
            }
        }
        try {
            this.esClient.close();
        } catch (IOException ex) {
            System.out.println("ES Error setIntRepostCount 1: "+ex.getMessage());
        }
    }

    private void processHits(SearchHits hits) {
        for (SearchHit hit : hits.getHits()) {
            setIntRepostCount(hit);
            setExtRepostCount(hit);
        }
    }

    private void setIntRepostCount(SearchHit hit) {
        Map<String, Object> fieldMap = hit.getSourceAsMap();
        long pHash = (long) fieldMap.get("pHash");
        String domainName = (String) fieldMap.get("domainName");
        CountRequest countRequest = new CountRequest();
        countRequest.indices("urls");
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder bqb = QueryBuilders.boolQuery();
        bqb.must(QueryBuilders.termQuery("pHash", pHash));
        bqb.must(QueryBuilders.termQuery("domainName.keyword", domainName));
        searchSourceBuilder.query(bqb);
        countRequest.source(searchSourceBuilder);
        CountResponse countResponse=null;
        try {
            countResponse = this.esClient.count(countRequest, RequestOptions.DEFAULT);
        } catch (IOException ex) {
            System.out.println("ES Error setIntRepostCount 1: "+ex.getMessage());
            return;
        }

        long count = countResponse.getCount();
        if (count>1) {
            updateCounts(pHash, domainName, false, count);
        }
    }

    private void setExtRepostCount(SearchHit hit) {
        Map<String, Object> fieldMap = hit.getSourceAsMap();
        long pHash = (long) fieldMap.get("pHash");
        String domainName = (String) fieldMap.get("domainName");
        CountRequest countRequest = new CountRequest();
        countRequest.indices("urls");
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.boolQuery().
                 mustNot(QueryBuilders.termQuery("domainName.keyword", domainName)).
                 must(QueryBuilders.termQuery("pHash", pHash)));
        String s = searchSourceBuilder.toString();

        countRequest.source(searchSourceBuilder);
        CountResponse countResponse=null;
        try {
            countResponse = this.esClient.count(countRequest, RequestOptions.DEFAULT);
        } catch (IOException ex) {
            System.out.println("ES Error setIntRepostCount 1: "+ex.getMessage());
            return;
        }

        long count = countResponse.getCount();
        if (count>1) {
            updateCounts(pHash, domainName, true, count);
        }
    }

    private void updateCounts(long pHash, String domainName, boolean external, long count) {
        String paramName = external ? "extRepostCount" : "intRepostCount";
        UpdateByQueryRequest request = new UpdateByQueryRequest("urls");
        request.setQuery(new TermQueryBuilder("pHash", pHash));
//        request.setConflicts("proceed");
        String scriptString = "ctx._source."+paramName+"="+Long.toString(count-1);
        request.setScript(
            new Script(
                ScriptType.INLINE,
                "painless",
                scriptString,
                Collections.emptyMap()));
        System.out.println("UpdateCounts ("+scriptString+") "+count);
        try {
            this.esClient.updateByQuery(request, RequestOptions.DEFAULT);
        } catch (IOException ex) {
            System.out.println("ES Error updateCounts: "+ex.getMessage());
            return;
        }
    }
}
