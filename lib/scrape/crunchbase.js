var request = require('request')
  , cheerio = require('cheerio')
  , latestFundingsUrl = "https://www.crunchbase.com/funding-rounds"
  , zlib = require('zlib')
  ;


/**
 * Get Crunchbase's latest funding rounds page and get the data
 */
function scrapePage () {
  request.get({ url: latestFundingsUrl
              , headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36'
                         , 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                         , 'Accept-Encoding': 'gzip, deflate, sdch'
                         , 'Accept-Language': 'en-US,en;q=0.8'
                         , 'Cache-Control': 'no-cache'
                         , 'Connection': 'keep-alive'
                         , 'Host': 'www.crunchbase.com'
                         , 'Pragma': 'no-cache'
                         , 'Upgrade-Insecure-Requests': '1'
                         }
              }, function (err, res, body) {
    console.log(res.headers);

    console.log(zlib.deflateSync(new Buffer(body)));
  });

}


scrapePage();


// Interface
module.exports.scrapePage = scrapePage;
