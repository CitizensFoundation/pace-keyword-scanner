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
import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;

import org.opensearch.action.search.SearchRequest;
import org.opensearch.action.search.SearchResponse;
import org.opensearch.action.search.SearchScrollRequest;
import org.opensearch.action.update.UpdateRequest;
import org.opensearch.action.update.UpdateResponse;
import org.opensearch.client.RequestOptions;
import org.opensearch.client.RestClient;
import org.opensearch.client.RestHighLevelClient;
import org.opensearch.client.core.CountRequest;
import org.opensearch.client.core.CountResponse;
import org.opensearch.client.indices.CreateIndexRequest;
import org.opensearch.client.indices.CreateIndexResponse;
import org.opensearch.client.indices.GetIndexRequest;
import org.opensearch.common.document.DocumentField;
import org.opensearch.common.unit.TimeValue;
import org.opensearch.index.query.BoolQueryBuilder;
import org.opensearch.index.query.MatchAllQueryBuilder;
import org.opensearch.index.query.MatchQueryBuilder;
import org.opensearch.index.query.QueryBuilders;
import org.opensearch.index.query.TermQueryBuilder;
import org.opensearch.index.reindex.BulkByScrollResponse;
import org.opensearch.index.reindex.UpdateByQueryRequest;
import org.opensearch.rest.RestStatus;
import org.opensearch.script.Script;
import org.opensearch.script.ScriptType;
import org.opensearch.search.SearchHit;
import org.opensearch.search.SearchHits;
import org.opensearch.search.builder.SearchSourceBuilder;
import org.opensearch.search.slice.SliceBuilder;

import net.openhft.hashing.LongHashFunction;

//TODO: Use same method to calculate connection strengths

public class FindReoccurringParagraphsES implements Runnable {

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

    private static final Logger logger = LogManager.getLogger(FindReoccurringParagraphsES.class);

    private final Semaphore schedulingSemaphore;
    private final String esHostname;
    private final Integer esPort;
    private final String esProtocol;
    private final Integer sliceId;
    private final Integer maxSlices;
 //   private Hashtable<Long, Boolean> isUpdatingInt;
 //   private Hashtable<Long, Boolean> isUpdatingExt;

    private List<UpdateData> stateResultsList;

    final static int MAX_DOCUMENT_RESULTS=200;
    private RestHighLevelClient esClient;

    FindReoccurringParagraphsES(Semaphore schedulingSemaphore, Integer sliceId, Integer maxSlices, String esHostname, Integer esPort, String esProtocol) {
        this.schedulingSemaphore = schedulingSemaphore;
        this.esHostname = esHostname;
        this.esPort = esPort;
        this.esProtocol = esProtocol;
        this.sliceId = sliceId;
        this.maxSlices = maxSlices;
       // Hashtable<Long, Boolean> isUpdatingInt = new Hashtable<Long, Boolean>();
       // Hashtable<Long, Boolean> isUpdatingExt = new Hashtable<Long, Boolean>();
    }

    @Override
    public void run() {
        System.out.println("Reoccurring START0: ("+this.sliceId+"/"+this.maxSlices+")");
        this.esClient = new RestHighLevelClient(
            RestClient.builder(new HttpHost(this.esHostname, this.esPort, this.esProtocol)));
        String scrollId = null;
        boolean hasHits = true;
        int testCount=0;
        this.stateResultsList = new ArrayList<UpdateData>();

        while (hasHits && testCount<3) {
            testCount+=1;
            System.out.println("Nr: "+testCount);
            if (scrollId==null) {
                SearchRequest searchRequest = new SearchRequest("urls");
                SliceBuilder sliceBuilder = new SliceBuilder(this.sliceId, this.maxSlices);
                SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder().slice(sliceBuilder);
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
                    System.out.println("Reoccurring NO MORE HITS: ("+this.sliceId+"/"+this.maxSlices+")");
                    hasHits=false;
                }
            }
        }

        System.out.println("Updating number: "+this.stateResultsList.size());
        for (UpdateData update:this.stateResultsList) {
            updateCounts(update.pHash, update.domainName, update.ext, update.count);
        }

        try {
            this.esClient.close();
        } catch (IOException ex) {
            System.out.println("ES Error setIntRepostCount 1: "+ex.getMessage());
        }
        System.out.println("Reoccurring END: ("+this.sliceId+"/"+this.maxSlices+")");
        schedulingSemaphore.release();
    }

    private void processHits(SearchHits hits) {
        System.out.println("SearchHits:"+hits.getHits().length);
        long counter = 0;
        for (SearchHit hit : hits.getHits()) {
            counter+=1;
            System.out.println(counter);
            //System.out.println("Hits IN");
            //setIntRepostCount(hit);
            setExtRepostCount(hit);
            //System.out.println("Hits OUT");
        }
    }

    private void setIntRepostCount(SearchHit hit) {
        System.out.println("IN setInt...");
        Map<String, Object> fieldMap = hit.getSourceAsMap();
        long pHash = (long) fieldMap.get("pHash");
        String domainName = (String) fieldMap.get("domainName");
        CountRequest countRequest = new CountRequest("urls");
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        BoolQueryBuilder bqb = QueryBuilders.boolQuery();
        bqb.must(QueryBuilders.termQuery("pHash", pHash));
        bqb.must(QueryBuilders.termQuery("domainName.keyword", domainName));
        searchSourceBuilder.query(bqb);
        String s = searchSourceBuilder.toString();
        System.out.println(s);
        //searchSourceBuilder.timeout(TimeValue.timeValueSeconds(2L));
        countRequest.source(searchSourceBuilder);
        CountResponse countResponse=null;
        try {
            System.out.println("countReqeustIn");
            countResponse = this.esClient.count(countRequest, RequestOptions.DEFAULT);
            System.out.println("countReqeustOut");
        } catch (IOException ex) {
            System.out.println("ES Error setIntRepostCount 1: "+ex.getMessage());
            return;
        }

        long count = countResponse.getCount();
        System.out.println("Int count: "+count);
        if (count>1) {
            System.out.println("Int 1");
            if (true) { // this.isUpdatingInt.get(pHash)!=null
                System.out.println("Int 1a");
                this.stateResultsList.add(new UpdateData(pHash, domainName, false, count));
                System.out.println("Int 2");
                //this.isUpdatingInt.put(pHash, true);
                System.out.println("Int 3");
                System.out.println(this.stateResultsList.size());
            }
        }
        System.out.println("OUT setInt...");
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
        //String s = searchSourceBuilder.toString();
        //System.out.println(s);

        countRequest.source(searchSourceBuilder);
        searchSourceBuilder.timeout();
        CountResponse countResponse=null;
        try {
            countResponse = this.esClient.count(countRequest, RequestOptions.DEFAULT);
        } catch (IOException ex) {
            System.out.println("ES Error setIntRepostCount 1: "+ex.getMessage());
            return;
        }

        long count = countResponse.getCount();
        //System.out.println("Ext count: "+count);
        if (count>0) { //  && this.isUpdatingExt.get(pHash)!=null
            System.out.println("Ext count: "+count);
            this.stateResultsList.add(new UpdateData(pHash, domainName, true, count));
           // this.isUpdatingExt.put(pHash, true);
           // System.out.println(this.stateResultsList.size());
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
        System.out.println("Reoccurring UpdateCounts "+pHash+" ("+scriptString+") "+count+": ("+this.sliceId+"/"+this.maxSlices+")");

        /*if (count>1000) {
            request.setSlices(2);
        } else if (count>2000) {
            request.setSlices(3);
        } else if (count>3000) {
            request.setSlices(3);
        }*/
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
