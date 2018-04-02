var pluginManager = require('../plugin-manager');

module.exports = function(program) {
  program
    .command('remove <network>')
    .action(function (network, cmd) {
      console.log('Removing ' + network + ' plugin');
      pluginManager.removePlugin(network, function(err) {
        console.error(err);
      });
    })
}
