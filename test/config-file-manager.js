const ConfigFileManager = require('../src/config-file-manager'),
      fs = require('fs-extra'),
      assert = require('assert');

describe('ConfigFileManager', function () {

    describe('non existent config file', function() {
        var configFileManager = null;

        it('should create an empty configuration file if not exists', async function () {
            configFileManager = new ConfigFileManager('test.json');
            var configFileObj = await configFileManager.getConfigFile();
            assert(configFileObj, {});
        });

        // Clean up any test config
        after(async function () {
            try {
                await fs.remove(configFileManager.configFilePath);
            } catch(error) {
                console.error(error);
            }
        });
    });
});