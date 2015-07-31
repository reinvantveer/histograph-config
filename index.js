var argv = require('minimist')(process.argv.slice(2));

var fs = require('fs');
var util = require('util');
var R = require('ramda');
var yaml = require('js-yaml');

function die(message) {
  console.error(message);
  process.exit(-1);
}

module.exports = (function() {
  var config;
  var filename = argv.config || process.env.HISTOGRAPH_CONFIG;

  if (!filename) {
    die('doe of HISTOGRAPH_CONFIG of --config!');
  }

  try {
    config = yaml.safeLoad(fs.readFileSync('./histograph.default.yml', 'utf8'));
  } catch (e) {
    die('Failed to open default configuration file `histograph.default.yml`');
  }

  try {
    var userConfig = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
    config = R.merge(config, userConfig);
  } catch (e) {
    die(util.format('Can\'t open configuration file `%s`', filename));
  }

  // TODO: check JSON schema with is-my-json-valid!

  return config;
}());