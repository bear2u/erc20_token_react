var Customtoken = artifacts.require("./CustomToken");

module.exports = function(deployer) {
  deployer.deploy(Customtoken);
};
