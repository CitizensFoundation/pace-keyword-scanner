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
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.Semaphore;
import java.util.zip.GZIPInputStream;

import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.common.document.DocumentField;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.rest.RestStatus;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import net.openhft.hashing.LongHashFunction;

public class ImportToES implements Runnable {

    private static final Logger logger = LogManager.getLogger(ImportToES.class);

    public final int BUFFER_SIZE = 128_000;
    public final int ES_BULK_MAX_SIZE = 150;

    private final Semaphore schedulingSemaphore;
    private final String archive;
    private final String esHostname;
    private final Integer esPort;
    private final String esProtocol;
    private List<UpdateRequest> bulkUpdateQueue;

    //    private Integer esPort=9200;
//    private String esProtocol="http";
    final static String TARGET_URI_MARKER = "WARC-Target-URI:";
    final static String TARGET_DATE = "WARC-Date:";
    final static String CONTENT_LENGTH = "Content-Length";
    private RestHighLevelClient esClient;
    private HashMap<Long, Long> pageRanks;
    private final HashMap<String, String> kwCategoriesList1;
    private final HashMap<String, String> kwCategoriesList2;

    ImportToES(Semaphore schedulingSemaphore, String archive, String esHostname, Integer esPort, String esProtocol, HashMap<Long, Long> pageRanks) {
        this.schedulingSemaphore = schedulingSemaphore;
        String[] archiveParts = archive.split("/");
        this.archive = "results/"+archiveParts[archiveParts.length-1];
        this.esHostname = esHostname;
        this.esPort = esPort;
        this.esProtocol = esProtocol;
        this.pageRanks = pageRanks;
        this.bulkUpdateQueue = new ArrayList<UpdateRequest>();
        this.kwCategoriesList1 = new HashMap<String,String>();
        for (int i=0; i<kwList1Array.length; i+=2) {
            String keyword = kwList1Array[i+1];
            keyword = keyword.toLowerCase();
            this.kwCategoriesList1.put(keyword, kwList1Array[i]);
        }
        this.kwCategoriesList2 = new HashMap<String,String>();
        for (int i=0; i<kwListTwoArray.length; i+=2) {
            String keyword = kwListTwoArray[i+1];
            keyword = keyword.toLowerCase();
            this.kwCategoriesList2.put(keyword, kwListTwoArray[i]);
        }
    }

    @Override
    public void run() {
        String currentURL = null; // Should never be null in practice.
        long startTime = System.currentTimeMillis();
        System.out.println("Importing: "+archive);

        File file = new File(archive);
        while (file.exists()==false) {
            try {
                Random rand = new Random();
                int n = rand.nextInt(2500);
                n += 3500;
                System.out.println("Waiting on file import: "+archive+" "+n/1000+"s");
                long retryDuration = System.currentTimeMillis() - startTime;
                if (retryDuration<5*60*1000) {
                    Thread.sleep(n);
                } else {
                    break;
                }
            } catch (Exception ex) {
                System.out.println("Error sleeping in thread: "+ex.getMessage());
            }
        }

        if (file.exists()) {
            if (!hasBeenImported(archive)) {
                BufferedReader contentReader = null;
                try {
                    final InputStream objectStream = new FileInputStream(new File(archive));
                    contentReader = new BufferedReader(new InputStreamReader(objectStream, StandardCharsets.UTF_8), BUFFER_SIZE);
                    this.esClient = new RestHighLevelClient(
                        RestClient.builder(
                                new HttpHost(this.esHostname, this.esPort, this.esProtocol)
                                ));

                    boolean processingEntry = false;

                    String line;
                    String currentDate = null;
                    int bulkCounter = 0;
                    outerloop: while ((line = contentReader.readLine()) != null) {
                        if (line.length()==0) {
                            processingEntry = true;
                            currentURL = null;
                            currentDate = null;
                        } else if (processingEntry && !line.contains("kd8x72dAx") && (line.startsWith("http://") || line.startsWith("https://"))) {
                            currentURL = line;
                            currentDate = contentReader.readLine();
                        } else if (processingEntry && currentURL != null && currentDate != null) {
                            try {
                                while ((line = contentReader.readLine()) != null && line.length()!=0) {
                                    if (line.startsWith("Duration")) {
                                        break outerloop;
                                    } else {
                                        importLinesToES(currentURL, line, currentDate);
                                        bulkCounter+=1;
                                        if (bulkCounter>ES_BULK_MAX_SIZE) {
                                            pumpBulkUpdateQueue();
                                            bulkCounter=0;
                                        }
                                    }
                                }
                            } catch (Throwable t) {
                                throw new IOException(t);
                            }
                            processingEntry = false;
                        }
                    }
                    try {
                        pumpBulkUpdateQueue();
                    } catch (Throwable t) {
                        throw new IOException(t);
                    }
                    contentReader.close();
                    esClient.close();
                    setState(archive, "completed");
                   /* if (file.delete())
                    {
                        System.out.println(archive+" deleted after ESImport");
                    }
                    else
                    {
                        System.out.println(archive+" FAILED! after ESImport");
                    }*/
                } catch (IOException io) {
                    logger.catching(io);
                    setState(archive, io.getMessage());
                } finally {
                    try {
                        contentReader.close();
                        esClient.close();
                    } catch (IOException io) {
                        logger.catching(io);
                    }
                    schedulingSemaphore.release();
                }
            } else {
                System.out.println("File already imported: "+archive);
                schedulingSemaphore.release();
            }
        } else {
            System.out.println("Timeout on file: "+archive);
            schedulingSemaphore.release();
        }
    }

