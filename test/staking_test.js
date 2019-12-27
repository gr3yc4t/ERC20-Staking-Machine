const Staking = artifacts.require("./Staking.sol");

contract("Staking", accounts => {

    it("...should allow staking token by Client 1 with no referral.", async () => {
      const stakingInstance = await Staking.deployed();
  
      // Set value of 89
      await stakingInstance.stakeToken(5000, 0x0000000000000000000000000000000000000001, { from: accounts[1] });
  
      // Get stored value
      const totalStake = await stakingInstance.getTotalStakeAmount.call();
  
      assert.equal(totalStake, 5000, "The stake was correctly performed");
    });


    it("...should allow stake withdraw by Client 1.", async () => {
        const stakingInstance = await Staking.deployed();
    
        // Set value of 89
    
        //Check the number of active stakes
        const number_of_stake = await stakingInstance.getStakeCount({from: accounts[1]});

        if(number_of_stake > 0){
            await stakingInstance.returnTokens(0, { from: accounts[1] });


        }

        // Get stored value
        const totalStake = await stakingInstance.getTotalStakeAmount.call();
    
        assert.equal(totalStake, 5000, "The stake was correctly performed");
    });







  });