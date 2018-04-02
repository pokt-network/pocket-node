var pluginManager = require('../plugin-manager');

module.exports = function(program) {
  program
    .command('install <plugin>')
    .action(function (plugin, cmd) {
      console.log('Installing: ' + plugin);
      pluginManager.registerPlugin(plugin, function(err) {
        console.error(err);
      });
    });
}
