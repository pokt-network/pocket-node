'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
const HomeController = require('./controllers/home');
const RelayController = require('./controllers/relay');

const app = new Koa();
const router = new Router();

// App configuration
app.use(KoaBody());

// Routes configuration
router.get('/', HomeController.index);
router.post('/relay', RelayController.add);

app.use(router.routes());
app.use(router.allowedMethods());

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}
