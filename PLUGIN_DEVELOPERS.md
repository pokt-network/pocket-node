# Pocket Node Plugin System

## What is a Pocket Node Plugin (PNP)?
The Pocket Node Plugin System allows the Pocket Node app to support any decentralized network as a Relay Node in the Pocket Network.

Each plugin can be created independently and supported individually as a NPM package, and each node can pick and choose whichever plugins they wanna use to support on their network.

For example, if you wanted to add Ethereum support for your node, you can use our [Pocket Node Ethereum Plugin](https://github.com/pokt-network/pnp-eth)

## Creating your own Pocket Node Plugin
A Pocket Node Plugin has 4 parts: A configuration object, a plugin definition function, a transaction submission function, a query execution function.

### Plugin definition
Each plugin must implement the following function so the Pocket Node app can get the plugin definition:

`function getPluginDefinition()`

The return value for this must be an object containing the following information:

```
{
  network: <Network code: BTC, ETH, LTC>,
  version: <Plugin version>,
  package_name: <Name of the NPM package>
}
```

### Configuration object
Every plugin will have to show their users how to configure said plugin, so they will have to define a JSON Object which users will use in a JSON file and pass said file as an argument when calling the `pocket-node configure <network token ID (ETH, BTC, etc.)> /path/to/configuration.json` command.

Because each network can have multiple subnetworks (mainnet, testnet, etc.), every subnetwork configuration needs to be actually specified. The subnetwork configuration will be passed as the `opts` parameter to each of the functions defined below.

```
{
  subnetwork_id_1: {
    property_1: "value"
  },
  subnetwork_id_2: {
    property_1: "value"
  }
}
```

### Transaction submission
To submit a transaction, the plugin needs to implement the following function:, where the `serializedTx` is a `string` containing the serialized transaction for whichever network the plugin is submitting it to. The `txMetadata` param is an `Object` which the plugin can define to support the submission of the `serializedTx` being sent and `opts` is the subnetwork configuration object defined by the plugin on it's configuration file:

`function submitTransaction(serializedTx, txMetadata, opts)`

The return for this function must be a `Promise` with the following parameter in it's callback:

```
{
  hash: 'transaction_hash',
  metadata: {<metadata object regarding submission>},
  error: true|false|falsey,
  errorMsg: 'Error Message'|null
}
```

The `error` attribute indicates wheter or not there was an error during submission and the `errorMsg` param indicates what the error was.

### Query execution
To execute a query to retrieve information from the network, the `query` parameter must be an `Object` with the given query parameters, the `decodeOpts` must be an `Object` with information regarding the response of the query which is particularly useful for networks with Smart Contract platforms, so the client can submit the expected return types and these can be decoded by the Pocket Node for example. The `opts` is the subnetwork configuration object defined by the plugin on it's configuration file.

`function executeQuery(query, decodeOpts, opts)`

The return for this function must be a `Promise` with the following parameter in it's callback:

```
{
  result: {Object containing result}|[Array containing multiple results]|'String value'|Numeric Value,
  decoded: true|false,
  error: true|false|falsey,
  errorMsg: 'Error Message'|null
}
```

The `result` attribute returns the data in it's raw format, this can deeply vary depending on the request being made. The `decoded` attribute indicates whether or not the response was properly decoded or if it's still on it's raw format. The `error` attribute indicates wheter or not there was an error during submission and the `errorMsg` param indicates what the error was.
