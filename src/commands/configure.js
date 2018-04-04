var pluginManager = require('../plugin-manager');

module.exports = function(program) {
  program
    .command('configure <network> <path>')
    .action(async function (network, path, cmd) {
      console.log('Configuring ' + network + ' with file: ' + path);
      if (!network || !path) {
        console.error('Invalid configuration supplied, please try again.');
      }
      var configurationFile = require(path);
      await pluginManager.configurePlugin(network, configurationFile);
    });
}
