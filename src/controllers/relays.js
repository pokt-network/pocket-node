var PocketNodeConfig = require('../pocket-node-config');

// TODO implement this
module.exports.create = async function(ctx, next) {
  var relayRequest = ctx.request.body;
  ctx.body = {
    network: relayRequest.network,
    transaction: relayRequest.transaction,
    success: true,
    error: null
  };
  await next();
}
