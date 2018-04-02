var PocketNodeConfig = require('../pocket-node-config'),
    packageData = require('../../package.json');

module.exports.index = async function(ctx, next) {
  ctx.body = {
    version: packageData.version,
    networks: PocketNodeConfig.getSupportedNetworks()
  };
  await next();
};
