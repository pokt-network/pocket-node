var ConfigFileManager = require('./config-file-manager'),
    fileManager = new ConfigFileManager('config.json'),
    validKeys = ['eth_provider_url', 'epoch_registry_api_address', 'eth_account', 'node_nonce'];

function isValidKey(key) {
  return validKeys.includes(key);
}

module.exports.getEthProviderURL = function() {
  return fileManager.getProperty('eth_provider_url') || 'http://localhost:8545';
}

// TODO set default epochregistryapi address
module.exports.getEpochRegistryAPIAddress = function() {
  return fileManager.getProperty('epoch_registry_api_address') || null;
}

module.exports.getEthAccount = function() {
  return fileManager.getProperty('eth_account') || null;
}

module.exports.getNodeNonce = function() {
  return fileManager.getProperty('node_nonce') || null;
}

module.exports.updateConfig = async function(key, value) {
  if(!isValidKey(key)) throw 'Invalid config key';
  await fileManager.updateProperty(key, value);
}
