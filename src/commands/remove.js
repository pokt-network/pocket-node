var pluginManager = require('../plugin-manager'),
    PocketNodeLogger = require('../pocket-node-logger'),
    logger = PocketNodeLogger.createCommandLogger();

async function removePlugin(network) {
  logger.info('Removing ' + network + ' plugin');
  await pluginManager.removePlugin(network, function(err) {
    if (err) {
      logger.error(err);
    }
  });
}

module.exports = function(program) {
  program
    .command('remove')
    .option('-n, --network [value]', 'The network you wish to remove')
    .option('-a, --all', 'Remove all plugins')
    .action(async function (cmd) {
      if (cmd.all) {
        logger.info('Removing all plugins from current Pocket Node installation');
        var pluginList = await pluginManager.listPlugins();
        for (var i = 0; i < pluginList.length; i++) {
          removePlugin(pluginList[i].network);
        }
      } else {
        removePlugin(cmd.network);
      }
    })
}
