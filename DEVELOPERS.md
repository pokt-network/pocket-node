# Pocket Network Developers
If you want your application to send transactions to Relay Node in the Pocket Network, you can follow these steps:

## Get an Ethereum Account
You need an Ethereum address to identify you when submitting relays. Remember that right now the Pocket Network is only available in the [Rinkeby Testnet](https://www.rinkeby.io/), so your account needs to be there.

## Select a Node
To select a Relay Node to connect to head over to our [Node Directory](https://directory.pokt.network?isOverview=false). You will need to install Metamask and switch it to the Rinkeby Network to access the Directory.

## Submit a Relay Request
To submit a Relay to your selected Node just submit a POST request to the `/relays` endpoint of your selected Node, to see the full [API Documentation click here](https://directory.pokt.network/docs)
