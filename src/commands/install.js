var pluginManager = require('../plugin-manager'),
    PocketNodeLogger = require('../pocket-node-logger');

module.exports = function(program) {
  program
    .command('install <plugin>')
    .description('Installs the specified Pocket Node Plugin from NPM')
    .action(function (plugin, cmd) {
      var logger = PocketNodeLogger.createCommandLogger();
      logger.info('Installing: ' + plugin);
      pluginManager.registerPlugin(plugin, function(err) {
        if (err) {
          logger.error(err);
        }
      });
    });
}
