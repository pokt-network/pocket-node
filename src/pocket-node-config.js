var ConfigFileManager = require('./config-file-manager'),
    fileManager = new ConfigFileManager('../configuration/config.json');

module.exports.getSupportedNetworks = function() {
  return fileManager.getProperty('networks') || [];
}

module.exports.isNetworkSupported = function(network) {
  return this.getSupportedNetworks().includes(network.toUpperCase());
}

module.exports.getEthProviderURL = function() {
  return fileManager.getProperty('eth_provider_url') || 'http://localhost:8545';
}

module.exports.getEpochRegistryAPIAddress = function() {
  return fileManager.getProperty('epoch_registry_api_address') || throw 'EpochRegistryAPI Address not found';
}

module.exports.getEthAccount = function() {
  return fileManager.getProperty('eth_account') || throw 'Ethereum Account not set';
}

module.exports.getNodeNonce = function() {
  return fileManager.getProperty('node_nonce') || throw 'Node Nonce not set';
}
