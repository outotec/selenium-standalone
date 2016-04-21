module.exports = checkStarted;

var request = require('request').defaults({json: true});
var statusUrl = require('./get-selenium-status-url.js');

function checkStarted(seleniumArgs, logger, cb) {
  logger("checkStarted");
  var retries = 0;
  var hub = statusUrl.getSeleniumStatusUrl(seleniumArgs, logger);
  logger("hub url: " + hub);

  // server has one minute to start
  var retryInterval = 200;
  var maxRetries = 60 * 1000 / retryInterval;

  function hasStarted() {
    retries++;
    logger("check iteration: " + retries + " / " + maxRetries);

    if (retries > maxRetries) {
      logger("Unable to connect to selenium");
      cb(new Error('Unable to connect to selenium'));
      return;
    }

    request(hub, function (err, res) {
      logger("respose received from request to " + hub);
      if (err || res.statusCode !== 200) {
        if (err) {
            logger(err)
        } else {
            logger("code " + res.statusCode + " received");
        }
        // setTimeout(hasStarted, retryInterval);
        logger("Unable to check the status of selenium, nevermind");
        cb(null);
        return;
      }
      logger("success");
      cb(null);
    });
  }

  setTimeout(hasStarted, 500);
}
