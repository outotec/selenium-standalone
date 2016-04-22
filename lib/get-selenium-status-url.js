var URI = require('urijs');
var PROCESS_TYPES = exports.PROCESS_TYPES = {
  STANDALONE: 0,
  GRID_HUB: 1,
  GRID_NODE: 2
};

exports.getRunningProcessType = function(seleniumArgs) {
  var roleArg = seleniumArgs.indexOf('-role');
  var role = (roleArg !== -1) ? seleniumArgs[roleArg + 1] : undefined;

  if (roleArg === -1) return PROCESS_TYPES.STANDALONE;
  else if (role === 'hub') return PROCESS_TYPES.GRID_HUB;
  else if (role === 'node') return PROCESS_TYPES.GRID_NODE;
  else return undefined;
}

exports.getHost = function(seleniumArgs) {
  var hostArg = seleniumArgs.indexOf('-host');
  return (hostArg !== -1) ? seleniumArgs[hostArg + 1] : 'localhost';
}

exports.getPort = function(seleniumArgs) {
  var portArg = seleniumArgs.indexOf('-port');
  if (portArg !== -1) {
    return seleniumArgs[portArg + 1];
  }

  var port = 4444;
  var processType = this.getRunningProcessType(seleniumArgs);
  switch (processType) {
    case PROCESS_TYPES.STANDALONE:
    case PROCESS_TYPES.GRID_HUB:
      break;
    case PROCESS_TYPES.GRID_NODE:
      port = 5555;
      break;
    default:
      throw 'ERROR: Trying to run selenium in an unknown way.';
  }

  return port;
}

exports.getPath = function(seleniumArgs) {
  var nodeStatusAPIPath = '/wd/hub/status';
  var hubStatusAPIPath = '/grid/api/hub';
  var path = nodeStatusAPIPath;

  var processType = this.getRunningProcessType(seleniumArgs);
  switch (processType) {
    case PROCESS_TYPES.STANDALONE:
    case PROCESS_TYPES.GRID_NODE:
      break;
    case PROCESS_TYPES.GRID_HUB:
      path = hubStatusAPIPath;
      break;
    default:
      throw 'ERROR: Trying to run selenium in an unknown way.';
  }

  return path;
}

exports.getSeleniumStatusUrl = function(seleniumArgs) {
  var host = this.getHost(seleniumArgs);
  var statusURI = new URI('http://' + host);

  var port = this.getPort(seleniumArgs);
  var path = this.getPath(seleniumArgs);
  statusURI.port(port);
  statusURI.path(path);

  return statusURI.toString();
}
