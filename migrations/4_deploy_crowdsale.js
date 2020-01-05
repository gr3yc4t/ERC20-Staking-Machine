var BITNCrowdsale = artifacts.require("./BITNCrowdsale.sol")
var BitcoinCompanyNetworkTestToken = artifacts.require("./BitcoinCompanyNetworkTestToken.sol");


module.exports = function(deployer, network, accounts){

    var mainnet_address = "0x41ad4093349c8a60de591a3c37dcd184558eaae3"
    
    deployer.deploy(BITNCrowdsale, 1, accounts[0], mainnet_address).then( (_Crowdsale) => {
        console.log("Crowdsale Address: " + BITNCrowdsale.address)
      });
    


}