'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
const TransactionsController = require('./controllers/transactions');
const RelayController = require('./controllers/relay');
const PocketNodeConfig = require('./config.json');
const app = new Koa();
const router = new Router();
const Web3 = require('web3');

// Create web3 client and add account to wallet
var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/mTHA4OGRiv9h9kJgTv7u'));
web3.eth.accounts.wallet.add(PocketNodeConfig['pkt_sender_account_pk']);

// App configuration
app.use(KoaBody());

// Routes configuration
router.get('/transactions', async function(ctx, next){
  ctx.web3 = web3;
  ctx.pktNodeConfig = PocketNodeConfig;
  await next();
}, TransactionsController.index);
router.post('/relay', RelayController.relayTransaction);

// More App configuration
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PocketNodeConfig['port']);
console.log('listening on port 3000');
