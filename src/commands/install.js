var pluginManager = require('../plugin-manager'),
    PocketNodeLogger = require('../pocket-node-logger');

module.exports = function(program) {
  program
    .command('install [plugins...]')
    .description('Installs the specified Pocket Node Plugins from NPM')
    .action(async function (plugins) {
      if(plugins && plugins.length > 0) {
        var logger = PocketNodeLogger.createCommandLogger();
        for (let i = 0; i < plugins.length; i++) {
          const plugin = plugins[i];
          logger.info('Installing: ' + plugin);
          try {
            await pluginManager.registerPlugin(plugin);   
          } catch(error) {
            logger.error(error);
          }
        }
      }
    });
}
