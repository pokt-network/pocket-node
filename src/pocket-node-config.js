var ConfigFileManager = require('./config-file-manager'),
    fileManager = new ConfigFileManager('config.json'),
    validKeys = ['eth_provider_url', 'epoch_registry_api_address', 'eth_account', 'node_nonce', 'eth_network_id'];

function isValidKey(key) {
  return validKeys.includes(key);
}

module.exports.getEthProviderURL = async function() {
  return await fileManager.getProperty('eth_provider_url') || null;
}

// TODO set default epochregistryapi address
module.exports.getEpochRegistryAPIAddress = async function() {
  return await fileManager.getProperty('epoch_registry_api_address') || null;
}

module.exports.getEthAccount = async function() {
  return await fileManager.getProperty('eth_account') || null;
}

module.exports.getNodeNonce = async function() {
  return await fileManager.getProperty('node_nonce') || null;
}

module.exports.getEthNetworkId = async function() {
  return await fileManager.getProperty('eth_network_id') || null;
}

module.exports.updateConfig = async function(key, value) {
  if(!isValidKey(key)) throw 'Invalid config key';
  await fileManager.updateProperty(key, value);
}
