var PocketNodeConfig = require('../pocket-node-config'),
    PluginManager = require('../plugin-manager');

const NETWORK_NOT_SUPPORTED_ERROR = 'Network not supported';

function defaultCreateResponse(txRequest) {
  return {
    network: txRequest.network,
    serialized_tx: txRequest.serialized_tx,
    tx_metadata: txRequest.tx_metadata,
    hash: null,
    metadata: {},
    error: true,
    error_msg: 'Invalid Transaction Request'
  }
}

function setErrorResponse(ctx, httpResponseCode, msg) {
  ctx.body.error = true;
  ctx.body.error_msg = msg;
  ctx.throw(httpResponseCode, msg);
}

module.exports.submit = async function(ctx, next) {
  // Get request
  var txRequest = ctx.request.body,
      txNetwork = txRequest.network.toUpperCase(),
      plugin = await PluginManager.getPlugin(txNetwork),
      pluginData = await PluginManager.getPluginData(txNetwork);

  // Set default response
  ctx.body = defaultCreateResponse(txRequest);

  // Check if plugin is available
  if (!plugin) {
    setErrorResponse(ctx, 500, NETWORK_NOT_SUPPORTED_ERROR);
  } else {
    // Submit transaction
    const txResponse = await plugin.submitTransaction(txRequest.serialized_tx, txRequest.tx_metadata, pluginData['configuration'] || {});

    // Parse result
    ctx.body.hash = txResponse.hash;
    ctx.body.metadata = txResponse.metadata;
    ctx.body.error = txResponse.error;

    // Error out if needed
    if (txResponse.error) {
      setErrorResponse(ctx, 400, txResponse.errorMsg);
    }
  }

  await next();
}
