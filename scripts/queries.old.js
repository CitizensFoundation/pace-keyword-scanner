// Nativism List 1 descending
const nativism1 = { "query": {
  "bool": {
    "must": [
      {
        "match_all": {}
      },
      {
        "range": {
          "list1KwCount": {
            "gte": 1,
            "lt": 100
          }
        }
      },
      {
        "bool": {
          "minimum_should_match": 1,
          "should": [
            {
              "match_phrase": {
                "keywords.keyword": "ancest."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "asylum chaos"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "asylum industry"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "band. of migrants"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "clean out"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cleaning out"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deportation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "destiny"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "domestic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fatherland"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fatherlands"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "folklore"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "forefather."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "headscarf."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "homeland"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "identity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "integrat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "islamis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lineage"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mass immigration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mass migration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "migrant."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "migration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "national tradition"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nations"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "native."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "open border."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our country"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our custom."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our tradition."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our way of life"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "patriot."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "reconquista"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "repatriation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "replacement agenda"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "right of blood"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "trafficker"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "trafficking"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "wave of refugees"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "western world"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "asylum chaos"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "asylum industry"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "band. of migrants"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "clean out"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cleaning out"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deportation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "destiny"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "domestic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fatherland"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fatherlands"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "folklore"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "forefather."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "headscarf."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "homeland"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "identity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "integrat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "islamis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lineage"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mass immigration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mass migration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "migrant."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "migration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "national tradition"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nations"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "native."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "open border."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our country"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our custom."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our tradition."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our way of life"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "patriot."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "reconquista"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "repatriation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "replacement agenda"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "right of blood"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "trafficker"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "trafficking"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "wave of refugees"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "western world"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "alien."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "barbar."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "border control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "britain"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "britains"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "british"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "catastroph."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "control the border"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "controlling the border"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decline"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "demise"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "destruction"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "diversity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "doom"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "floodgate."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "foreigner."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Great Britain"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "heritage"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "inherit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "jus sanguinis"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Land of Hope and Glory"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "loss"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "minorit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "multi-cultural."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "multicultural."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "national"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nationalism"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nationalist."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "rape."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "rapist."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "refugee."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "savage."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "stranger."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "UK"
              }
            }
          ]
        }
      }
    ],
    "filter": [],
    "should": [],
    "must_not": [
      {
        "bool": {
          "minimum_should_match": 1,
          "should": [
            {
              "match_phrase": {
                "keywords.keyword": "anti-democratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "average citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "big compan."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "big money"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "bigwig"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "captiv."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "careless."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deceiv."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decent people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "defy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "dictator."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "free speech"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "imperialis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "large corporation."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "looter"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lose control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mainstream part."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "muzzle"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "normal people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "oligarch."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "oppress."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "orwell."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our values"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "parasit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "plunder."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "put people first"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "technocra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "traitor."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "undemocratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "1984"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "99 percent"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "abuse."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "accomplice."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "accountab."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "anti grassroot"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "anti grass-root"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "anti-democratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "antidemoratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "anti-grassroot"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "anti-grass-root"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "aristocra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "arrogan."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "autocra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "average citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "average people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "backstabbing"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "bandit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "betray."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "big compan."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "big corporation."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "big money"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "bigwig"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "bin the licence fee"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "brainwash."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "breach. of trust"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "broken promis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "bureaucra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cahoot."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "campaign pledge."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "campaign promise."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "capitalis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "captiv."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "captur."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "careless."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "caste"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "censorship"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cheat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "citizen"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "citizens"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "citizenship"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "claim"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "common good"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "common sense"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "communities"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "community"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "companies"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "company"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "conceit"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "concerned citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "consensus"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "conspirac."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "constitution."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "corporation."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "corrupt."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "crisis"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cronies"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "crony"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cronyism"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cunning"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "damag."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deceit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deceiv."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decent"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decent citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decent people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decept."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "defy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deliver the Brexit"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democracies"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democracy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democrat"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democrats"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "desaster"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "devious"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "dictator."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "disgrace"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "dishonest."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "election pledge."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "election promise."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "elite"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "elites"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "elitist"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "empire."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "empower."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "establishment"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "eurocrat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "expense. of the public"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "exploit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "facis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fake media"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fake news"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fault"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fed up"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "filthy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "force"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "foreign domination"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fraud"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "free speech"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom of expression"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom of speech"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freeloader"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "general will"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "give voice"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "greater good"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "greed."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "guilty"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "hardworking"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "hard-working"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "highway robbery"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "highwaym."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "hijack"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "honest citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "honest people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "hostage"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "hypocrit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "imperialis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "impose."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "independen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "insincere"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "internationalis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ivory tower"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "justice"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lackey"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "large compan."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "large corporation."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "law and order"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "leftist fascism"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "leftist media"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "liar"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "LibLab"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Lib-Lab"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lie"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lie. to"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lies"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lobby."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "looter"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lose control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "loss of control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lost control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lying media"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mainstream media"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mainstream part."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "majority"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "manipulat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "marauder"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "marxis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "middle class"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "misappropriat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "miscreant."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mock"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "monopol"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mouthpiece."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "muzzle"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "negligent"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nepotism"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nomenclature"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "normal people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "obsessed with power"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "obsession with power"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "odinary people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "oligarch."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "oppress."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ordinary citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ordinary people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "orwell."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our people."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our values"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "out of touch"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "parasit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "party interest."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "people demand"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "people know"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "people want"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "people wish"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "people."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "phony"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "plot."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "plunder."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "plutocra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "political class"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "political correct."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "popular sovereignity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "popular vote"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "popular will"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "power"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "power hungry"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "power monger"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "power-hungry"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "pride"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "priviledged"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "propaganda"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "proud"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "pseudo expert."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "pseudo-expert."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "public interest"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "put people first"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "putting people first"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "quisling."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "reckless"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "red tape"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "referendum"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "regime"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "repressive"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "responsibility"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "responsible"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ridicul."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "robber baron"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ruined"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "rule over"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ruling"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ruling class"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ruling group"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "run down"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "run-down"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "scam."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "scrap the licence fee"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "self interest."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "self-interest."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "selfish"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "selfishness"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "self-serving"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "shame"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "silent majority"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "snooty"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "so-called expert."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "solidar."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "sovereign"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "sovereignty"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "state media"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "stuck-up"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "subdue."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "submission"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "subservience"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "subservient"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "take back control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "taking back control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "taxpayer."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "technocra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "the rich"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "traitor."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "treason"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "treason against the people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "truth"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "unconstitutional."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "undemocratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "unelected"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "vassal state"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "voter."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "vox populi"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "wannabe expert."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "withstand."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "working class."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "wrongspeak"
              }
            }
          ]
        }
      },
      {
        "bool": {
          "minimum_should_match": 1,
          "should": [
            {
              "match_phrase": {
                "keywords.keyword": "basic right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Branch. of Government "
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Checks and Balances"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Civil Liberties"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Civil Right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "civility"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Colorful"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Cooperat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cosmopolitan."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deliberation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "demilitarization"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democratic right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "disarmament."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "discriminat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "diverse"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "equal."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ethni."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fair."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom . press"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom of expression"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom of opinion"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom of speech"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Future"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "gay."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Gender"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "handicapped"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "harmon."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "heterogen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Human Right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "inclusion"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "inclusiv."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "individual right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "injustice."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "interfaith"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "interreligious"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "intoleran."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "justice"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lesbian."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lgbt."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "liberal"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Liberal Democrac."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "liberal right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "liberal value."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "liberalism"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "marginaliz."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "media diversity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "minorit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "multicult."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "multiethnic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "negotiat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Open Societ."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Parity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "pillars of democracy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "pluralis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Political Freedom."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Prejudice."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "public institution."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "queer."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "referendum"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "rights"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Rule of Law"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Separation of Power."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "suppression"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Tenets of Democracy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Toleran."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "transgender."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "transparen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Universal Suffrage"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "violat."
              }
            }
          ]
        }
      }
      ]
    }
  }
};

