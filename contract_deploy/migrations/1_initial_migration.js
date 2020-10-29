const Migrations = artifacts.require("getdomain");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
