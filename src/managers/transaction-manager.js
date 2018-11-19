// Imports
var PluginManager = require('../plugin-manager');

// Public constants
module.exports.NETWORK_NOT_SUPPORTED_ERROR = 'Network not supported';
module.exports.SUB_NETWORK_NOT_SUPPORTED_ERROR = 'Subnetwork not supported';
module.exports.INVALID_TX_REQUEST_ERROR = 'Invalid Transaction Request';

// Private interfaces
function defaultCreateResponse(transaction) {
    return {
        network: transaction.network,
        subnetwork: transaction.subnetwork,
        serialized_tx: transaction.serialized_tx,
        tx_metadata: transaction.tx_metadata,
        hash: null,
        metadata: {},
        error: true,
        error_msg: module.exports.INVALID_TX_REQUEST_ERROR
    }
}

// Public interfaces
/**
 * Sends the given transaction
 */
module.exports.sendTransaction = async function (transaction, logger) {
    // Get request
    var txResponse = defaultCreateResponse(transaction),
        txNetwork = transaction.network.toUpperCase(),
        txSubNetwork = (transaction.subnetwork ? transaction.subnetwork.toString() : null),
        plugin = null,
        pluginData = null,
        pluginSubnetworkConfiguration = null;

    // Plugin and configuration checks
    try {
        plugin = await PluginManager.getPlugin(txNetwork);
        pluginData = await PluginManager.getPluginData(txNetwork);
        pluginSubnetworkConfiguration = (txSubNetwork ? pluginData.configuration[txSubNetwork] : null);
        if (!plugin) {
            throw new Error(module.exports.NETWORK_NOT_SUPPORTED_ERROR);
        }
        if (!pluginSubnetworkConfiguration) {
            throw new Error(module.exports.SUB_NETWORK_NOT_SUPPORTED_ERROR);
        }
    } catch (error) {
        if (logger) {
            logger.error(error);
        }

        // Catch non-standard error messages
        if (error.message) {
            txResponse.error_msg = error.message;
        } else {
            txResponse.error_msg = error.toString();
        }
        return txResponse;
    }

    // Submit transaction
    try {
        const pluginResponse = await plugin.submitTransaction(transaction.serialized_tx, transaction.tx_metadata, pluginSubnetworkConfiguration);
        // Parse result
        txResponse.hash = pluginResponse.hash;
        txResponse.metadata = pluginResponse.metadata;
        txResponse.error = pluginResponse.error;
        txResponse.error_msg = pluginResponse.errorMsg;
    } catch (error) {
        if (logger) {
            logger.error(error);
        }
        return defaultCreateResponse(transaction);
    }

    return txResponse;
}