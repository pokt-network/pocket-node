var pluginManager = require('../plugin-manager');

async function removePlugin(network) {
  console.log('Removing ' + network + ' plugin');
  await pluginManager.removePlugin(network, function(err) {
    console.error(err);
  });
}

module.exports = function(program) {
  program
    .command('remove')
    .option('-n, --network [value]', 'The network you wish to remove')
    .option('-a, --all', 'Remove all plugins')
    .action(async function (cmd) {
      if (cmd.all) {
        console.log('Removing all plugins from current Pocket Node installation');
        var pluginList = await pluginManager.listPlugins();
        for (var i = 0; i < pluginList.length; i++) {
          removePlugin(pluginList[i].network);
        }
      } else {
        removePlugin(cmd.network);
      }
    })
}
