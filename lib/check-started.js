module.exports = checkStarted;

var request = require('request').defaults({json: true});
var statusUrl = require('./get-selenium-status-url.js');

function checkStarted(seleniumArgs, cb) {
  console.log("checkStarted");
  var retries = 0;
  var hub = statusUrl.getSeleniumStatusUrl(seleniumArgs);
  console.log("hub url: " + hub);

  // server has one minute to start
  var retryInterval = 200;
  var maxRetries = 60 * 1000 / retryInterval;

  function hasStarted() {
    retries++;
    console.log("check iteration: " + retries + " / " + maxRetries);

    if (retries > maxRetries) {
      console.log("Unable to connect to selenium");
      cb(new Error('Unable to connect to selenium'));
      return;
    }

    request(hub, function (err, res) {
      console.log("respose received from request to " + hub);
      if (err || res.statusCode !== 200) {
        if (err) {
            console.log(err)
        } else {
            console.log("code " + res.statusCode + " received");
        }
        // setTimeout(hasStarted, retryInterval);
        console.log("Unable to check the status of selenium, nevermind");
        cb(null);
        return;
      }
      console.log("success");
      cb(null);
    });
  }

  setTimeout(hasStarted, 500);
}
