var Staking = artifacts.require("./Staking.sol");
var BitcoinCompanyNetworkTestToken = artifacts.require("./BitcoinCompanyNetworkTestToken.sol");


module.exports = function(deployer, network, accounts){

    
    deployer.deploy(BitcoinCompanyNetworkTestToken).then( (_BitcoinCompanyNetworkTestToken) => {
        console.log("Token correctly deployed")
    })
    
};


//0xc1c7E04fA519091FdFA94C5F5791134b3AD84a16