# pocket-node
A Pocket Network client for Pocket Nodes, which are the actors within the Pocket Network that execute the Relays.

## Installation
You can install using `npm`:

`npm install -g pocket-node`

## Running the server
To start the server, just run:

`pocket-node start -p [port number]`

But before you start you will need to configure your node and install some plugins.

## What is a Pocket Node Plugin?
The Pocket Node Plugin System allows the Pocket Node app to support any decentralized network as a Relay Node in the Pocket Network.

Each plugin can be created independently and supported individually as a NPM package, and each node can pick and choose whichever plugins they wanna use to support on their network.

## Installing a Pocket Node Plugin
To install a plugin from NPM just run the following command:

`pocket-node install <npm package name>`

If you want to install the plugin from a git repository you can do the same:

`pocket-node install <git repository url>`

As simple as that and your Pocket Node will support the network described by this plugin.

***Note***: Please note that if you install multiple plugins for the same network, only the latest one you installed will be used.

## Listing your Pocket Node Plugins
To see which plugins you have installed just run the following command:

`pocket-node list`

## Configuring your Pocket Node Plugins
Each Plugin requires a configuration file which is a JSON object with all the pre-determined configurations.

`pocket-node configure <plugin name> /path/to/configuration.json`

## Removing a Pocket Node Plugin
To remove a specific plugin just run the following command:

`pocket-node remove <plugin name>`

***Note***: In case you have multiple plugins with the same name, all will be removed.

## Creating your own Pocket Node Plugin
A Pocket Node Plugin has 4 main parts: user defined configurations, plugin defined configurations, a transaction submission function and a transaction verification function.

### Configuration
Each individual node can have different configurations, so a plugin needs to allow them to be set programmatically, and it does so by implementing and exporting the following function:

`function setNodeConfig(config)`

Here the `config` param will be defined by each plugin.

In addition to that the plugin can have pre-defined settings that are not alterable, for these the following function will need to be implemented.

`function getPluginConfiguration()`

Which returns the following object:

```
{
  network: "BTC",
  plugin: {},
  node: {}
}
```

The `plugin` object contains the plugin specific configurations and the `node` object contains all the node defined configurations.

### Transaction submission
To submit a transaction, the plugin needs to implement the following function:

`function submitTransaction(serializedTx)`

The return for this function must be a `Promise` with the following parameter in it's callback:

```
{
  hash: 'transaction_hash',
  metadata: {<metadata object regarding submission>},
  error: falsey
}
```

### Transaction verification
To submit a verification, the plugin needs to implement the following function:

`function verifyTransaction(txHash)`

The return for this function must be a `Promise` with the following parameter in it's callback:

```
{
  tx_verifiable: true|false,
  result: true|false|falsey
}
```

The `tx_verifiable` will indicate wheter or not this transaction is ready for verification, until this is `true` the Node won't submit a result to the blockchain. The result can be `true|false|falsey`, where `true|false` represent if the transaction was submitted to the specified network (whether or not the transaction went through) and `falsey` is used to indicate wheter or not a decision has been reached regarding the transaction verification.
