# pocket-node
A Pocket Network client for Pocket Nodes, which are the actors within the Pocket Network that execute the Relays.

## Node registration
To register your node in the Pocket Network you can go to [https://dashboard.pokt.network](https://dashboard.pokt.network) and register your node, there you will be assigned a Node Nonce which you will use for configuration in a later step.

## Installation
You can install using `npm`:

`npm install -g pocket-node`

## Node setup
The first thing you need to do is configure your Node, by using the following command:

`pocket-node setup`

For an example of how to configure your node in the Rinkeby Testnet, you can use the following configuration:

* `Ethereum Node` You can use a GETH instance you're running locally (http://localhost:8545).
* `Ethereum Network ID` For Rinkeby you must use **4**
* `EpochRegistryAPI address` The address of the contract which records the transactions your node will relay into the blockchain. For Rinkeby this address is: `0x4cdaf013049eebf5891b389b0fc638386253d9aa`
* `Ethereum account address` The Ethereum account you used to register your node in the previous step.
* `Node Nonce` The Nonce for your Node, you can get it from [https://dashboard.pokt.network](https://dashboard.pokt.network)

## Running the server
To start the server, just run:

`pocket-node start -p [port number]`

But before you can start relaying transactions, read below on how to install the different plugins which will allow your Node to connect to the different blockchains (ETH, BTC, LTC, etc.).

## What is a Pocket Node Plugin?
The Pocket Node Plugin System allows the Pocket Node app to support any decentralized network as a Relay Node in the Pocket Network.

Each plugin can be created independently and supported individually as a NPM package, and each node can pick and choose whichever plugins they wanna use to support on their network.

For example, if you wanted to add Ethereum support for your node, you can use our [Pocket Node Ethereum Plugin](https://github.com/pokt-network/pnp-eth)

## Installing a Pocket Node Plugin
To install a plugin from NPM just run the following command:

`pocket-node install <npm package name>`

As simple as that and your Pocket Node will support the network described by this plugin.

***Note***: Please note that if you install multiple plugins for the same network, only the latest one you installed will be used, the older ones will be uninstalled.

## Listing your Pocket Node Plugins
To see which plugins you have installed just run the following command:

`pocket-node list`

## Configuring your Pocket Node Plugins
Each Plugin requires a configuration file which is a JSON object with all the pre-determined configurations.

`pocket-node configure <network> /path/to/configuration.json`

## Removing a Pocket Node Plugin
To remove a specific plugin just run the following command:

`pocket-node remove <network>`

***Note***: In case you have multiple plugins with the same name, all will be removed.

## Creating your own Pocket Node Plugin
A Pocket Node Plugin has 4 parts: An options object, a plugin definition function, a transaction submission function and a transaction verification function.

### Options object
Every plugin will have to show their users how to configure said plugin, so they will have to define a JSON Object which users will store in a JSON file and pass said file as an argument when calling the `pocket-node configure <plugin name> /path/to/configuration.json` command.

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

### Transaction submission
To submit a transaction, the plugin needs to implement the following function, where the `serializedTx` is a string containing the serialized transaction for whichever network the plugin is submitting it to and `opts` is the options object defined by the plugin on it's configuration file:

`function submitTransaction(serializedTx, opts)`

The return for this function must be a `Promise` with the following parameter in it's callback:

```
{
  hash: 'transaction_hash',
  metadata: {<metadata object regarding submission>},
  error: falsey
}
```

### Transaction verification
To submit a verification, the plugin needs to implement the following function, where the `txHash` is the hash for the transaction that's being verified and `opts` is the options object defined by the plugin on it's configuration file:

`function verifyTransaction(txHash, opts)`

The return for this function must be a `Promise` with the following parameter in it's callback:

```
{
  tx_verifiable: true|false,
  result: true|false|falsey
}
```

The `tx_verifiable` will indicate wheter or not this transaction is ready for verification, until this is `true` the Node won't submit a result to the blockchain. The result can be `true|false|falsey`, where `true|false` represent if the transaction was submitted to the specified network (whether or not the transaction went through) and `falsey` is used to indicate wheter or not a decision has been reached regarding the transaction verification.
