var BITNCrowdsale = artifacts.require("./BITNCrowdsale.sol")
var BitcoinCompanyNetworkTestToken = artifacts.require("./BitcoinCompanyNetworkTestToken.sol");


module.exports = function(deployer, network, accounts){

    console.log(BitcoinCompanyNetworkTestToken.address)

    deployer.deploy(BITNCrowdsale, 1, accounts[0], BitcoinCompanyNetworkTestToken.address).then( (_Crowdsale) => {
        console.log("Crowdsale Address: " + BITNCrowdsale.address)
      });



}