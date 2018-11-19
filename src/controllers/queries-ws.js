const QueryManager = require('../managers/query-manager');

module.exports.executeQuery = async function (wsMessage, logger) {
    const queryResponse = QueryManager.executeQuery(wsMessage.payload, logger);
    return queryResponse;
};