    private boolean hasBeenImported(String archive) {
        String path = "state/"+getFilename(archive)+".importCompleted";
        File file = new File(path);
        return file.exists();
    }

    private String getFilename(String path) {
        String[] paths = path.split("/");
        return paths[paths.length-1];
    }

    private void pumpBulkUpdateQueue() {
        if (this.bulkUpdateQueue.size()>0) {
            BulkRequest request = new BulkRequest();
            for(UpdateRequest update:this.bulkUpdateQueue){
                request.add(update);
            }
            try {
                esClient.bulk(request, RequestOptions.DEFAULT);
            } catch (IOException ioex) {
                try {
                    System.out.println("Sleeping because of IOException");
                    Thread.sleep(5*1000);
                    System.out.println("Retrying after IOException");
                    esClient.bulk(request, RequestOptions.DEFAULT);
                } catch (Exception ex) {
                    System.out.println("ERROR: pumpBulkUpdateQueue: "+ex.getMessage());
                }
            }
            this.bulkUpdateQueue.clear();
        }
    }

    private void setState(String archive, String status) {
        String outPath = "state/"+getFilename(archive)+".importCompleted";
        try {
            Writer stateWrite = new BufferedWriter(new FileWriter(new File(outPath)));
            stateWrite.write(status);
            stateWrite.close();
            }
        catch (IOException io) {
            logger.catching(io);
        }
    }

