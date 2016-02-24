var env = process.env.FUNDOR_ENV || 'dev'
  , config = {}
  ;

// Common options
config.env = env;
config.serverPort = 4999;

// Environment specific options
switch (env) {
  case 'prod':
    config.host = 'http://fundor.lmt.io';
    break;

  case 'dev':
  default:
    config.loginNotRequired = false;   // Set to true to avoid having to log upon every reload
    config.host = 'http://localhost:' + config.serverPort;
    break;
}

// Interface
module.exports = config;
