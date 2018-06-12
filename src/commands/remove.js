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
    .description('Removes Pocket Node Plugins')
    .option('-n, --network [value]', 'Remove specific network plugin')
    .option('-a, --all', 'Remove all plugins')
    .action(async function (cmd) {
      if (cmd.all) {
        logger.info('Removing all plugins from current Pocket Node installation');
        var pluginList = await pluginManager.listPlugins();
        for (var i = 0; i < pluginList.length; i++) {
          removePlugin(pluginList[i].network);
        }
      } else {
        if (!cmd.network) {
          logger.error('Network not specified, please use the -n option.');
        } else {
          removePlugin(cmd.network);
        }
      }
    })
}