    private void importLinesToES(String url, String line, String currentDate) throws Throwable {
        String splitLines[] = line.split("kd8x72dAx");
        url = url.substring(0, Math.min(512, url.length()));
        URL uri = new URL(url);
        String domainName = uri.getHost();

        if (domainName!=null) {
            if (domainName.contains(".com") ||
                domainName.contains(".uk") ||
                domainName.contains(".org") ||
                domainName.contains(".net") ||
                domainName.contains(".eu")
                ) {
                    domainName = domainName.replace("www.","");
                    Long domainHash = LongHashFunction.xx().hashChars(domainName);
                    Long pageRank = this.pageRanks.get(domainHash);

                    if (pageRank!=null) {
                        if (splitLines.length>1) {
                            String paragraph = splitLines[0].replaceAll("\"","");
                            JsonStringEncoder e = JsonStringEncoder.getInstance();
                            paragraph = new String(e.quoteAsString(paragraph));
                            String strippedParagraph = paragraph.toLowerCase().replace(" ","").replace("'","").
                            replace("`","").
                            replace("´","").
                            replace("‘","").
                            replace("’","").
                            replace("”","").
                            replace(":","").
                            replace("?","").
                            replace(";","").
                            replace("“","");

                            Long pHashLong = LongHashFunction.xx().hashChars(strippedParagraph);
                            String pHash = Long.toString(pHashLong);
                            String urlIdHash = Long.toString(LongHashFunction.xx().hashChars(url+pHash));

                            String jsonString = "{\"createdAt\":\""+currentDate+"\",";
                            String keywords[] = splitLines[1].split(":");
                            Map<String,Integer> keyWordsmap = new HashMap<String,Integer>();

                            int populismList1KwCount=0;
                            int nativismList1KwCount=0;
                            int libarismList1KwCount=0;
                            int populismList2KwCount=0;
                            int nativismList2KwCount=0;
                            int libarismList2KwCount=0;
                            int populismTotalKwCount=0;
                            int nativismTotalKwCount=0;
                            int libarismTotalKwCount=0;

                            for(String keyword:keywords){
                                if (!keyWordsmap.containsKey(keyword)) {
                                    keyWordsmap.put(keyword,1);
                                } else{
                                    keyWordsmap.put(keyword, keyWordsmap.get(keyword)+1);
                                }

                                String keywordMinusOne = keyword.substring(0, keyword.length() - 1);
                                keywordMinusOne = keywordMinusOne.toLowerCase();

                                if (kwCategoriesList1.get(keywordMinusOne)=="Populism") {
                                    populismList1KwCount+=1;
                                    populismTotalKwCount+=1;
                                } else if (kwCategoriesList1.get(keywordMinusOne)=="Nativism") {
                                    nativismList1KwCount+=1;
                                    nativismTotalKwCount+=1;
                                } else if (kwCategoriesList1.get(keywordMinusOne)=="Liberalism") {
                                    libarismList1KwCount+=1;
                                    libarismTotalKwCount+=1;
                                }

                                if (kwCategoriesList2.get(keywordMinusOne)=="Populism") {
                                    populismList2KwCount+=1;
                                    populismTotalKwCount+=1;
                                } else if (kwCategoriesList2.get(keywordMinusOne)=="Nativism") {
                                    nativismList2KwCount+=1;
                                    nativismTotalKwCount+=1;
                                } else if (kwCategoriesList2.get(keywordMinusOne)=="Liberalism") {
                                    libarismList2KwCount+=1;
                                    libarismTotalKwCount+=1;
                                }
                            }

                            jsonString+="\"paragraph\":\""+paragraph+"\",\"keywords\":[";

                            int essentialKeywordsCount=0;
                            int additionalKeywordsCount=0;

                            for (Map.Entry<String, Integer> entry : keyWordsmap.entrySet()) {
                                String keyword = entry.getKey().replace("\\b", "");
                                String count = entry.getValue().toString();
                                boolean essential = false;
                                if (keyword.substring(keyword.length()-1).equals("E")) {
                                    essential=true;
                                    essentialKeywordsCount+=1;
                                } else {
                                    additionalKeywordsCount+=1;
                                }
                                keyword = keyword.substring(0, keyword.length() - 1);

                                if (essential) {
                                    jsonString += "{\"keyword\":\""+keyword+"\",\"count\":"+count+",\"essential\": true},";
                                } else {
                                    jsonString += "{\"keyword\":\""+keyword+"\",\"count\":"+count+",\"essential\": false},";
                                }
                            }
                            jsonString = jsonString.substring(0, jsonString.length() - 1);

                            jsonString+="],";

                            System.out.println("\"populismList1KwCount\":"+populismList1KwCount);
                            System.out.println("\"nativismList1KwCount\":"+nativismList1KwCount);
                            System.out.println("\"libarismList1KwCount\":"+libarismList1KwCount);

                            System.out.println("\"populismList2KwCount\":"+populismList2KwCount);
                            System.out.println("\"nativismList2KwCount\":"+nativismList2KwCount);
                            System.out.println("\"libarismList2KwCount\":"+libarismList2KwCount);

                            System.out.println("\"populismTotalKwCount\":"+populismTotalKwCount);
                            System.out.println("\"nativismTotalKwCount\":"+nativismTotalKwCount);
                            System.out.println("\"libarismTotalKwCount\":"+libarismTotalKwCount);

                            // For 3 categories
                            jsonString+="\"list1KwCount\":"+essentialKeywordsCount+",";
                            jsonString+="\"list2KwCount\":"+additionalKeywordsCount+",";
                            jsonString+="\"essentialKwCount\":"+essentialKeywordsCount+",";
                            jsonString+="\"additionalKwCount\":"+additionalKeywordsCount+",";

                            jsonString+="\"populismList1KwCount\":"+populismList1KwCount+",";
                            jsonString+="\"nativismList1KwCount\":"+nativismList1KwCount+",";
                            jsonString+="\"libarismList1KwCount\":"+libarismList1KwCount+",";

                            jsonString+="\"populismList2KwCount\":"+populismList2KwCount+",";
                            jsonString+="\"nativismList2KwCount\":"+nativismList2KwCount+",";
                            jsonString+="\"libarismList2KwCount\":"+libarismList2KwCount+",";

                            jsonString+="\"populismTotalKwCount\":"+populismTotalKwCount+",";
                            jsonString+="\"nativismTotalKwCount\":"+nativismTotalKwCount+",";
                            jsonString+="\"libarismTotalKwCount\":"+libarismTotalKwCount+",";

                            jsonString+="\"uniqueKwCount\":"+keyWordsmap.entrySet().size()+",";
                            jsonString+="\"extRepostCount\": 0,";
                            jsonString+="\"intRepostCount\": 1,";
                            jsonString+="\"pHash\":"+pHash+",";

                            jsonString+="\"pageRank\":"+pageRank+",";
                            jsonString+="\"domainName\":\""+domainName+"\"";
                            jsonString+="}";

                            UpdateRequest esRequest = new UpdateRequest("urls", "doc", urlIdHash);
                            esRequest.doc(jsonString, XContentType.JSON);
                            esRequest.docAsUpsert(true);
                            this.bulkUpdateQueue.add(esRequest);
                        } else {
                            throw new Exception("Splitlines! "+line);
                        }
                    } else {
                    }
                } else {

                }
        } else {
        }
    }


