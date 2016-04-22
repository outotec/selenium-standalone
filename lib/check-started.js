module.exports = checkStarted;

var http = require('http');
var httpsProxyAgent = require('https-proxy-agent');
var statusUrl = require('./get-selenium-status-url.js');

function checkStarted(seleniumArgs, cb) {
  var retries = 0;
  // server has one minute to start
  var retryInterval = 200;
  var maxRetries = 60 * 1000 / retryInterval;

  var requestOptions = {
    host: statusUrl.getHost(seleniumArgs),
    port: statusUrl.getPort(seleniumArgs),
    path: statusUrl.getPath(seleniumArgs)
  }
  var proxy = process.env.https_proxy || process.env.http_proxy;
  if (proxy !== undefined) {
    requestOptions.agent = new httpsProxyAgent(proxy);
  }

  function hasStarted() {
    retries++;

    if (retries > maxRetries) {
      cb(new Error('Unable to connect to selenium'));
      return;
    }

    var req = http.request(requestOptions, function(res) {
      cb(null);
    });
    req.end();

    req.on('error', function(error) {
      if (err || res.statusCode !== 200) {
        setTimeout(hasStarted, retryInterval);
        return;
      }
      cb(error);
    });
  }

  setTimeout(hasStarted, 500);
}
