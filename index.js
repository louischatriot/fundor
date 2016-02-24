var express = require('express')
  , app = express()
  , server = require('http').Server(app)
  //, bodyParser = require('body-parser')
  , config = require('./lib/config')
  ;

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

// Web interface
//app.get('/user/:id', users.userPage);


// Root. Descriptive main page if not logged, main action (create a mapping) if logged
app.get('/', function (req, res) {
  return res.render('front-page.jade');
});


// Serve static client-side js and css
// TODO: use Nginx to serve static assets
app.get('/assets/*', function (req, res) {
  res.sendFile(process.cwd() + req.url);
});



// Last wall of defense against a bad crash
process.on('uncaughtException', function (err) {
  console.log('Caught an uncaught exception, I should probably send an email or something');
  console.log(err);
  if (err.stack) { console.log(err.stack); }
});


// Launch server
server.listen(config.serverPort);

