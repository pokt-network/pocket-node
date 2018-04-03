var updater = require('jsonfile-updater'),
    fs = require('fs-extra'),
    path = require('path');

class ConfigFileManager {
  constructor(configFilePath) {
    this.configFilePath = path.join(process.cwd(), 'configuration/', configFilePath);
  }

  async updateProperty(key, value) {
    await this.reloadConfigFile();
    var err;
    if (this.configFile[key]) {
      err = await updater(this.configFilePath).set(key, value);
    } else {
      err = await updater(this.configFilePath).add(key, value);
    }
    if (err) {
      throw err;
    }
  }

  async deleteProperty(key) {
    await updater(this.configFilePath).delete(key);
  }

  async getProperty(key) {
    await this.reloadConfigFile();
    return this.configFile[key];
  }

  async propertyExists(key) {
    await this.reloadConfigFile();
    return this.configFile[key] ? true : false;
  }

  async reloadConfigFile() {
    try {
      this.configFile = await fs.readJson(this.configFilePath);
    } catch (err) {
      console.log('Error reloading config file: ' + this.configFilePath);
      console.error(err)
    }
  }

  async getConfigFile() {
    await this.reloadConfigFile();
    return this.configFile;
  }
}

module.exports = ConfigFileManager;
