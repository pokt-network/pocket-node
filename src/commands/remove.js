var pluginManager = require('../plugin-manager');

module.exports = function(program) {
  program
    .command('remove <network>')
    .action(async function (network, cmd) {
      console.log('Removing ' + network + ' plugin');
      await pluginManager.removePlugin(network, function(err) {
        console.error(err);
      });
    })
}
