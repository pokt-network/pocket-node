var PocketNodeConfig = require('../pocket-node-config'),
    EpochRegistryAPI = require('../contracts/epoch-registry-api'),
    PluginManager = require('../plugin-manager');

function defaultCreateResponse(relayRequest) {
  return {
    network: relayRequest.network,
    transaction: relayRequest.transaction,
    sender: null,
    success: false,
    error: 'Incorrect transaction information'
  }
}

// TODO implement this
module.exports.create = async function(ctx, next) {
  // Get request
  var relayRequest = ctx.request.body,
      plugin = await PluginManager.getPlugin(relayRequest.network.toUpperCase());

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
  const txResult = await plugin.submitTransaction(relayRequest.transaction);

  // Parse result
  if (!txResult.error) {
    // Record relay
    try {
      await EpochRegistryAPI.addRelayToCurrentEpoch(relayRequest.network.toUpperCase(), txResult.hash, relayRequest.sender, PocketNodeConfig.getNodeNonce());
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
