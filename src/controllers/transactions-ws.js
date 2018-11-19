const TransactionManager = require('../managers/transaction-manager');

module.exports.sendTransaction = async function (wsMessage, logger) {
    const txResponse = TransactionManager.sendTransaction(wsMessage.payload, logger);
    return txResponse;
};
