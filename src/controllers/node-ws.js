var PluginManager = require('../plugin-manager'),
    packageData = require('../../package.json');

module.exports.health = async function (wsMessage) {
    return {
        version: packageData.version,
        networks: await PluginManager.getNetworks()
    };
};
