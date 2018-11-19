// Server imports
const Koa = require('koa'),
      Router = require('koa-router'),
      KoaBody = require('koa-body'),
      NodeController = require('./controllers/node'),
      QueriesController = require('./controllers/queries'),
      TransactionsController = require('./controllers/transactions'),
      PocketNodeLogger = require('./pocket-node-logger'),
      http = require('http'),
      cors = require('@koa/cors'),
      KoaWebSocket = require('koa-websocket'),
      WebSocketDispatcher = require('./dispatchers/web-socket-dispatcher'),
      WSNodeController = require('./controllers/node-ws'),
      WSQueriesController = require('./controllers/queries-ws'),
      WSTransactionsController = require('./controllers/transactions-ws');

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

// Literal constants
HEALTH_ROUTE = '/health';
QUERIES_ROUTE = '/queries';
TRANSACTIONS_ROUTE = '/transactions';

class PocketNodeServer {

  constructor(port, logFilePath, enableCors, enableWS, enableHTTP) {
    this.enableCors = enableCors;
    this.enableWS = enableWS;
    this.enableHTTP = enableHTTP;
    this.port = port;
    this.logFilePath = logFilePath;
    this.logger = PocketNodeLogger.createServerLogger(logFilePath);
    this.webServer = KoaWebSocket(new Koa());
    this.configureHTTP();
    this.configureWS();
  }

  configureHTTP() {
    if(this.enableHTTP !== true) {
      return;
    }

    this.webRouter = new Router();
    this.webServer.use(KoaBody());
    if (this.enableCors === true) {
      this.webServer.use(cors());
    }
    this.webServer.use(injectPocketNodeServer(this));
    this.webRouter.get(HEALTH_ROUTE, NodeController.health);
    this.webRouter.post(QUERIES_ROUTE, QueriesController.submit);
    this.webRouter.post(TRANSACTIONS_ROUTE, TransactionsController.submit);
    this.webServer.use(this.webRouter.routes());
    this.webServer.use(this.webRouter.allowedMethods());
    this.webServer.use(logPocketNodeRequest);
    this.httpServer = http.createServer(this.webServer.callback());
  }

  configureWS() {
    if(this.enableWS !== true) {
      return;
    }

    // Create websocket dispatcher
    this.websocketDispatcher = new WebSocketDispatcher(this.getWebSocketRouteMappings(), this.logger);

    // Inject server instance
    this.webServer.ws.use(injectPocketNodeServer(this));

    // Add websocket dispatcher middleware
    this.webServer.ws.use(this.websocketDispatcher.middleware);
  }

  getWebSocketRouteMappings() {
    var mappings = {}
    mappings[HEALTH_ROUTE] = WSNodeController.health;
    mappings[QUERIES_ROUTE] = WSQueriesController.executeQuery;
    mappings[TRANSACTIONS_ROUTE] = WSTransactionsController.sendTransaction;
    return mappings;
  }

  start(callback) {
    this.webServer.listen(this.port);
    callback();
  }

  close() {
    if (this.httpServer) {
      this.httpServer.close();
    }
  }
}

module.exports = PocketNodeServer;
