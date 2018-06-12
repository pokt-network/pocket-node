var pluginManager = require('../plugin-manager'),
    PocketNodeLogger = require('../pocket-node-logger');

module.exports = function(program) {
  program
    .command('list')
    .description('Lists all the installed Pocket Node Plugins')
    .action(async function (cmd) {
      var logger = PocketNodeLogger.createCommandLogger();
      logger.info('Listing plugins');
      var plugins = await pluginManager.listPlugins();
      if (plugins.length === 0) {
        logger.info('No plugins installed');
        return;
      }
      plugins.forEach(function(pluginData) {
        logger.info('Network: ' + pluginData['network'] +
                    ' Package: ' + pluginData['package_name'] +
                    ' Version: ' + pluginData['version']);
      });
    });
}
