var PluginManager = require('../plugin-manager');

const NETWORK_NOT_SUPPORTED_ERROR = 'Network not supported';

function defaultCreateResponse(queryRequest) {
  return {
    network: queryRequest.network,
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
      plugin = await PluginManager.getPlugin(queryNetwork),
      pluginData = await PluginManager.getPluginData(queryNetwork);

  // Set default response
  ctx.body = defaultCreateResponse(queryRequest);

  // Check if plugin is available
  if (!plugin) {
    setErrorResponse(ctx, 500, NETWORK_NOT_SUPPORTED_ERROR);
  } else {
    // Submit transaction
    const queryResponse = await plugin.executeQuery(queryRequest.query, queryRequest.decoder, pluginData['configuration'] || {});

    // Parse result
    ctx.body.result = queryResponse.result;
    ctx.body.decoded = queryResponse.decoded;
    ctx.body.error = queryResponse.error;
    ctx.body.error_msg = queryResponse.errorMsg;

    // Error out if needed
    if (queryResponse.error) {
      setErrorResponse(ctx, 400, ctx.body.error_msg);
    }
  }

  await next();
}