    private  String[] kwList1Array = {
     "Populism","imperialis.",
     "Populism","large corporation.",
     "Populism","looter",
     "Populism","muzzle",
     "Populism","parasit.",
     "Populism","put people first",
     "Populism","technocra.",
     "Populism","dictator.",
     "Populism","decent people",
     "Populism","plunder.",
     "Populism","traitor.",
     "Populism","big compan.",
     "Populism","bigwig",
     "Populism","lose control",
     "Populism","defy",
     "Populism","oligarch.",
     "Populism","undemocratic",
     "Populism","our values",
     "Populism","anti-democratic",
     "Populism","average citizen.",
     "Populism","big money",
     "Populism","captiv.",
     "Populism","careless.",
     "Populism","deceiv.",
     "Populism","free speech",
     "Populism","mainstream part.",
     "Populism","normal people",
     "Populism","oppress.",
     "Populism","orwell.",
     "Nativism","ancest.",
     "Nativism","asylum chaos",
     "Nativism","asylum industry",
     "Nativism","band. of migrants",
     "Nativism","clean out",
     "Nativism","cleaning out",
     "Nativism","deportation",
     "Nativism","destiny",
     "Nativism","domestic",
     "Nativism","fatherland",
     "Nativism","fatherlands",
     "Nativism","folklore",
     "Nativism","forefather.",
     "Nativism","headscarf.",
     "Nativism","homeland",
     "Nativism","identity",
     "Nativism","integrat.",
     "Nativism","islamis.",
     "Nativism","lineage",
     "Nativism","mass immigration",
     "Nativism","mass migration",
     "Nativism","migrant.",
     "Nativism","migration",
     "Nativism","nation",
     "Nativism","national tradition",
     "Nativism","nations",
     "Nativism","native.",
     "Nativism","open border.",
     "Nativism","our country",
     "Nativism","our custom.",
     "Nativism","our tradition.",
     "Nativism","our way of life",
     "Nativism","patriot.",
     "Nativism","reconquista",
     "Nativism","repatriation",
     "Nativism","replacement agenda",
     "Nativism","right of blood",
     "Nativism","trafficker",
     "Nativism","trafficking",
     "Nativism","wave of refugees",
     "Nativism","western world",
     "Liberalism","basic right.",
     "Liberalism","Branch. of Government ",
     "Liberalism","Checks and Balances",
     "Liberalism","Civil Liberties",
     "Liberalism","Civil Right.",
     "Liberalism","civility",
     "Liberalism","Colorful",
     "Liberalism","Cooperat.",
     "Liberalism","cosmopolitan.",
     "Liberalism","deliberation",
     "Liberalism","demilitarization",
     "Liberalism","democratic right.",
     "Liberalism","disarmament.",
     "Liberalism","discriminat.",
     "Liberalism","diverse",
     "Liberalism","equal.",
     "Liberalism","ethni.",
     "Liberalism","fair.",
     "Liberalism","freedom",
     "Liberalism","freedom of expression",
     "Liberalism","freedom of opinion",
     "Liberalism","freedom of speech",
     "Liberalism","freedom . press",
     "Liberalism","Future",
     "Liberalism","gay.",
     "Liberalism","Gender",
     "Liberalism","handicapped",
     "Liberalism","harmon.",
     "Liberalism","heterogen.",
     "Liberalism","Human Right.",
     "Liberalism","inclusion",
     "Liberalism","inclusiv.",
     "Liberalism","individual right.",
     "Liberalism","injustice.",
     "Liberalism","interfaith",
     "Liberalism","interreligious",
     "Liberalism","intoleran.",
     "Liberalism","justice",
     "Liberalism","lesbian.",
     "Liberalism","lgbt.",
     "Liberalism","Liberal Democrac.",
     "Liberalism","liberal right.",
     "Liberalism","liberal value.",
     "Liberalism","liberal",
     "Liberalism","liberalism",
     "Liberalism","marginaliz.",
     "Liberalism","media diversity",
     "Liberalism","minorit.",
     "Liberalism","multicult.",
     "Liberalism","multiethnic",
     "Liberalism","negotiat.",
     "Liberalism","Open Societ.",
     "Liberalism","Parity",
     "Liberalism","pillars of democracy",
     "Liberalism","pluralis.",
     "Liberalism","Political Freedom.",
     "Liberalism","Prejudice.",
     "Liberalism","public institution.",
     "Liberalism","queer.",
     "Liberalism","referendum",
     "Liberalism","rights",
     "Liberalism","Rule of Law",
     "Liberalism","Separation of Power.",
     "Liberalism","suppression",
     "Liberalism","Tenets of Democracy",
     "Liberalism","Toleran.",
     "Liberalism","transgender.",
     "Liberalism","transparen.",
     "Liberalism","Universal Suffrage",
     "Liberalism","violat."
    };

