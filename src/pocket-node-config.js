var updater = require('jsonfile-updater'),
    configFilePath = '../configuration/config.json',
    configFile = require(configFilePath);

// Private module functions
function updateConfigValue(key, value){
  updater(configFilePath).update(key, value, function(err) {
    if (err) {
      const errorMessage = 'Failed to update configuration property: ' + key;
      throw errorMessage;
    }
  });
}

function reloadConfigFile(){
  configFile = require(configFilePath);
}

function getProperty(key){
  reloadConfigFile();
  return configFile[key];
}

// Public module functions
module.exports.getSupportedNetworks = function() {
  return getProperty('networks') || [];
}

module.exports.isNetworkSupported = function(network) {
  return this.getSupportedNetworks().includes(network.toUpperCase());
}
