var Web3 = require('web3');

module.exports.registerNode = function(nodeAccountAddress, gasLimit, registryContractAddress, abi) {
  var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/mTHA4OGRiv9h9kJgTv7u")),
      contractInstance = new web3.eth.Contract(abi, registryContractAddress, {
        from: nodeAccountAddress,
        gas: gasLimit
      });

  web3.eth.accounts.wallet.add("0x9e6e2c1b5693866359b5857bb03e611188cd1b3a13c23063acea423b54535146");
  contractInstance.methods.registerNode().send({from: nodeAccountAddress, gas: gasLimit});
};

module.exports.getCurrentNode = function(nodeAccountAddress, gasLimit, registryContractAddress, abi, callback){
  var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/mTHA4OGRiv9h9kJgTv7u")),
      contractInstance = new web3.eth.Contract(abi, registryContractAddress, {
        from: nodeAccountAddress,
        gas: gasLimit
      });
  contractInstance.methods.getCurrentNode().send({from: nodeAccountAddress, gas: gasLimit}, callback);
};
