// Imports
var PluginManager = require('../plugin-manager');

// Public constants
module.exports.NETWORK_NOT_SUPPORTED_ERROR = 'Network not supported';
module.exports.SUB_NETWORK_NOT_SUPPORTED_ERROR = 'Subnetwork not supported';
module.exports.INVALID_QUERY_REQUEST_ERROR = 'Invalid Query Request';

// Private constants
const QUERY_KEYS = ['query', 'decoder', 'network', 'subnetwork'];

// Private interfaces
function defaultCreateResponse(query) {
    return {
        network: query.network,
        subnetwork: query.subnetwork,
        query: query.query,
        decoder: query.decoder,
        result: null,
        decoded: false,
        error: true,
        error_msg: module.exports.INVALID_QUERY_REQUEST_ERROR
    }
}

// Public interfaces
/**
 * Executes the given query
 */
module.exports.executeQuery = async function(query, logger) {
    // Get request
    var queryResponse = defaultCreateResponse(query),
        queryNetwork = query.network.toUpperCase(),
        querySubnetwork = (query.subnetwork ? query.subnetwork.toString() : null),
        plugin = null,
        pluginData = null,
        pluginSubnetworkConfiguration = null;

    // Plugin and configuration checks
    try {
        plugin = await PluginManager.getPlugin(queryNetwork);
        pluginData = await PluginManager.getPluginData(queryNetwork);
        pluginSubnetworkConfiguration = (querySubnetwork ? pluginData.configuration[querySubnetwork] : null);
        if (!plugin) {
            throw new Error(module.exports.NETWORK_NOT_SUPPORTED_ERROR);
        }
        if (!pluginSubnetworkConfiguration) {
            throw new Error(module.exports.SUB_NETWORK_NOT_SUPPORTED_ERROR);
        }
    } catch(error) {
        if(logger) {
            logger.error(error);
        }

        // Catch non-standard error messages
        if(error.message) {
            queryResponse.error_msg = error.message;
        } else {
            queryResponse.error_msg = error.toString();
        }
        return queryResponse;
    }

    // Submit transaction
    try {
        const pluginResponse = await plugin.executeQuery(query.query, query.decoder, pluginSubnetworkConfiguration);
        // Parse result
        queryResponse.result = pluginResponse.result;
        queryResponse.decoded = pluginResponse.decoded;
        queryResponse.error = pluginResponse.error;
        queryResponse.error_msg = pluginResponse.errorMsg;
    } catch(error) {
        if (logger) {
            logger.error(error);
        }
        return defaultCreateResponse(query);
    } 

    return queryResponse;
}