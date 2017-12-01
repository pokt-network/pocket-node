var EthereumJsTx = require('ethereumjs-tx');

module.exports = {
  index: async function(ctx, next) {
    console.log(ctx.pktNodeConfig);
    var count = await ctx.web3.eth.getTransactionCount(ctx.pktNodeConfig['pkt_sender_account']);
    var transactions = [],
        transactionTemplate = {
          to: ctx.pktNodeConfig['pkt_receiver_account'],
          value: '0x6f05b59d3b20000',
          gasLimit: '0xC350',
          gasPrice: '0x09184e72a000'
        },
        privateKeyBuffer = new Buffer(ctx.pktNodeConfig['pkt_sender_account_pk'], 'hex');

    for (var i = 0; i < 10; i++) {
      var currentCount = count + i;
      var nonce = ctx.web3.utils.numberToHex(currentCount);
      transactionTemplate['nonce'] = nonce;
      var currentTx = new EthereumJsTx(transactionTemplate);
      currentTx.sign(privateKeyBuffer);
      transactions.push('0x' + currentTx.serialize().toString('hex'));
    }
    ctx.body = {
      transactions: transactions
    };
    await next();
  },
  web3: null,
  pktNodeConfig: null
}
