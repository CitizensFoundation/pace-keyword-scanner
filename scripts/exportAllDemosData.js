'use strict'

const { Client } = require('@opensearch-project/opensearch')

const _ = require('lodash');
var fs = require('fs');
const filename = process.argv[2];
const stream = fs.createWriteStream(filename);


const client = new Client({
    node: 'https://search-demos-v1-hujolmcnrbsjb3fh3pfhbvtsbu.us-east-1.es.amazonaws.com/',
    log: 'error'
 });

async function * scrollSearch (params) {
  let response = await client.search(params)

  while (true) {
    //console.log("STRINGIFY")
    //console.log(JSON.stringify(response, null, 2));
    const sourceHits = response.body.hits.hits

    if (sourceHits.length === 0) {
      //console.error("sourceHits = 0")
      break
    }

    for (const hit of sourceHits) {
      yield hit
    }

    if (!response.body._scroll_id) {
      //console.error("NO SCROLL ID")
      break
    }

    response = await client.scroll({
      scrollId: response.body._scroll_id,
      scroll: params.scroll
    })
    //console.log(JSON.stringify(response, null, 2));
  }
}

const cleanUp = (text) => {
  text = text.replace(/'/g, '');
  text = text.replace(/"/g, '');
  return text;
}

async function run () {
  const params = {
    index: 'urls',
    scroll: '1m',
    size: 1000,
    _source: ['paragraph','domain','createdAt','topic','subTopic','domainName'],
    body: {
      query: {
        match_all: {}
      }
    }
  }

  stream.write("Created at,Topic,Sub Topic,Domain,Paragraph\n");

  for await (const hit of scrollSearch(params)) {
    const line = `${hit._source.createdAt},${hit._source.topic},${hit._source.subTopic},${hit._source.domainName},"${cleanUp(hit._source.paragraph)}"\n`;
    stream.write(line);
  }
}

(async () => {
  stream.once('open', async (fd) => {
    await run();
    stream.end();
  })
})();
