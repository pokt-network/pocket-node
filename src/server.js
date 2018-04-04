const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
const NodeController = require('./controllers/node');
const RelaysController = require('./controllers/relays');
const KoaLogger = require('koa-logger');

class PocketNodeServer {
  constructor(port) {
    // Load web server
    this.webServer = new Koa();
    this.webRouter = new Router();
    this.webServer.use(KoaBody());
    // Start the node
    this.start(port);
  }

  start(port){
    // Configure routes and allowed methods for those routers
    this.setupControllers();
    this.webServer.use(this.webRouter.routes());
    this.webServer.use(this.webRouter.allowedMethods());
    this.webServer.use(KoaLogger());

    // Start the webserver
    this.webServer.listen(port, function(){
      console.log("Pocket Node started on port:%d", this.address().port);
    });
  }

  setupControllers(){
    // Setup the /node route
    this.webRouter.get('/node', NodeController.index);

    // Setup the /relays route
    this.webRouter.post('/relays', RelaysController.create);
  }
}

module.exports = PocketNodeServer;
