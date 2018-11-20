// Imports
const QueryManager = require('../managers/query-manager');

// Constants
const UNKNOWN_ERROR_QUERY = 'Unknown error executing query';

function setErrorResponse(ctx, httpResponseCode, errorBody) {
  ctx.body = Object.assign({}, ctx.request.body, errorBody);
  ctx.status = httpResponseCode;
}

module.exports.executeQuery = async function (ctx, next) {
  const query = ctx.request.body,
        logger = ctx.pocketNodeServer.logger;

  // Set the response body
  try {
    const queryResponse = await QueryManager.executeQuery(query, logger);
    if (queryResponse.error === true) {
      setErrorResponse(ctx, 400, queryResponse);
    } else {
      ctx.body = queryResponse;
    }
  } catch(error) {
    setErrorResponse(ctx, 500, {
      error: true,
      error_msg: UNKNOWN_ERROR_QUERY
    });
  }

  await next();
};