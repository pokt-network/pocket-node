var PocketNodeConfig = require('../pocket-node-config'),
    getEpochRegistryAPI = require('../contracts/epoch-registry-api'),
    PluginManager = require('../plugin-manager'),
    epochRegistry = null;

function defaultCreateResponse(relayRequest) {
  return {
    network: relayRequest.network,
    transaction: relayRequest.transaction,
    sender: null,
    success: false,
    error: 'Incorrect transaction information'
  }
}

module.exports.create = async function(ctx, next) {
  // Get request
  var relayRequest = ctx.request.body,
      plugin = await PluginManager.getPlugin(relayRequest.network.toUpperCase()),
      pluginData = await PluginManager.getPluginData(relayRequest.network.toUpperCase());

  // Set default response
  ctx.body = defaultCreateResponse(relayRequest);

  // Check if plugin is available
  if (!plugin) {
    ctx.body = {
      error: "Network not supported"
    }
    ctx.throw(500, 'Plugin not found');
  }

  // Submit transaction
  const txResult = await plugin.submitTransaction(relayRequest.transaction, pluginData['configuration'] || {});

  // Parse result
  if (!txResult.error) {
    // Record relay
    try {
      var epochRegistry = epochRegistry ? epochRegistry : await getEpochRegistryAPI(),
          nodeNonce = await PocketNodeConfig.getNodeNonce();
      await epochRegistry.addRelayToCurrentEpoch(relayRequest.network.toUpperCase(), txResult.hash, relayRequest.sender, nodeNonce, {gas: 1000000});
    } catch(error) {
      console.error("Error recording relay into the blockchain: " + error);
    }

    // Set response
    ctx.body.sender = relayRequest.sender;
    ctx.body.success = true;
    ctx.body.error = null;
  } else {
    ctx.body.sender = null;
    ctx.body.error = 'Incorrect transaction information';
    ctx.body.success = false;
    ctx.throw(400);
  }

  await next();
}
