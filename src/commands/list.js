var pluginManager = require('../plugin-manager');

module.exports = function(program) {
  program
    .command('list')
    .action(function (cmd) {
      console.log('Listing plugins');
      var plugins = pluginManager.listPlugins();
      if (plugins.length === 0) {
        console.log('No plugins installed');
        return;
      }
      plugins.forEach(function(pluginData) {
        console.log('Network: ' + pluginData['network'] +
                    ' Package: ' + pluginData['package_name'] +
                    ' Version: ' + pluginData['version']);
      });
    });
}
