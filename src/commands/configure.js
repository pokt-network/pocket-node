var pluginManager = require('../plugin-manager'),
    PocketNodeLogger = require('../pocket-node-logger');

module.exports = function(program) {
  program
    .command('configure <network> <path>')
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
