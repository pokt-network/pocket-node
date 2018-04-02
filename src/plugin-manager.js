var ConfigFileManager = require('./config-file-manager'),
    fileManager = new ConfigFileManager('../configuration/plugins.json'),
    npm = require('npm-programmatic');

// Returns the plugin data object
module.exports.getPluginData = function(network) {
  var pluginData = fileManager.getProperty(network.toUpperCase());
  return pluginData || throw 'Plugin not found for network: ' + network;
}

// Returns the actual plugin module
module.exports.getPlugin = function(network) {
  return require(this.getPluginData(network.toUpperCase())['package_name']);
}

// Returns wheter or not a plugin for this network exists
module.exports.pluginInstalled = function(network) {
  return fileManager.propertyExists(network.toUpperCase());
}

// Registers a plugin
module.exports.registerPlugin = function(packageName, errorCb) {
  npm
    .install(packageName, {
      cwd:'.',
      save:true
    })
    .then(function() {
      var plugin = require(packageName),
          pluginDefinition = plugin.getPluginDefinition();
      pluginDefinition['configuration'] = {};
      fileManager.updateProperty(pluginDefinition.network, pluginDefinition);
      console.log(packageName + ' plugin installed succesfully');
    })
    .catch(errorCb);
}

// Removes a plugin
module.exports.removePlugin = function(network, errorCb) {
  var pluginData = this.getPluginData(network);
  npm
    .uninstall(pluginData['package_name'])
    .then(function() {
      fileManager.deleteProperty(pluginData['network']);
      console.log(pluginData['package_name'] + ' plugin deleted succesfully');
    })
    .catch(errorCb);
}

// Return all plugins (with their configurations)
module.exports.listPlugins = function() {
  return Object.values(fileManager.getConfigFile());
}

// Setup configuration object for plugin
module.exports.configurePlugin = function(network, configuration) {
  var pluginData = this.getPluginData(network);

  // Avoid plugin definition overwrites
  delete configuration['network'];
  delete configuration['version'];
  delete configuration['package_name'];

  // Update configuration
  pluginData['configuration'] = configuration;
  fileManager.updateProperty(network, pluginData);
  console.log('Configuration set for plugin: ' + pluginData['package_name'] + ' with network: ' + pluginData['network']);
}
