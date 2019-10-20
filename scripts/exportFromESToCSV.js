const elasticsearch = require('elasticsearch');

const query1 = require('./queries').query1;
const query2 = require('./queries').query2;
const query3 = require('./queries').query3;
const query4 = require('./queries').query4;
const query5 = require('./queries').query5;
const _ = require('lodash');

const client = new elasticsearch.Client({
    host: 'https://search-ec-ac-pace-dev-wyysxnkri3j5ohunwbd4lb6zju.us-east-1.es.amazonaws.com',
    log: 'error'
 });

const search = (index, body) => {
    return client.search({index: index, body: body});
  };

const searchData = (body) => {
    body = _.merge(body, { from: 0, size: 1000 });
    body = _.merge(body, {
      sort: [
        {
          populismTotalUniqueKwCount: {
//          nativismTotalUniqueKwCount: {
//            libarismTotalUniqueKwCount: {
//           populismList1UniqueKwCount: {
//          nativismList1UniqueKwCount: {
             order: "desc"
          }
        }
      ]
    });
    search('urls', body)
    .then(results => {
//      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      const headerColumns = [
        'id',
        'paragraph',
        'domainName',
        'list1KwCount',
        'list2KwCount',
        'uniqueKwCount',
        'populismList1KwCount',
        'nativismList1KwCount',
        'libarismList1KwCount',
        'populismList2KwCount',
        'nativismList2KwCount',
        'libarismList2KwCount',
        'populismTotalKwCount',
        'nativismTotalKwCount',
        'libarismTotalKwCount',
        'populismList1UniqueKwCount',
        'nativismList1UniqueKwCount',
        'libarismList1UniqueKwCount',
        'populismList2UniqueKwCount',
        'nativismList2UniqueKwCount',
        'libarismList2UniqueKwCount',
        'populismTotalUniqueKwCount',
        'nativismTotalUniqueKwCount',
        'libarismTotalUniqueKwCount'
      ];
      const keywordColumns = {};
      const columnKeywords = {};
      results.hits.hits.forEach(
        (hitIn) => {
          const hit = hitIn._source;
          if (hit.keywords) {
            hit.keywords.forEach((keyword, index)=>{
              if (headerColumns.indexOf(keyword.keyword)>-1) {
              } else {
                headerColumns.push(keyword.keyword);
              }
            });
          }
        }
      )
      headerColumns.forEach((column, index) => {
        if (index>3) {
          keywordColumns[column]=index;
          columnKeywords[index]=column;
        }
      });
      let csvOut="";
      csvOut += headerColumns.map((item)=>{
        return item;
      });
      //console.log(csvOut);
      csvOut+="\n";
      results.hits.hits.forEach(
        (hitIn) => {
          const id = hitIn._id;
          const hit = hitIn._source;
          const internalKeywordsCount = {};
          if (hit.keywords) {
            //console.log(hit.paragraph);
            //console.log(hit.keywords);
            hit.keywords.forEach((keyword, index)=>{
              internalKeywordsCount[keyword.keyword]=parseInt(keyword.count);
            });
            headerColumns.forEach((column,index)=>{
              if (index==0) {
                csvOut += "'"+id+"',"
              } else if (index==1) {
                csvOut += "'"+hit.paragraph.replace(/'/g, '"')+"',"
              } else if (index==2) {
                csvOut += "'"+hit.domainName.replace(/'/g, '"')+"',"
              } else if (index==3) {
                csvOut += hit.list1KwCount+","
              } else if (index==4) {
                csvOut += hit.list2KwCount+","
              } else if (index==5) {
                csvOut += hit.uniqueKwCount+","
              } else if (index==6) {
                csvOut += hit.populismList1KwCount+","
              } else if (index==7) {
                csvOut += hit.nativismList1KwCount+","
              } else if (index==8) {
                csvOut += hit.libarismList1KwCount+","
              } else if (index==9) {
                csvOut += hit.populismList2KwCount+","
              } else if (index==10) {
                csvOut += hit.nativismList2KwCount+","
              } else if (index==11) {
                csvOut += hit.libarismList2KwCount+","
              } else if (index==12) {
                csvOut += hit.populismTotalKwCount+","
              } else if (index==13) {
                csvOut += hit.nativismTotalKwCount+","
              } else if (index==14) {
                csvOut += hit.libarismTotalKwCount+","
              } else if (index==15) {
                csvOut += hit.populismList1UniqueKwCount+","
              } else if (index==16) {
                csvOut += hit.nativismList1UniqueKwCount+","
              } else if (index==17) {
                csvOut += hit.libarismList1UniqueKwCount+","
              } else if (index==18) {
                csvOut += hit.populismList2UniqueKwCount+","
              } else if (index==19) {
                csvOut += hit.nativismList2UniqueKwCount+","
              } else if (index==20) {
                csvOut += hit.libarismList2UniqueKwCount+","
              } else if (index==21) {
                csvOut += hit.populismTotalUniqueKwCount+","
              } else if (index==22) {
                csvOut += hit.nativismTotalUniqueKwCount+","
              } else if (index==23) {
                csvOut += hit.libarismTotalUniqueKwCount+","
              } else {
                if (internalKeywordsCount[columnKeywords[index]]) {
                  //console.log("Index: "+index+" "+columnKeywords[index]+" count: "+internalKeywordsCount[columnKeywords[index]]);
                  csvOut += parseInt(internalKeywordsCount[columnKeywords[index]])
                } else {
                  csvOut += "0"
                }
                csvOut += ","
              }
            });
            csvOut += "\n";
          }
        }
      )
      console.log(csvOut);
    })
    .catch(console.error);
};

searchData(query1);