var packageData = require('./package.json');

module.exports.getPluginDefinition = function() {
  return {
    network: 'TEST',
    version: packageData.version,
    package_name: packageData.name
  }
}

module.exports.submitTransaction = async function(serializedTx, txMetadata, opts) {
  // var parsedOpts = parseOpts(opts),
  //     ethNode = parsedOpts.ethNode,
  //     networkId = parsedOpts.networkId,
  //     web3 = new Web3(new Web3.providers.HttpProvider(ethNode)),
  //     serializedTx = serializedTx.startsWith('0x') ? serializedTx : ('0x' + serializedTx),
  //     txHash = null,
  //     error = false,
  //     errorMsg = null;
  //
  // try {
  //   txHash = await web3.eth.sendRawTransaction(serializedTx);
  // } catch (e) {
  //   console.error(e);
  //   txHash = null;
  //   error = true;
  //   errorMsg = e;
  // }
  //
  // return {
  //   hash: txHash,
  //   metadata: {},
  //   error: error,
  //   errorMsg: errorMsg
  // };
  return {
    hash: '0x0',
    metadata: {},
    error: false,
    errorMsg: null
  };
}

module.exports.executeQuery = async function(query, decodeOpts, opts) {
  // var parsedOpts = parseOpts(opts),
  //     ethNode = parsedOpts.ethNode,
  //     networkId = parsedOpts.networkId,
  //     web3 = new Web3(new Web3.providers.HttpProvider(ethNode)),
  //     result = null,
  //     decoded = false,
  //     error = false,
  //     errorMsg = null,
  //     rpcResponse = {};
  //
  // if (typeof query !== 'object') {
  //   error = true;
  //   errorMsg = 'Invalid query, must be an Object';
  // } else {
  //   try {
  //     rpcResponse = web3.currentProvider.send({
  //       jsonrpc: '2.0',
  //       method: query.rpc_method,
  //       params: query.rpc_params
  //     });
  //     if (rpcResponse.error) {
  //       result = null;
  //       error = true;
  //       errorMsg = rpcResponse.error.message;
  //     } else {
  //       result = rpcResponse.result;
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     result = null;
  //     error = true;
  //     errorMsg = e;
  //   }
  //
  //   if (query.rpc_method === 'eth_call' && rpcResponse && decodeOpts && Array.isArray(decodeOpts.return_types)) {
  //     try {
  //       result = ethAbiDecoder.rawDecode(decodeOpts.return_types, [rpcResponse.result]);
  //       decoded = true;
  //     } catch (e) {
  //       console.error(e);
  //       decoded = false;
  //     }
  //   }
  // }
  //
  // return {
  //   result: result || null,
  //   decoded: decoded,
  //   error: error,
  //   errorMsg: errorMsg
  // };
  return {
    result: true,
    decoded: false,
    error: false,
    errorMsg: null
  };
}
