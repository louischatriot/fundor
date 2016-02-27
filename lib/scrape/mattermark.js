var request = require('request')
  , cheerio = require('cheerio')
  , searchUrl = "https://mattermark.com/companies/"
  , fs = require('fs')
  , url = require('url')
  , async = require('async')
  , requestsMade = 0   // Such an evil method
  ;


/**
 * Get result from one url from Mattermark
 */
function scrapePage (d, _callback) {
  var callback = _callback || function () {};

  request.get({ url: searchUrl + d.domain }, function (err, res, body) {
    requestsMade += 1;

    if (res.statusCode !== 200) {
      if (res.statusCode.toString() === '429') { console.log("Rate limited"); }
      return callback(null, null);
    }   // Or maybe return the error?

    var $ = cheerio.load(body)
      , $labels = $('.qf-grid div.data-label')
      , metadata = { domain: d.domain, url: d.url }
      ;

    $labels.each(function () {
      var $elt = $(this);

      if ($elt.text().toLowerCase() === 'total funding') {
        metadata.funding = $elt.parent().find('p').text();
      }
    });

    return callback(null, metadata);
  });
}


/**
 * Scrape a list of domains
 */
function scrapeDomains (domainList, _callback) {
  var callback = _callback || function () {}
    , scraped = [];

  // Let's do requests 5 at a time
  var queue = async.queue(function (d, cb) {
    scrapePage(d, function (err, metadata) {
      if (metadata) { scraped.push(metadata); }
      return cb();
    });
  }, 1);

  queue.drain = function () {
    console.log("Finished treating all domains");
    console.log(requestsMade + " requests made");
    console.log(scraped);

    var dataToWrite = "domain;url;funding";
    scraped.forEach(function (d) {
      dataToWrite += '\n' + d.domain + ";" + d.url + ";" + d.funding;
    });
    fs.writeFileSync("data/out.csv", dataToWrite, 'utf8');
  };

  domainList.forEach(function (d) { queue.push(d); });
}



/**
 * If file with list of urls/domains passed, scrape it
 */
var file = process.argv[2];
if (file) {
  var urls = fs.readFileSync(file, 'utf8').split('\n');   // Of course doesn't work on Windows, but hey, Windows ...
  var domains = [];

  // Get clean domains
  urls.forEach(function (_u) {
    var d;
    if (_u.match(/^http/i)) {
      u = url.parse(_u);
      d = u.hostname;
    } else {
      d = _u;
    }

    d = d.replace(/^www\./, '').replace(/\/$/, '');
    if (d.length > 0) {
      domains.push({ domain: d, url: _u });
    }
  });

  //domains = domains.slice(domains.length - 12);   // Dev

  scrapeDomains(domains);
}


// Interface
module.exports.scrapePage = scrapePage;