//Nativism List 2 descending:
const nativism2 = { "query": {
  "bool": {
    "must": [
      {
        "match_all": {}
      },
      {
        "range": {
          "list2KwCount": {
            "gte": 3,
            "lt": 100
          }
        }
      },
      {
        "bool": {
          "minimum_should_match": 1,
          "should": [
            {
              "match_phrase": {
                "keywords.keyword": "ancest."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "asylum chaos"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "asylum industry"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "band. of migrants"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "clean out"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cleaning out"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deportation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "destiny"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "domestic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fatherland"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fatherlands"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "folklore"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "forefather."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "headscarf."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "homeland"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "identity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "integrat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "islamis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lineage"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mass immigration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mass migration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "migrant."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "migration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "national tradition"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nations"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "native."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "open border."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our country"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our custom."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our tradition."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our way of life"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "patriot."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "reconquista"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "repatriation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "replacement agenda"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "right of blood"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "trafficker"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "trafficking"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "wave of refugees"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "western world"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "asylum chaos"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "asylum industry"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "band. of migrants"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "clean out"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cleaning out"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deportation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "destiny"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "domestic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fatherland"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fatherlands"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "folklore"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "forefather."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "headscarf."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "homeland"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "identity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "integrat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "islamis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lineage"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mass immigration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mass migration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "migrant."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "migration"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "national tradition"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nations"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "native."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "open border."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our country"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our custom."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our tradition."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our way of life"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "patriot."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "reconquista"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "repatriation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "replacement agenda"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "right of blood"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "trafficker"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "trafficking"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "wave of refugees"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "western world"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "alien."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "barbar."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "border control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "britain"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "britains"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "british"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "catastroph."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "control the border"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "controlling the border"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decline"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "demise"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "destruction"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "diversity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "doom"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "floodgate."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "foreigner."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Great Britain"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "heritage"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "inherit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "jus sanguinis"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Land of Hope and Glory"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "loss"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "minorit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "multi-cultural."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "multicultural."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "national"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nationalism"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nationalist."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "rape."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "rapist."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "refugee."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "savage."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "stranger."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "UK"
              }
            }
          ]
        }
      }
    ],
    "filter": [],
    "should": [],
    "must_not": [
      {
        "bool": {
          "minimum_should_match": 1,
          "should": [
            {
              "match_phrase": {
                "keywords.keyword": "anti-democratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "average citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "big compan."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "big money"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "bigwig"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "captiv."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "careless."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deceiv."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decent people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "defy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "dictator."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "free speech"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "imperialis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "large corporation."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "looter"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lose control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mainstream part."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "muzzle"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "normal people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "oligarch."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "oppress."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "orwell."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our values"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "parasit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "plunder."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "put people first"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "technocra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "traitor."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "undemocratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "1984"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "99 percent"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "abuse."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "accomplice."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "accountab."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "anti grassroot"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "anti grass-root"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "anti-democratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "antidemoratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "anti-grassroot"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "anti-grass-root"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "aristocra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "arrogan."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "autocra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "average citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "average people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "backstabbing"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "bandit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "betray."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "big compan."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "big corporation."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "big money"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "bigwig"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "bin the licence fee"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "brainwash."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "breach. of trust"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "broken promis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "bureaucra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cahoot."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "campaign pledge."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "campaign promise."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "capitalis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "captiv."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "captur."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "careless."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "caste"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "censorship"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cheat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "citizen"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "citizens"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "citizenship"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "claim"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "common good"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "common sense"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "communities"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "community"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "companies"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "company"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "conceit"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "concerned citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "consensus"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "conspirac."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "constitution."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "corporation."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "corrupt."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "crisis"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cronies"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "crony"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cronyism"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cunning"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "damag."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deceit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deceiv."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decent"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decent citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decent people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "decept."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "defy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deliver the Brexit"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democracies"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democracy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democrat"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democrats"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "desaster"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "devious"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "dictator."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "disgrace"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "dishonest."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "election pledge."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "election promise."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "elite"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "elites"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "elitist"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "empire."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "empower."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "establishment"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "eurocrat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "expense. of the public"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "exploit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "facis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fake media"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fake news"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fault"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fed up"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "filthy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "force"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "foreign domination"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fraud"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "free speech"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom of expression"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom of speech"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freeloader"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "general will"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "give voice"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "greater good"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "greed."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "guilty"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "hardworking"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "hard-working"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "highway robbery"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "highwaym."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "hijack"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "honest citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "honest people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "hostage"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "hypocrit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "imperialis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "impose."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "independen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "insincere"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "internationalis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ivory tower"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "justice"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lackey"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "large compan."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "large corporation."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "law and order"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "leftist fascism"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "leftist media"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "liar"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "LibLab"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Lib-Lab"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lie"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lie. to"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lies"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lobby."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "looter"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lose control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "loss of control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lost control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lying media"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mainstream media"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mainstream part."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "majority"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "manipulat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "marauder"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "marxis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "middle class"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "misappropriat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "miscreant."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mock"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "monopol"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "mouthpiece."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "muzzle"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "negligent"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nepotism"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "nomenclature"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "normal people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "obsessed with power"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "obsession with power"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "odinary people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "oligarch."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "oppress."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ordinary citizen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ordinary people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "orwell."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our people."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "our values"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "out of touch"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "parasit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "party interest."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "people demand"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "people know"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "people want"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "people wish"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "people."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "phony"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "plot."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "plunder."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "plutocra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "political class"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "political correct."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "popular sovereignity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "popular vote"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "popular will"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "power"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "power hungry"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "power monger"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "power-hungry"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "pride"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "priviledged"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "propaganda"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "proud"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "pseudo expert."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "pseudo-expert."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "public interest"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "put people first"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "putting people first"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "quisling."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "reckless"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "red tape"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "referendum"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "regime"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "repressive"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "responsibility"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "responsible"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ridicul."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "robber baron"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ruined"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "rule over"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ruling"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ruling class"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ruling group"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "run down"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "run-down"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "scam."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "scrap the licence fee"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "self interest."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "self-interest."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "selfish"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "selfishness"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "self-serving"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "shame"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "silent majority"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "snooty"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "so-called expert."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "solidar."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "sovereign"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "sovereignty"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "state media"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "stuck-up"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "subdue."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "submission"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "subservience"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "subservient"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "take back control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "taking back control"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "taxpayer."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "technocra."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "the rich"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "traitor."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "treason"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "treason against the people"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "truth"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "unconstitutional."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "undemocratic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "unelected"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "vassal state"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "voter."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "vox populi"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "wannabe expert."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "withstand."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "working class."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "wrongspeak"
              }
            }
          ]
        }
      },
      {
        "bool": {
          "minimum_should_match": 1,
          "should": [
            {
              "match_phrase": {
                "keywords.keyword": "basic right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Branch. of Government "
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Checks and Balances"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Civil Liberties"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Civil Right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "civility"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Colorful"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Cooperat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "cosmopolitan."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "deliberation"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "demilitarization"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "democratic right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "disarmament."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "discriminat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "diverse"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "equal."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "ethni."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "fair."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom . press"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom of expression"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom of opinion"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "freedom of speech"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Future"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "gay."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Gender"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "handicapped"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "harmon."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "heterogen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Human Right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "inclusion"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "inclusiv."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "individual right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "injustice."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "interfaith"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "interreligious"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "intoleran."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "justice"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lesbian."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "lgbt."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "liberal"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Liberal Democrac."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "liberal right."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "liberal value."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "liberalism"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "marginaliz."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "media diversity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "minorit."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "multicult."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "multiethnic"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "negotiat."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Open Societ."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Parity"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "pillars of democracy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "pluralis."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Political Freedom."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Prejudice."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "public institution."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "queer."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "referendum"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "rights"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Rule of Law"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Separation of Power."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "suppression"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Tenets of Democracy"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Toleran."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "transgender."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "transparen."
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "Universal Suffrage"
              }
            },
            {
              "match_phrase": {
                "keywords.keyword": "violat."
              }
            }
          ]
        }
      }
    ]
  }
  }
};

