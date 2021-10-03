const HDWalletProvider = require('@truffle/hdwallet-provider');

require('dotenv').config();

module.exports = {
  compilers: {
    solc: {
      version: '^0.8.0',
      settings: {
        optimizer: {
          enabled: true,
          runs: 1,
        },
      },
    },
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNENOMIC,
          `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_APIKEY}`,
        ),
      network_id: 3, // Ropsten's id
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },
  plugins: ['truffle-contract-size', 'truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_APIKEY,
  },
};
