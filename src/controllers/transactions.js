// Imports
const TransactionManager = require('../managers/transaction-manager');

// Constants
const UNKNOWN_ERROR_TRANSACTION = 'Unknown error sending transaction';

function setErrorResponse(ctx, httpResponseCode, errorBody) {
  ctx.body = Object.assign({}, ctx.request.body, errorBody);
  ctx.status = httpResponseCode;
}

module.exports.sendTransaction = async function (ctx, next) {
  const transaction = ctx.request.body,
        logger = ctx.pocketNodeServer.logger;

  // Set the response body
  try {
    const txResponse = await TransactionManager.sendTransaction(transaction, logger);
    if (txResponse.error === true) {
      setErrorResponse(ctx, 400, txResponse);
    } else {
      ctx.body = txResponse;
    }
  } catch (error) {
    setErrorResponse(ctx, 500, {
      error: true,
      error_msg: UNKNOWN_ERROR_TRANSACTION
    });
  }

  await next();
};
