// Server imports
const Koa = require('koa'),
      Router = require('koa-router'),
      KoaBody = require('koa-body'),
      NodeController = require('./controllers/node'),
      QueriesController = require('./controllers/queries'),
      TransactionsController = require('./controllers/transactions'),
      PocketNodeLogger = require('./pocket-node-logger'),
      http = require('http'),
      cors = require('@koa/cors');;

// Request middlewares
const injectPocketNodeServer = function(server) {
  return async function(ctx, next) {
    ctx.pocketNodeServer = server;
    await next();
  }
};
const logPocketNodeRequest = async function(ctx, next) {
  ctx.pocketNodeServer.logger.info(`[${ctx.response.status}] ${ctx.request.method} - ${ctx.request.url} ${Object.keys({}).length !== 0 ? ('- ' + ctx.request.body) : ''}`);
  next();
}

class PocketNodeServer {

  constructor(port, logFilePath, enableCors) {
    // Load web server
    this.port = port;
    this.logFilePath = logFilePath;
    this.logger = PocketNodeLogger.createServerLogger(logFilePath);
    this.webServer = new Koa();
    this.webRouter = new Router();
    this.webServer.use(KoaBody());
    if(enableCors === true) {
      this.webServer.use(cors());
    }
  }

  start(callback) {
    // Server reference
    var server = this;

    // Configure routes and allowed methods for those routers
    this.webServer.use(injectPocketNodeServer(this));
    this.setupControllers();
    this.webServer.use(this.webRouter.routes());
    this.webServer.use(this.webRouter.allowedMethods());
    this.webServer.use(logPocketNodeRequest);

    // Start the webserver
    this.httpServer = http.createServer(this.webServer.callback())
                          .listen(this.port, function(){
      if (callback) {
        callback();
      }
    });
  }

  setupControllers() {
    // Setup the /node route
    this.webRouter.get('/node', NodeController.index);

    // Setup the /queries route
    this.webRouter.post('/queries', QueriesController.submit);

    // Setup the /transactions route
    this.webRouter.post('/transactions', TransactionsController.submit);
  }

  close() {
    if (this.httpServer) {
      this.httpServer.close();
    }
  }
}

module.exports = PocketNodeServer;
