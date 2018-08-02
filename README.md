# pocket-node
A Pocket Network client for Pocket Nodes, which are the actors within the Pocket Network that execute the Relays.

For more about the Pocket Network please visit [our website](https://pokt.network)

## Installation
You can install using `npm`:

`npm install -g pocket-node`

## Running the server
To start the server, just run:

`pocket-node start -p [port number]`

But before you can start relaying transactions, read below on how to install the different plugins which will allow your Node to connect to the different blockchains (ETH, BTC, LTC, etc.).

## Using Docker

The `.env` file is an example set of environment variables that `docker-compose` will use by default when bringing up the container.

The `pocket-node` image will be built and container may be started simply by running:

    docker-compose up -d

If you are iterating on the codebase and changing things, this is the best way to ensure your changes are included in the resultant docker image and spawned container:

    docker-compose build pocket-node && docker-compose up -d --force-recreate pocket-node

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
Each Plugin requires a configuration file which is a JSON object with all the pre-determined configurations. Please refer to each Plugin's documentation to see how you can configure your Plugin using the following command:

`pocket-node configure <network token ID (ETH, BTC, etc.)> /path/to/configuration.json`

## Removing a Pocket Node Plugin
To remove a specific plugin just run the following command:

`pocket-node remove -n <network token ID (ETH, BTC, etc.)>`

You can also remove all installed plugins with the following command:

`pocket-node remove -a`

***Notes***:

1. In case you have multiple plugins with the same network, all will be removed.
2. If you remove a plugin, your configuration for that plugin will be removed as well, as such you will have to reconfigure the plugin if you decide to re-install it.
