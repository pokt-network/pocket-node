var PluginManager = require('../plugin-manager');

const NETWORK_NOT_SUPPORTED_ERROR = 'Network not supported';
const SUB_NETWORK_NOT_SUPPORTED_ERROR = 'Subnetwork not supported';

function defaultCreateResponse(txRequest) {
  return {
    network: txRequest.network,
    subnetwork: txRequest.subnetwork,
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
      txSubNetwork = (txRequest.subnetwork ? txRequest.subnetwork.toString() : null),
      plugin = await PluginManager.getPlugin(txNetwork),
      pluginData = await PluginManager.getPluginData(txNetwork),
      pluginSubnetworkConfiguration = (txSubNetwork ? pluginData.configuration[txSubNetwork] : null);

  // Set default response
  ctx.body = defaultCreateResponse(txRequest);

  // Plugin and configuration checks
  if (!plugin) {
    setErrorResponse(ctx, 500, NETWORK_NOT_SUPPORTED_ERROR);
    await next();
    return
  }

  if (!pluginSubnetworkConfiguration) {
    setErrorResponse(ctx, 500, SUB_NETWORK_NOT_SUPPORTED_ERROR);
    await next();
    return
  }

  // Submit transaction
  const txResponse = await plugin.submitTransaction(txRequest.serialized_tx, txRequest.tx_metadata, pluginSubnetworkConfiguration);

  // Parse result
  ctx.body.hash = txResponse.hash;
  ctx.body.metadata = txResponse.metadata;
  ctx.body.error = txResponse.error;
  ctx.body.error_msg = txResponse.errorMsg

  // Error out if needed
  if (txResponse.error) {
    setErrorResponse(ctx, 400, txResponse.errorMsg);
  }

  await next();
}