// Liberalism List 1 descending
const liberalism1 = {
  "query": {
    "bool": {
      "must": [
        {
          "match_all": {}
        },
        {
          "range": {
            "list1KwCount": {
              "gte": 1,
              "lt": 100
            }
          }
        },
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {
                "match_phrase": {
                  "keywords.keyword": "basic right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Branch. of Government "
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Checks and Balances"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Civil Liberties"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Civil Right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "civility"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Colorful"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Cooperat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cosmopolitan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deliberation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "demilitarization"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democratic right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "disarmament."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "discriminat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "diverse"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "equal."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ethni."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fair."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom . press"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of expression"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of opinion"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Future"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "gay."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Gender"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "handicapped"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "harmon."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "heterogen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Human Right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "inclusion"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "inclusiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "individual right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "injustice."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "interfaith"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "interreligious"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "intoleran."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "justice"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lesbian."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lgbt."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberal"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Liberal Democrac."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberal right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberal value."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberalism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "marginaliz."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "media diversity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "minorit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multicult."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multiethnic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "negotiat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Open Societ."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Parity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pillars of democracy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pluralis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Political Freedom."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Prejudice."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "public institution."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "queer."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "referendum"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rights"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Rule of Law"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Separation of Power."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "suppression"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Tenets of Democracy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Toleran."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "transgender."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "transparen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Universal Suffrage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "violat."
                }
              }
            ]
          }
        }
      ],
      "filter": [],
      "should": [],
      "must_not": [
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {
                "match_phrase": {
                  "keywords.keyword": "anti-democratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "average citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big compan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big money"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bigwig"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "captiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "careless."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deceiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "defy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "dictator."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "free speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "imperialis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "large corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "looter"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lose control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mainstream part."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "muzzle"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "normal people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oligarch."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oppress."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "orwell."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our values"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "parasit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plunder."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "put people first"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "technocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "traitor."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "undemocratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "1984"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "99 percent"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "abuse."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "accomplice."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "accountab."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti grassroot"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti grass-root"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti-democratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "antidemoratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti-grassroot"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti-grass-root"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "aristocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "arrogan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "autocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "average citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "average people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "backstabbing"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bandit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "betray."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big compan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big money"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bigwig"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bin the licence fee"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "brainwash."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "breach. of trust"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "broken promis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bureaucra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cahoot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "campaign pledge."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "campaign promise."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "capitalis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "captiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "captur."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "careless."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "caste"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "censorship"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cheat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "citizen"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "citizens"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "citizenship"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "claim"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "common good"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "common sense"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "communities"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "community"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "companies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "company"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "conceit"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "concerned citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "consensus"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "conspirac."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "constitution."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "corrupt."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "crisis"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cronies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "crony"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cronyism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cunning"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "damag."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deceit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deceiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decept."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "defy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deliver the Brexit"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democracies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democracy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democrat"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democrats"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "desaster"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "devious"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "dictator."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "disgrace"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "dishonest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "election pledge."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "election promise."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "elite"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "elites"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "elitist"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "empire."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "empower."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "establishment"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "eurocrat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "expense. of the public"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "exploit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "facis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fake media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fake news"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fault"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fed up"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "filthy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "force"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "foreign domination"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fraud"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "free speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of expression"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freeloader"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "general will"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "give voice"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "greater good"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "greed."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "guilty"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hardworking"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hard-working"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "highway robbery"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "highwaym."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hijack"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "honest citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "honest people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hostage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hypocrit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "imperialis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "impose."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "independen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "insincere"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "internationalis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ivory tower"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "justice"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lackey"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "large compan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "large corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "law and order"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "leftist fascism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "leftist media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liar"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "LibLab"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Lib-Lab"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lie"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lie. to"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lobby."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "looter"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lose control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "loss of control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lost control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lying media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mainstream media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mainstream part."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "majority"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "manipulat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "marauder"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "marxis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "middle class"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "misappropriat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "miscreant."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mock"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "monopol"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mouthpiece."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "muzzle"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "negligent"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nepotism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nomenclature"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "normal people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "obsessed with power"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "obsession with power"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "odinary people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oligarch."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oppress."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ordinary citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ordinary people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "orwell."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our people."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our values"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "out of touch"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "parasit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "party interest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people demand"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people know"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people want"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people wish"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "phony"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plunder."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plutocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "political class"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "political correct."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "popular sovereignity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "popular vote"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "popular will"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power hungry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power monger"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power-hungry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pride"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "priviledged"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "propaganda"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "proud"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pseudo expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pseudo-expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "public interest"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "put people first"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "putting people first"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "quisling."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "reckless"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "red tape"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "referendum"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "regime"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "repressive"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "responsibility"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "responsible"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ridicul."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "robber baron"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruined"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rule over"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruling"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruling class"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruling group"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "run down"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "run-down"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "scam."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "scrap the licence fee"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "self interest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "self-interest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "selfish"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "selfishness"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "self-serving"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "shame"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "silent majority"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "snooty"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "so-called expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "solidar."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "sovereign"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "sovereignty"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "state media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "stuck-up"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "subdue."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "submission"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "subservience"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "subservient"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "take back control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "taking back control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "taxpayer."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "technocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "the rich"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "traitor."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "treason"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "treason against the people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "truth"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "unconstitutional."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "undemocratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "unelected"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "vassal state"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "voter."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "vox populi"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wannabe expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "withstand."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "working class."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wrongspeak"
                }
              }
            ]
          }
        },
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {
                "match_phrase": {
                  "keywords.keyword": "ancest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum chaos"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum industry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "band. of migrants"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "clean out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cleaning out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deportation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "destiny"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "domestic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherlands"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "folklore"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "forefather."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "headscarf."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "homeland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "identity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "integrat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "islamis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lineage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass immigration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migrant."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "national tradition"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nations"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "native."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "open border."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our country"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our custom."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our tradition."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our way of life"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "patriot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "reconquista"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "repatriation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "replacement agenda"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "right of blood"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficker"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficking"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wave of refugees"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "western world"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum chaos"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum industry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "band. of migrants"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "clean out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cleaning out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deportation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "destiny"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "domestic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherlands"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "folklore"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "forefather."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "headscarf."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "homeland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "identity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "integrat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "islamis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lineage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass immigration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migrant."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "national tradition"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nations"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "native."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "open border."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our country"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our custom."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our tradition."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our way of life"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "patriot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "reconquista"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "repatriation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "replacement agenda"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "right of blood"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficker"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficking"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wave of refugees"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "western world"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "alien."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "barbar."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "border control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "britain"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "britains"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "british"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "catastroph."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "control the border"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "controlling the border"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decline"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "demise"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "destruction"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "diversity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "doom"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "floodgate."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "foreigner."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Great Britain"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "heritage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "inherit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "jus sanguinis"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Land of Hope and Glory"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "loss"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "minorit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multi-cultural."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multicultural."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "national"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nationalism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nationalist."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rape."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rapist."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "refugee."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "savage."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "stranger."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "UK"
                }
              }
            ]
          }
        }
      ]
    }
  }
};

