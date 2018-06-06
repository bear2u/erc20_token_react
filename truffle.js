// var HDWalletProvider = require("truffle-hdwallet-provider");

// var mnemonic = "art include push idle erosion switch kingdom switch device hamster expose craft";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
    // ganache2: {
    //   provider: new HDWalletProvider(mnemonic, "http://127.0.0.1:7545"),
    //   network_id: "*"
    // }
  }
};
