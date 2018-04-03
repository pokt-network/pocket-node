var PocketNodeConfig = require('../pocket-node-config'),
    Web3 = require('web3'),
    ethProvider = new Web3.providers.HttpProvider(PocketNodeConfig.getEthProviderURL()),
    TruffleContract = require("truffle-contract"),
    contractABI = require('./epoch-registry-api-abi.json');

// Create contract abstraction
var EpochRegistryAPI = TruffleContract({
  abi: contractABI,
  address: PocketNodeConfig.getEpochRegistryAPIAddress()
});

// Configure contract instance
EpochRegistryAPI.setProvider(ethProvider);
EpochRegistryAPI.defaults({
  from: PocketNodeConfig.getEthAccount()
});

// Export contract instance
module.exports = EpochRegistryAPI;