const populism1 = {
  "query": {
    "bool": {
      "must": [
        {
          "match_all": {}
        },
        {
          "range": {
            "list1KwCount": {
              "gte": 1,
              "lt": 100
            }
          }
        },
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {
                "match_phrase": {
                  "keywords.keyword": "anti-democratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "average citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big compan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big money"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bigwig"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "captiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "careless."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deceiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "defy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "dictator."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "free speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "imperialis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "large corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "looter"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lose control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mainstream part."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "muzzle"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "normal people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oligarch."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oppress."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "orwell."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our values"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "parasit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plunder."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "put people first"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "technocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "traitor."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "undemocratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "1984"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "99 percent"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "abuse."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "accomplice."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "accountab."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti grassroot"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti grass-root"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti-democratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "antidemoratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti-grassroot"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti-grass-root"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "aristocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "arrogan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "autocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "average citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "average people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "backstabbing"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bandit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "betray."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big compan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big money"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bigwig"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bin the licence fee"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "brainwash."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "breach. of trust"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "broken promis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bureaucra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cahoot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "campaign pledge."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "campaign promise."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "capitalis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "captiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "captur."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "careless."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "caste"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "censorship"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cheat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "citizen"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "citizens"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "citizenship"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "claim"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "common good"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "common sense"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "communities"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "community"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "companies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "company"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "conceit"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "concerned citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "consensus"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "conspirac."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "constitution."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "corrupt."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "crisis"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cronies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "crony"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cronyism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cunning"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "damag."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deceit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deceiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decept."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "defy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deliver the Brexit"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democracies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democracy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democrat"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democrats"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "desaster"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "devious"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "dictator."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "disgrace"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "dishonest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "election pledge."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "election promise."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "elite"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "elites"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "elitist"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "empire."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "empower."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "establishment"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "eurocrat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "expense. of the public"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "exploit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "facis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fake media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fake news"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fault"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fed up"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "filthy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "force"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "foreign domination"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fraud"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "free speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of expression"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freeloader"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "general will"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "give voice"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "greater good"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "greed."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "guilty"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hardworking"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hard-working"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "highway robbery"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "highwaym."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hijack"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "honest citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "honest people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hostage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hypocrit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "imperialis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "impose."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "independen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "insincere"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "internationalis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ivory tower"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "justice"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lackey"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "large compan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "large corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "law and order"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "leftist fascism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "leftist media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liar"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "LibLab"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Lib-Lab"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lie"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lie. to"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lobby."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "looter"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lose control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "loss of control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lost control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lying media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mainstream media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mainstream part."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "majority"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "manipulat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "marauder"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "marxis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "middle class"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "misappropriat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "miscreant."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mock"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "monopol"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mouthpiece."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "muzzle"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "negligent"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nepotism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nomenclature"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "normal people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "obsessed with power"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "obsession with power"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "odinary people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oligarch."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oppress."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ordinary citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ordinary people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "orwell."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our people."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our values"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "out of touch"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "parasit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "party interest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people demand"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people know"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people want"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people wish"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "phony"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plunder."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plutocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "political class"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "political correct."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "popular sovereignity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "popular vote"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "popular will"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power hungry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power monger"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power-hungry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pride"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "priviledged"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "propaganda"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "proud"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pseudo expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pseudo-expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "public interest"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "put people first"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "putting people first"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "quisling."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "reckless"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "red tape"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "referendum"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "regime"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "repressive"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "responsibility"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "responsible"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ridicul."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "robber baron"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruined"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rule over"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruling"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruling class"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruling group"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "run down"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "run-down"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "scam."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "scrap the licence fee"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "self interest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "self-interest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "selfish"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "selfishness"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "self-serving"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "shame"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "silent majority"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "snooty"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "so-called expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "solidar."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "sovereign"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "sovereignty"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "state media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "stuck-up"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "subdue."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "submission"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "subservience"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "subservient"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "take back control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "taking back control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "taxpayer."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "technocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "the rich"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "traitor."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "treason"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "treason against the people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "truth"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "unconstitutional."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "undemocratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "unelected"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "vassal state"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "voter."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "vox populi"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wannabe expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "withstand."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "working class."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wrongspeak"
                }
              }
            ]
          }
        }
      ],
      "filter": [],
      "should": [],
      "must_not": [
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {
                "match_phrase": {
                  "keywords.keyword": "basic right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Branch. of Government "
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Checks and Balances"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Civil Liberties"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Civil Right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "civility"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Colorful"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Cooperat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cosmopolitan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deliberation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "demilitarization"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democratic right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "disarmament."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "discriminat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "diverse"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "equal."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ethni."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fair."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom . press"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of expression"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of opinion"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Future"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "gay."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Gender"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "handicapped"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "harmon."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "heterogen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Human Right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "inclusion"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "inclusiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "individual right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "injustice."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "interfaith"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "interreligious"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "intoleran."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "justice"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lesbian."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lgbt."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberal"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Liberal Democrac."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberal right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberal value."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberalism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "marginaliz."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "media diversity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "minorit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multicult."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multiethnic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "negotiat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Open Societ."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Parity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pillars of democracy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pluralis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Political Freedom."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Prejudice."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "public institution."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "queer."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "referendum"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rights"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Rule of Law"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Separation of Power."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "suppression"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Tenets of Democracy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Toleran."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "transgender."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "transparen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Universal Suffrage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "violat."
                }
              }
            ]
          }
        },
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {
                "match_phrase": {
                  "keywords.keyword": "ancest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum chaos"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum industry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "band. of migrants"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "clean out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cleaning out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deportation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "destiny"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "domestic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherlands"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "folklore"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "forefather."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "headscarf."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "homeland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "identity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "integrat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "islamis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lineage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass immigration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migrant."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "national tradition"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nations"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "native."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "open border."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our country"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our custom."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our tradition."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our way of life"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "patriot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "reconquista"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "repatriation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "replacement agenda"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "right of blood"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficker"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficking"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wave of refugees"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "western world"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum chaos"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum industry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "band. of migrants"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "clean out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cleaning out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deportation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "destiny"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "domestic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherlands"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "folklore"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "forefather."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "headscarf."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "homeland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "identity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "integrat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "islamis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lineage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass immigration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migrant."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "national tradition"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nations"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "native."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "open border."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our country"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our custom."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our tradition."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our way of life"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "patriot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "reconquista"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "repatriation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "replacement agenda"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "right of blood"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficker"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficking"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wave of refugees"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "western world"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "alien."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "barbar."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "border control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "britain"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "britains"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "british"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "catastroph."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "control the border"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "controlling the border"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decline"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "demise"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "destruction"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "diversity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "doom"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "floodgate."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "foreigner."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Great Britain"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "heritage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "inherit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "jus sanguinis"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Land of Hope and Glory"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "loss"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "minorit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multi-cultural."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multicultural."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "national"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nationalism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nationalist."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rape."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rapist."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "refugee."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "savage."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "stranger."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "UK"
                }
              }
            ]
          }
        }
      ]
    }
  }
};

