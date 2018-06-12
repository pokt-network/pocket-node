var pluginManager = require('../plugin-manager'),
    PocketNodeLogger = require('../pocket-node-logger');

module.exports = function(program) {
  program
    .command('configure <network> <path>')
    .description('Configures the specified <network> Plugin using the JSON file in <path>')
    .action(async function (network, path, cmd) {
      var logger = PocketNodeLogger.createCommandLogger();
      logger.info('Configuring ' + network + ' with file: ' + path);
      if (!network || !path) {
        logger.error('Invalid configuration supplied, please try again.');
      }
      try {
        await pluginManager.configurePlugin(network, require(path));
      } catch (e) {
        logger.error(e);
      }
    });
}
