var updater = require('jsonfile-updater');

class ConfigFileManager {
  constructor(configFilePath) {
    this.configFilePath = configFilePath;
    this.configFile = require(configFilePath);
  }

  updateProperty(key, value) {
    updater(this.configFilePath).update(key, value, this.throwError);
  }

  deleteProperty(key) {
    updater(this.configFilePath).delete(key, this.throwError);
  }

  getProperty(key) {
    this.reloadConfigFile();
    return this.configFile[key];
  }

  propertyExists(key) {
    this.reloadConfigFile();
    return this.configFile[key] ? true : false;
  }

  reloadConfigFile() {
    this.configFile = require(this.configFilePath);
  }

  throwError(err) {
    if (err) {
      throw err;
    }
  }

  getConfigFile() {
    this.reloadConfigFile();
    return this.configFile;
  }
}

module.exports = ConfigFileManager;
