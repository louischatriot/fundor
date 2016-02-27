var request = require('request')
  , cheerio = require('cheerio')
  , searchUrl = "https://mattermark.com/companies/"
  , fs = require('fs')
  ;


/**
 * Get result from one url from Mattermark
 */
function scrapePage (url, _callback) {
  var callback = _callback || function () {};

  request.get({ url: searchUrl + url }, function (err, res, body) {
    if (res.statusCode !== 200) { return callback(null, null); }   // Or maybe return the error?

    var $ = cheerio.load(body)
      , $labels = $('.qf-grid div.data-label')
      , metadata = {}
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
  var callback = _callback || function () {};
}


//scrapePage('melty.fr');


/**
 * If file with list of urls passed, scrape it
 */
console.log(process.argv);


// Interface
module.exports.scrapePage = scrapePage;

