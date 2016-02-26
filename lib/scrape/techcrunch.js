var request = require('request')
  , cheerio = require('cheerio')
  , latestFundingsUrl = "https://www.crunchbase.com/funding-rounds"
  , mainPageUrl = "http://techcrunch.com/"
  , TCFundingPageUrl = "http://techcrunch.com/tag/funding/"
  , zlib = require('zlib')
  ;


function cleanText (text) {
  return text.replace(/&#xA0;/g, ' ');
}

// Extract amount from the text
function getAmount (text) {
  var match, amount;

  // Funding round size. Maybe include billions even though these are usually easily noticed?
  [/\$([0-9\.]+) Million/, /\$([0-9\.]+)M/].forEach(function (regex) {
    match = text.match(regex);
    if (!amount && match) { amount = parseFloat(match[1]) * 1e6; }
    //text = text.replace(regex, '');
  });

  return amount;
}

/*
 * Extract name, location, category of company and links to crunchbase profile and website
 * Optional callback returns metadata object
 */
function getMetadata (TCUrl, _callback) {
  var callback = _callback || function () {};

  request.get({ url: TCUrl }, function (err, res, body) {
    if (res.statusCode !== 200) { return callback(null, null); }   // If cannot get page, don't return an error but of course no data

    var $ = cheerio.load(body)
      , $title = $('a.cb-card-title-link')
      , name = $title.text().trim()
      , crunchbaseUrl = $title.attr('href')
      , metadata = { name: name, crunchbaseUrl: crunchbaseUrl }
      , location, category
      ;

    $('div.card-acc-panel li strong').each(function () {
      var $elt = $(this)
        , metadataType = $elt.text();

      ['location', 'categories', 'website'].forEach(function (d) {
        if ($elt.text().toLowerCase() === d) { metadata[d] = $elt.parent().find('span.value').text().trim().replace(/\t/g, ''); }
      });
    });

    console.log(metadata);
    callback(null, metadata);
  });
}

getMetadata("http://techcrunch.com/2016/02/16/zoomdata-snares-25-million-series-c-led-by-goldman-sachs/");


/**
 * Get Crunchbase's latest funding rounds page and get the data
 */
function scrapePage (callback) {
  return;
  request.get({ url: TCFundingPageUrl }, function (err, res, body) {
    var $ = cheerio.load(body)
      , $titles = $('h2.post-title a')
      ;

    console.log(res.statusCode);

    var doneOnce = false;

    $titles.each(function () {
      var $elt = $(this)
        , title = $elt.text().trim()
        , url = $elt.attr('href')
        ;

      if (doneOnce) { return; }
      doneOnce = true;

      console.log(title);

      var amount = getAmount(title);
      console.log(amount);

      console.log(url);
      getMetadata(url);


    });

    var names = $('.name').html();

    console.log(names);
    //console.log(zlib.deflateSync(new Buffer(body)));
  });

}


scrapePage();


// Interface
module.exports.scrapePage = scrapePage;

