var PluginManager = require('../plugin-manager');

const NETWORK_NOT_SUPPORTED_ERROR = 'Network not supported';
const SUB_NETWORK_NOT_SUPPORTED_ERROR = 'Subnetwork not supported';

function defaultCreateResponse(queryRequest) {
  return {
    network: queryRequest.network,
    subnetwork: queryRequest.subnetwork,
    query: queryRequest.query,
    decoder: queryRequest.decoder,
    result: null,
    decoded: false,
    error: true,
    error_msg: 'Invalid Query Request'
  }
}

function setErrorResponse(ctx, httpResponseCode, msg) {
  ctx.body.error = true;
  ctx.body.error_msg = msg;
  ctx.throw(httpResponseCode, msg);
}

module.exports.submit = async function(ctx, next) {
  // Get request
  var queryRequest = ctx.request.body,
      queryNetwork = queryRequest.network.toUpperCase(),
      querySubnetwork = (queryRequest.subnetwork ? queryRequest.subnetwork.toString() : null),
      plugin = await PluginManager.getPlugin(queryNetwork),
      pluginData = await PluginManager.getPluginData(queryNetwork),
      pluginSubnetworkConfiguration = (querySubnetwork ? pluginData.configuration[querySubnetwork] : null);

  // Set default response
  ctx.body = defaultCreateResponse(queryRequest);

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
  const queryResponse = await plugin.executeQuery(queryRequest.query, queryRequest.decoder, pluginSubnetworkConfiguration);

  // Parse result
  ctx.body.result = queryResponse.result;
  ctx.body.decoded = queryResponse.decoded;
  ctx.body.error = queryResponse.error;
  ctx.body.error_msg = queryResponse.errorMsg;

  // Error out if needed
  if (queryResponse.error) {
    setErrorResponse(ctx, 400, ctx.body.error_msg);
  }

  await next();
}