    private String[] kwListTwoArray = {
        "Populism","1984",
        "Populism","99 percent",
        "Populism","abuse.",
        "Populism","accomplice.",
        "Populism","accountab.",
        "Populism","anti grassroot",
        "Populism","anti grass-root",
        "Populism","anti-democratic",
        "Populism","antidemoratic",
        "Populism","anti-grassroot",
        "Populism","anti-grass-root",
        "Populism","aristocra.",
        "Populism","arrogan.",
        "Populism","autocra.",
        "Populism","average citizen.",
        "Populism","average people",
        "Populism","backstabbing",
        "Populism","bandit.",
        "Populism","betray.",
        "Populism","big compan.",
        "Populism","big corporation.",
        "Populism","big money",
        "Populism","bigwig",
        "Populism","bin the licence fee",
        "Populism","brainwash.",
        "Populism","breach. of trust",
        "Populism","broken promis.",
        "Populism","bureaucra.",
        "Populism","cahoot.",
        "Populism","campaign pledge.",
        "Populism","campaign promise.",
        "Populism","capitalis.",
        "Populism","captiv.",
        "Populism","captur.",
        "Populism","careless.",
        "Populism","caste",
        "Populism","censorship",
        "Populism","cheat.",
        "Populism","citizen",
        "Populism","citizens",
        "Populism","citizenship",
        "Populism","claim",
        "Populism","common good",
        "Populism","common sense",
        "Populism","communities",
        "Populism","community",
        "Populism","companies",
        "Populism","company",
        "Populism","conceit",
        "Populism","concerned citizen.",
        "Populism","consensus",
        "Populism","conspirac.",
        "Populism","constitution.",
        "Populism","corporation.",
        "Populism","corrupt.",
        "Populism","crisis",
        "Populism","cronies",
        "Populism","crony",
        "Populism","cronyism",
        "Populism","cunning",
        "Populism","damag.",
        "Populism","deceit.",
        "Populism","deceiv.",
        "Populism","decent",
        "Populism","decent citizen.",
        "Populism","decent people",
        "Populism","decept.",
        "Populism","defy",
        "Populism","deliver the Brexit",
        "Populism ","democracies",
        "Populism","democracy",
        "Populism","democrat",
        "Populism","democratic",
        "Populism","democrats",
        "Populism","desaster",
        "Populism","devious",
        "Populism","dictator.",
        "Populism","disgrace",
        "Populism","dishonest.",
        "Populism","election pledge.",
        "Populism","election promise.",
        "Populism","elite",
        "Populism","elites",
        "Populism","elitist",
        "Populism","empire.",
        "Populism","empower.",
        "Populism","establishment",
        "Populism","eurocrat.",
        "Populism","expense. of the public",
        "Populism","exploit.",
        "Populism","facis.",
        "Populism","fake media",
        "Populism","fake news",
        "Populism","fault",
        "Populism","fed up",
        "Populism","filthy",
        "Populism","force",
        "Populism","foreign domination",
        "Populism","fraud",
        "Populism","free speech",
        "Populism","freedom of expression",
        "Populism","freedom of speech",
        "Populism","freeloader",
        "Populism","general will",
        "Populism","give voice",
        "Populism","greater good",
        "Populism","greed.",
        "Populism","guilty",
        "Populism","hardworking",
        "Populism","hard-working",
        "Populism","highway robbery",
        "Populism","highwaym.",
        "Populism","hijack",
        "Populism","honest citizen.",
        "Populism","honest people",
        "Populism","hostage",
        "Populism","hypocrit.",
        "Populism","imperialis.",
        "Populism","impose.",
        "Populism","independen.",
        "Populism","insincere",
        "Populism","internationalis.",
        "Populism","ivory tower",
        "Populism","justice",
        "Populism","lackey",
        "Populism","large compan.",
        "Populism","large corporation.",
        "Populism","law and order",
        "Populism","leftist fascism",
        "Populism","leftist media",
        "Populism","liar",
        "Populism","LibLab",
        "Populism","Lib-Lab",
        "Populism","lie",
        "Populism","lie. to",
        "Populism","lies",
        "Populism","lobby.",
        "Populism","looter",
        "Populism","lose control",
        "Populism","loss of control",
        "Populism","lost control",
        "Populism","lying media",
        "Populism","mainstream media",
        "Populism","mainstream part.",
        "Populism","majority",
        "Populism","manipulat.",
        "Populism","marauder",
        "Populism","marxis.",
        "Populism","middle class",
        "Populism","misappropriat.",
        "Populism","miscreant.",
        "Populism","mock",
        "Populism","monopol",
        "Populism","mouthpiece.",
        "Populism","muzzle",
        "Populism","negligent",
        "Populism","nepotism",
        "Populism","nomenclature",
        "Populism","normal people",
        "Populism","obsessed with power",
        "Populism","obsession with power",
        "Populism","odinary people",
        "Populism","oligarch.",
        "Populism","oppress.",
        "Populism","ordinary citizen.",
        "Populism","ordinary people",
        "Populism","orwell.",
        "Populism","our people.",
        "Populism","our values",
        "Populism","out of touch",
        "Populism","parasit.",
        "Populism","party interest.",
        "Populism","people demand",
        "Populism","people know",
        "Populism","people want",
        "Populism ","people wish",
        "Populism","people.",
        "Populism","phony",
        "Populism","plot.",
        "Populism","plunder.",
        "Populism","plutocra.",
        "Populism","political class",
        "Populism","political correct.",
        "Populism","popular sovereignity",
        "Populism","popular vote",
        "Populism","popular will",
        "Populism","power",
        "Populism","power hungry",
        "Populism","power monger",
        "Populism","power-hungry",
        "Populism","pride",
        "Populism","priviledged",
        "Populism","propaganda",
        "Populism","proud",
        "Populism","pseudo expert.",
        "Populism","pseudo-expert.",
        "Populism","public interest",
        "Populism","put people first",
        "Populism","putting people first",
        "Populism","quisling.",
        "Populism","reckless",
        "Populism","red tape",
        "Populism","referendum",
        "Populism","regime",
        "Populism","repressive",
        "Populism","responsibility",
        "Populism","responsible",
        "Populism","ridicul.",
        "Populism","robber baron",
        "Populism","ruined",
        "Populism","rule over",
        "Populism","ruling",
        "Populism","ruling class",
        "Populism","ruling group",
        "Populism","run down",
        "Populism","run-down",
        "Populism","scam.",
        "Populism","scrap the licence fee",
        "Populism","self interest.",
        "Populism","self-interest.",
        "Populism","selfish",
        "Populism","selfishness",
        "Populism","self-serving",
        "Populism","shame",
        "Populism","silent majority",
        "Populism","snooty",
        "Populism","so-called expert.",
        "Populism","solidar.",
        "Populism","sovereign",
        "Populism","sovereignty",
        "Populism","state media",
        "Populism","stuck-up",
        "Populism","subdue.",
        "Populism","submission",
        "Populism","subservience",
        "Populism/Populism","subservient",
        "Populism","take back control",
        "Populism","taking back control",
        "Populism","taxpayer.",
        "Populism","technocra.",
        "Populism","the rich",
        "Populism","traitor.",
        "Populism","treason",
        "Populism","treason against the people",
        "Populism","truth",
        "Populism","unconstitutional.",
        "Populism","undemocratic",
        "Populism","unelected",
        "Populism","vassal state",
        "Populism","voter.",
        "Populism","vox populi",
        "Populism","wannabe expert.",
        "Populism","withstand.",
        "Populism","working class.",
        "Populism","wrongspeak",
        "Nativism","ancest.",
        "Nativism","asylum chaos",
        "Nativism","asylum industry",
        "Nativism","band. of migrants",
        "Nativism","clean out",
        "Nativism","cleaning out",
        "Nativism","deportation",
        "Nativism","destiny",
        "Nativism","domestic",
        "Nativism","fatherland",
        "Nativism","fatherlands",
        "Nativism","folklore",
        "Nativism","forefather.",
        "Nativism","headscarf.",
        "Nativism","homeland",
        "Nativism","identity",
        "Nativism","integrat.",
        "Nativism","islamis.",
        "Nativism","lineage",
        "Nativism","mass immigration",
        "Nativism","mass migration",
        "Nativism","migrant.",
        "Nativism","migration",
        "Nativism","nation",
        "Nativism","national tradition",
        "Nativism","nations",
        "Nativism","native.",
        "Nativism","open border.",
        "Nativism","our country",
        "Nativism","our custom.",
        "Nativism","our tradition.",
        "Nativism","our way of life",
        "Nativism","patriot.",
        "Nativism","reconquista",
        "Nativism","repatriation",
        "Nativism","replacement agenda",
        "Nativism","right of blood",
        "Nativism","trafficker",
        "Nativism","trafficking",
        "Nativism","wave of refugees",
        "Nativism","western world",
        "Nativism","alien.",
        "Nativism","barbar.",
        "Nativism","border control",
        "Nativism","britain",
        "Nativism","britains",
        "Nativism","british",
        "Nativism","catastroph.",
        "Nativism","control the border",
        "Nativism","controlling the border",
        "Nativism","decline",
        "Nativism","demise",
        "Nativism","destruction",
        "Nativism","diversity",
        "Nativism","doom",
        "Nativism","floodgate.",
        "Nativism","foreigner.",
        "Nativism","Great Britain",
        "Nativism","heritage",
        "Nativism","inherit.",
        "Nativism","jus sanguinis",
        "Nativism","Land of Hope and Glory",
        "Nativism","loss",
        "Nativism","minorit.",
        "Nativism","multi-cultural.",
        "Nativism","multicultural.",
        "Nativism","national",
        "Nativism","nationalism",
        "Nativism","nationalist.",
        "Nativism","rape.",
        "Nativism","rapist.",
        "Nativism","refugee.",
        "Nativism","savage.",
        "Nativism","stranger.",
        "Nativism","UK"
    };
}
