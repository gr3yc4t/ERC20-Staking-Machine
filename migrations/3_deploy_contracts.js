var Staking = artifacts.require("./Staking.sol");
var BitcoinCompanyNetworkTestToken = artifacts.require("./BitcoinCompanyNetworkTestToken.sol");

module.exports = function(deployer, network, accounts){
    
    deployer.deploy(Staking).then( function (_Staking) {
      console.log("Staking address: " + _Staking.address)
      _Staking.setTokenAddress(BitcoinCompanyNetworkTestToken.address).then( (res) => {
        
      })
      

    });
    

 

};


//0xc1c7E04fA519091FdFA94C5F5791134b3AD84a16