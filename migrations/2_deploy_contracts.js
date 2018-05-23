var Customtoken = artifacts.require("./Customtoken.sol");

module.exports = function(deployer) {
  deployer.deploy(Customtoken);
};
