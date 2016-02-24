var Nedb = require('nedb')
  , fundings: new Nedb({ filename: 'data/fundings.nedb', autoload: true; })
  ;

// Interface
module.exports = { fundings: fundings };
