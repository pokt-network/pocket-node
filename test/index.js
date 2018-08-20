var assert = require('assert'),
    PocketNodeServer = require('../src/server'),
    request = require('supertest'),
    packageData = require('../package.json'),
    appRootPath = require('app-root-path').toString(),
    path = require('path'),
    PluginManager = require('../src/plugin-manager');

describe('Pocket Node Server', function() {
  var pocketNodeServer = null;

  const POCKET_NODE_SERVER_PORT = 8000;

  before(function(done) {
    pocketNodeServer = new PocketNodeServer(POCKET_NODE_SERVER_PORT, null);
    pocketNodeServer.start(async function() {
      await PluginManager.registerPlugin(path.join(appRootPath) + '/test/test_plugin');
      await PluginManager.configurePlugin('TEST', {'5777': {test_config_1: "test value"}});
      done();
    });
  });

  after(async function() {
    await PluginManager.removePlugin('TEST');
    pocketNodeServer.close();
  });

  it('should listen', function() {
    assert.equal(pocketNodeServer.httpServer.listening, true);
  });

  describe('GET /node', function() {
    it('should return the node information', function() {
      return request(pocketNodeServer.httpServer)
        .get('/node')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert(response.body, {version: packageData.version, networks: []});
        });
    });
  });

  describe('POST /transactions', function() {
    it('should submit a valid transaction', function() {
      return request(pocketNodeServer.httpServer)
        .post('/transactions')
        .send({network: "TEST", subnetwork: '5777', serialized_tx: "0x000", tx_metadata: {}})
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          const expectedResponse = {
                                      network: 'TEST',
                                      subnetwork: '5777',
                                      serialized_tx: '0x000',
                                      tx_metadata: {},
                                      hash: '0x0',
                                      metadata: {},
                                      error: false,
                                      error_msg: null
                                    };
          assert.equal(response.body.network, expectedResponse.network);
          assert.equal(response.body.subnetwork, expectedResponse.subnetwork);
          assert.equal(response.body.serialized_tx, expectedResponse.serialized_tx);
          //assert.equal(response.body.tx_metadata, expectedResponse.tx_metadata);
          assert.equal(response.body.hash, expectedResponse.hash);
          //assert.equal(response.body.metadata, expectedResponse.metadata);
          assert.equal(response.body.error, expectedResponse.error);
          assert.equal(response.body.error_msg, expectedResponse.error_msg);
        });
    });

    it('should respond with 500 if the plugin is not found', function() {
      return request(pocketNodeServer.httpServer)
        .post('/transactions')
        .send({network: "BOGUS", serialized_tx: null, tx_metadata: {}})
        .set('Accept', 'application/json')
        .expect(500)
        .then(response => {
          assert(response.status, 500);
        });
    });
  });

  describe('POST /queries', function() {
    it('should execute a valid query', function() {
      return request(pocketNodeServer.httpServer)
        .post('/queries')
        .send({network: "TEST", subnetwork: '5777', serialized_tx: "0x000", tx_metadata: {}})
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          const expectedResponse = {
                                      network: 'TEST',
                                      subnetwork: '5777',
                                      result: true,
                                      decoded: false,
                                      error: false,
                                      error_msg: null
                                   };
          assert.equal(response.body.network, expectedResponse.network);
          assert.equal(response.body.subnetwork, expectedResponse.subnetwork);
          assert.equal(response.body.result, expectedResponse.result);
          assert.equal(response.body.decoded, expectedResponse.decoded);
          assert.equal(response.body.error, expectedResponse.error);
          assert.equal(response.body.error_msg, expectedResponse.error_msg);
        });
    });

    it('should respond with 500 if the plugin is not found', function() {
      return request(pocketNodeServer.httpServer)
        .post('/queries')
        .send({network: "BOGUS", serialized_tx: null, tx_metadata: {}})
        .set('Accept', 'application/json')
        .expect(500)
        .then(response => {
          assert(response.status, 500);
        });
    });
  });
});
