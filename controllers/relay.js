'use strict';

module.exports.add = async function(ctx, next) {
  var relay_params = ctx.request.body,
      RelayerClass = require('pkt-relayer-' + relay_params['token'].toLowerCase());
  if (RelayerClass) {
    var Relayer = new RelayerClass(relay_params['transaction']),
        transaction_hash = Relayer.relay_signed_transaction();
    ctx.body = {
      transaction_hash: transaction_hash
    }
  }
  await next();
};