const populism2 = {
  "query": {
    "bool": {
      "must": [
        {
          "match_all": {}
        },
        {
          "range": {
            "list2KwCount": {
              "gte": 3,
              "lt": 100
            }
          }
        },
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {
                "match_phrase": {
                  "keywords.keyword": "anti-democratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "average citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big compan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big money"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bigwig"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "captiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "careless."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deceiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "defy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "dictator."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "free speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "imperialis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "large corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "looter"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lose control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mainstream part."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "muzzle"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "normal people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oligarch."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oppress."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "orwell."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our values"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "parasit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plunder."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "put people first"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "technocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "traitor."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "undemocratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "1984"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "99 percent"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "abuse."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "accomplice."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "accountab."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti grassroot"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti grass-root"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti-democratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "antidemoratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti-grassroot"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "anti-grass-root"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "aristocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "arrogan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "autocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "average citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "average people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "backstabbing"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bandit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "betray."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big compan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "big money"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bigwig"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bin the licence fee"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "brainwash."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "breach. of trust"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "broken promis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "bureaucra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cahoot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "campaign pledge."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "campaign promise."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "capitalis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "captiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "captur."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "careless."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "caste"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "censorship"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cheat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "citizen"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "citizens"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "citizenship"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "claim"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "common good"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "common sense"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "communities"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "community"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "companies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "company"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "conceit"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "concerned citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "consensus"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "conspirac."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "constitution."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "corrupt."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "crisis"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cronies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "crony"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cronyism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cunning"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "damag."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deceit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deceiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decent people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decept."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "defy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deliver the Brexit"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democracies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democracy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democrat"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democrats"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "desaster"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "devious"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "dictator."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "disgrace"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "dishonest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "election pledge."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "election promise."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "elite"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "elites"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "elitist"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "empire."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "empower."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "establishment"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "eurocrat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "expense. of the public"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "exploit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "facis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fake media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fake news"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fault"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fed up"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "filthy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "force"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "foreign domination"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fraud"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "free speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of expression"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freeloader"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "general will"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "give voice"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "greater good"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "greed."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "guilty"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hardworking"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hard-working"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "highway robbery"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "highwaym."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hijack"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "honest citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "honest people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hostage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "hypocrit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "imperialis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "impose."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "independen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "insincere"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "internationalis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ivory tower"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "justice"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lackey"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "large compan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "large corporation."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "law and order"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "leftist fascism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "leftist media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liar"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "LibLab"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Lib-Lab"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lie"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lie. to"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lies"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lobby."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "looter"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lose control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "loss of control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lost control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lying media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mainstream media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mainstream part."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "majority"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "manipulat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "marauder"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "marxis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "middle class"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "misappropriat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "miscreant."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mock"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "monopol"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mouthpiece."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "muzzle"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "negligent"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nepotism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nomenclature"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "normal people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "obsessed with power"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "obsession with power"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "odinary people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oligarch."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "oppress."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ordinary citizen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ordinary people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "orwell."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our people."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our values"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "out of touch"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "parasit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "party interest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people demand"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people know"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people want"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people wish"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "people."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "phony"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plunder."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "plutocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "political class"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "political correct."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "popular sovereignity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "popular vote"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "popular will"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power hungry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power monger"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "power-hungry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pride"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "priviledged"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "propaganda"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "proud"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pseudo expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pseudo-expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "public interest"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "put people first"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "putting people first"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "quisling."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "reckless"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "red tape"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "referendum"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "regime"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "repressive"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "responsibility"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "responsible"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ridicul."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "robber baron"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruined"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rule over"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruling"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruling class"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ruling group"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "run down"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "run-down"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "scam."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "scrap the licence fee"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "self interest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "self-interest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "selfish"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "selfishness"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "self-serving"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "shame"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "silent majority"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "snooty"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "so-called expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "solidar."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "sovereign"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "sovereignty"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "state media"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "stuck-up"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "subdue."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "submission"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "subservience"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "subservient"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "take back control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "taking back control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "taxpayer."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "technocra."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "the rich"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "traitor."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "treason"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "treason against the people"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "truth"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "unconstitutional."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "undemocratic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "unelected"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "vassal state"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "voter."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "vox populi"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wannabe expert."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "withstand."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "working class."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wrongspeak"
                }
              }
            ]
          }
        }
      ],
      "filter": [],
      "should": [],
      "must_not": [
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {
                "match_phrase": {
                  "keywords.keyword": "basic right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Branch. of Government "
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Checks and Balances"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Civil Liberties"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Civil Right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "civility"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Colorful"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Cooperat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cosmopolitan."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deliberation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "demilitarization"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "democratic right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "disarmament."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "discriminat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "diverse"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "equal."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "ethni."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fair."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom . press"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of expression"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of opinion"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "freedom of speech"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Future"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "gay."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Gender"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "handicapped"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "harmon."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "heterogen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Human Right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "inclusion"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "inclusiv."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "individual right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "injustice."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "interfaith"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "interreligious"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "intoleran."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "justice"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lesbian."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lgbt."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberal"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Liberal Democrac."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberal right."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberal value."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "liberalism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "marginaliz."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "media diversity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "minorit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multicult."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multiethnic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "negotiat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Open Societ."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Parity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pillars of democracy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "pluralis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Political Freedom."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Prejudice."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "public institution."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "queer."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "referendum"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rights"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Rule of Law"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Separation of Power."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "suppression"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Tenets of Democracy"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Toleran."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "transgender."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "transparen."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Universal Suffrage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "violat."
                }
              }
            ]
          }
        },
        {
          "bool": {
            "minimum_should_match": 1,
            "should": [
              {
                "match_phrase": {
                  "keywords.keyword": "ancest."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum chaos"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum industry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "band. of migrants"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "clean out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cleaning out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deportation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "destiny"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "domestic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherlands"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "folklore"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "forefather."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "headscarf."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "homeland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "identity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "integrat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "islamis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lineage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass immigration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migrant."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "national tradition"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nations"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "native."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "open border."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our country"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our custom."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our tradition."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our way of life"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "patriot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "reconquista"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "repatriation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "replacement agenda"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "right of blood"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficker"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficking"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wave of refugees"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "western world"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum chaos"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "asylum industry"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "band. of migrants"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "clean out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "cleaning out"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "deportation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "destiny"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "domestic"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "fatherlands"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "folklore"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "forefather."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "headscarf."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "homeland"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "identity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "integrat."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "islamis."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "lineage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass immigration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "mass migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migrant."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "migration"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "national tradition"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nations"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "native."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "open border."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our country"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our custom."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our tradition."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "our way of life"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "patriot."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "reconquista"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "repatriation"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "replacement agenda"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "right of blood"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficker"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "trafficking"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "wave of refugees"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "western world"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "alien."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "barbar."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "border control"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "britain"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "britains"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "british"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "catastroph."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "control the border"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "controlling the border"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "decline"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "demise"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "destruction"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "diversity"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "doom"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "floodgate."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "foreigner."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Great Britain"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "heritage"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "inherit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "jus sanguinis"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "Land of Hope and Glory"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "loss"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "minorit."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multi-cultural."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "multicultural."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "national"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nationalism"
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "nationalist."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rape."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "rapist."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "refugee."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "savage."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "stranger."
                }
              },
              {
                "match_phrase": {
                  "keywords.keyword": "UK"
                }
              }
            ]
          }
        }
      ]
    }
  }
}

module.export = {
  nativism1,
  nativism2,
  liberalism1,
  populism1,
  populism2
}