var Web3 = require('web3');

class PocketNodeContract {
  constructor(address, ownerAddress, ownerPK, abi) {
    this.address = address;
    this.ownerAddress = ownerAddress;
    this.ownerPK = ownerPK;
    this.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/mTHA4OGRiv9h9kJgTv7u"));
    const contractSpecification = new this.web3.eth.Contract(abi);
    this.contractInstance = contractSpecification.at(address);
  }

  getAddress() {
    return this.address;
  }

  getOwnerAddress() {
    return this.ownerAddress;
  }

  getOwnerPK() {
    return this.ownerPK;
  }

  relayTransaction(transactionHash, callback) {
    this.contractInstance.relayTransaction(transactionHash, this.getOwnerAddress(), this.getAddress(), callback);
  }
}

module.exports = PocketNodeContract;
