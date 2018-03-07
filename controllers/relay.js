'use strict';

const PocketTokenABI = require('../pkt_token_abi.json');
const PocketNodeABI = require('../pkt_node_abi.json');

function epochTxCountPromise(tokenContractInstance, nodeConfig){
  return tokenContractInstance.methods.epochTransactionCount(nodeConfig['pkt_sender_account']).call();
}

async function canRelay(nodeConfig, web3){
  var tokenContractInstance = new web3.eth.Contract(PocketTokenABI, '0x88e5238bd00ab4fd6f2dc1957e082dc82b1b5120');
  var epochTxCount = await epochTxCountPromise(tokenContractInstance, nodeConfig);
  var result = epochTxCount < 2 ? true : false;
  return true;
}

async function resetThrottle(web3, nodeConfig){
  //var pocketNodeContractInstance = new web3.eth.Contract(PocketNodeABI, '0xae6d8d0961d5393653ea2deb617b2317fad4ee37');
  //pocketNodeContractInstance.methods.checkThrottle(nodeConfig['pkt_sender_account']).send({from: nodeConfig['pkt_sender_account'], gasLimit: '0x1e8480', gasPrice: '0x09184e72a000'});
  var contract = new web3.eth.Contract(PocketNodeABI, '0xae6d8d0961d5393653ea2deb617b2317fad4ee37');
  var CryptoJS = require('crypto-js');
  var privateKey = new Buffer(nodeConfig['pkt_sender_account_pk'], 'hex');
  var Tx = require('ethereumjs-tx');

  var functionName = 'checkThrottle';
  var types = ['address'];
  var args = [nodeConfig['pkt_sender_account']];
  var fullName = functionName + '(' + types.join() + ')';
  var signature = CryptoJS.SHA3(fullName,{outputLength:256}).toString(CryptoJS.enc.Hex).slice(0, 8);
  var dataHex = signature + web3.eth.abi.encodeParameters(types, args);
  var data = '0x'+dataHex;

  var transactionCount = await web3.eth.getTransactionCount(nodeConfig['pkt_sender_account']);
  var nonce = web3.utils.numberToHex(transactionCount);
  var gasPrice = '0x09184e72a000';
  var gasLimitHex = web3.utils.numberToHex(2000000);
  var rawTx = { 'nonce': nonce, 'gasPrice': gasPrice, 'gasLimit': gasLimitHex, 'from': nodeConfig['pkt_sender_account'], 'to': '0xae6d8d0961d5393653ea2deb617b2317fad4ee37', 'data': data};
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = '0x'+tx.serialize().toString('hex');
  web3.eth.sendSignedTransaction(serializedTx, function(err, txHash){ console.log(err, txHash) });
}

function errorAndExit(message, web3, nodeConfig){
  resetThrottle(web3, nodeConfig);
  throw new Error(message);
}

module.exports.relayTransaction = async function(ctx, next) {
  var relay_params = ctx.request.body,
      RelayerClass = require('pkt-relayer-' + relay_params['token'].toLowerCase());
  if (RelayerClass) {
    var isRelayable = await canRelay(ctx.pktNodeConfig, ctx.web3);
    if (isRelayable) {
      var Relayer = new RelayerClass(relay_params['transaction']),
          transaction_hash = Relayer.relaySignedTransaction();
      ctx.body = {
        transaction_hash: transaction_hash
      }
      resetThrottle(ctx.web3, ctx.pktNodeConfig);
    } else {
      errorAndExit('Max transaction capacity reached', ctx.web3, ctx.pktNodeConfig);
    }
  } else {
    errorAndExit('Unsupported relayer', ctx.web3);
  }
  await next();
};
