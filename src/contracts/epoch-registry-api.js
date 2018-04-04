var PocketNodeConfig = require('../pocket-node-config'),
    Web3 = require('web3'),
    TruffleContract = require("truffle-contract"),
    contractABI = require('./epoch-registry-api-abi.json').abi;

// Export contract instance
module.exports = async function(){
  var ethProviderUrl = await PocketNodeConfig.getEthProviderURL(),
      ethProvider = new Web3.providers.HttpProvider(ethProviderUrl),
      networkId = await PocketNodeConfig.getEthNetworkId(),
      contractAddress = await PocketNodeConfig.getEpochRegistryAPIAddress(),
      contractInstance = null;

  // Create contract abstraction
  var EpochRegistryAPI = TruffleContract({
    abi: contractABI
  });

  // Configure contract instance
  EpochRegistryAPI.setProvider(ethProvider);
  EpochRegistryAPI.setNetwork(parseInt(networkId));
  EpochRegistryAPI.defaults({
    from: await PocketNodeConfig.getEthAccount()
  });

  try {
    contractInstance = await EpochRegistryAPI.at(contractAddress);
  } catch (e) {
    console.error(e);
  }
  return contractInstance;
}
