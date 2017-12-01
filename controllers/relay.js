'use strict';

const PocketNodeConfig = require('../config.json');

module.exports.relayTransaction = async function(ctx, next) {
  var relay_params = ctx.request.body,
      RelayerClass = require('pkt-relayer-' + relay_params['token'].toLowerCase()),
      transactionHash = relay_params['transaction'];
  if (RelayerClass) {
    if (!transactionHash.beginsWith("0x")) {
      transactionHash = "0x" + transactionHash;
    }
    var Relayer = new RelayerClass(relay_params['transaction']),
        transaction_hash = Relayer.relaySignedTransaction();
    ctx.body = {
      transaction_hash: transaction_hash
    }
  } else {
    throw new Error('Unsupported relayer');
  }
  await next();
};

// module.exports.createPocketRelay = async function(ctx, next) {
//   var senderAddress = ctx.body['sender_address'];
//   if (transactionHash) {
//     pocketNodeContractInstance.checkThrottle(senderAddress, {from: PocketNodeConfig['pkt_node_account'], gasLimit: PocketNodeConfig['gas_limit']}, function(error, result){
//       if (error) {
//         throw new Error('Error creating Pocket Relay record');
//       }
//     });
//   } else {
//     throw new Error('No transaction hash provided');
//   }
//   await next();
// };
