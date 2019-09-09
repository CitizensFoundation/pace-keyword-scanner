const elasticsearch = require('elasticsearch');

const nativism1 = require('./queries').nativism1;
const nativism2 = require('./queries').nativism2;
const liberalism1 = require('./queries').liberalism1;
const populism1 = require('./queries').populism1;
const populism2 = require('./queries').populism2;
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
    search('urls', body)
    .then(results => {
//      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      const headerColumns = ['paragraph','list1KwCount','list2KwCount','uniqueKwCount'];
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
                csvOut += "'"+hit.paragraph.replace(/'/g, '"')+"',"
              } else if (index==1) {
                csvOut += hit.list1KwCount+","
              } else if (index==2) {
                csvOut += hit.list2KwCount+","
              } else if (index==3) {
                csvOut += hit.uniqueKwCount+","
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

searchData(nativism1);