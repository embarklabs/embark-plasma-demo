# Embark Plasma Demo
The Embark Plasma Demo is a DApp built using Embark and the [`Embark-Plasma`](https://github.com/embark-framework/embark-plasma) plugin. The frontend is the OmiseGO [`js-starter-kit`](https://github.com/omisego/js-starter-kit) that has been converted to use [`EmbarkJS-Plasma`](https://github.com/embark-framework/embarkjs-plasma).

> **PLEASE NOTE**
> This is completely alpha software and should not be used in a production environment.

## Embark-Plasma Demo Setup
This is an example client side wallet built in Vue.js which allows you to make interactions with the OMG network from the browser.

NOTE: 
- This kit is meant for development and demonstration purposes. It is not safe for production use.
- This example application is compatible with `Samrong v0.2`

## Initial Setup

Make sure you have access to the endpoints including Watcher, Childchain, address of the Plasma Contract and Web3 RPC endpoint. The wallet also requires an in-browser web3 wallet like MetaMask to sign transactions.

the endpoints for production deployment can be found [here](https://github.com/omisego/dev-portal/blob/master/guides/network_endpoints.md)

1. Installing dependencies by running `yarn install` on the root directory
2. Run embark `embark run`
3. Start the app by running `yarn serve`

## Running the Starter-kit

A browser should automatically open to `http://localhost:3001`, Make sure your Metamask is currently unlocked. You should be able to see your account balance on both Root chain and Child chain.

From here, you can perform 3 actions:

1. Deposit into the OMG Network: After 12 blocks confirmations, your Rootchain balance will be updated, click on the Refresh button. 

2. Transfer the funds on the OMG Network: Fill in the values for the Transfer fields and click Ok. Depending on the network congestion, you may have to wait for a little while for the transaction to be included in a block. Click on the Refresh balances button until your balance has been properly reflected.

3. Exit the funds back to Rootchain: Fill in an address that has funds in the OMG Network and click on OK, your exit period will start. Do note that the exit period will be varied based on the configuration of each `elixir-omg` deployment. After the certain amount of time has passed, you will be able to process the exit and receive your funds back.

NOTE: the current wallet does not offer a way to call `processExit()` yet.

## Vue.js project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).