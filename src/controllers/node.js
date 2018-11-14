var PluginManager = require('../plugin-manager'),
    packageData = require('../../package.json');

module.exports.health = async function(ctx, next) {
  ctx.body = {
    version: packageData.version,
    networks: await PluginManager.getNetworks()
  };
  await next();
};
