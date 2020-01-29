import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";

import TokenSetup from "./TokenSetup"
import DepositPot from "./DepositPot"
import ApproveTransfer from "./ApproveTransfer"
import TokenContext from './TokenContext'
import CrowdsaleOwnerPanel from './CrowdsaleOwnerPanel'
import FinalShutdownBox from './FinalShutdownBox'

import Grid from '@material-ui/core/Grid'


/**
 * @brief Component responsible of managing the contract Owner's feature
 * 
 * Interface for the contract's owner feature, like depositing in the pot.
 * 
 * It should be displayed only if the fetched account is the owner of the contract
 */
class OwnerBox extends Component{

    constructor(props){
        super(props);

        this.state = {
            web3: props.web3,
            stakingInstance: props.stakingInstance,
            accounts: props.accounts,
            tokenLoaded: props.tokenLoaded,
            stakingAddress: props.stakingAddress
        }
        
    }


    componentDidUpdate(){

    }


    render(){

            return(
                <div>
                    <Grid
                    container
                    spacing={3}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    > 
                        <Grid item>
                            <TokenContext.Consumer>
                                {context => (
                                <ApproveTransfer 
                                    tokenAddress={context.address}
                                    tokenName={context.name}
                                    tokenSymbol={context.symbol}
                                    decimals={context.decimals}
                                    tokenInstance={context.instance}
                                    accounts={this.state.accounts}
                                    stakingAddress={this.state.stakingAddress}
                                    web3={this.state.web3}>
                                </ApproveTransfer>
                                )}
                            </TokenContext.Consumer>
                        </Grid>
                        <Grid item>
                            <TokenContext.Consumer>
                                {context => (
                                    <DepositPot 
                                        tokenDecimals={context.decimals}
                                        tokenSymbol={context.symbol}
                                        tokenName={context.name}
                                        tokenInstance={context.instance}
                                        stakingAddress={this.state.stakingAddress}                                        
                                        web3={this.state.web3}
                                        contractInterface={this.state.stakingInstance}
                                        account={this.state.accounts[0]}> 
                                    </DepositPot>
                                )}
                            </TokenContext.Consumer>
                        </Grid>
                        <Grid item>
                            <CrowdsaleOwnerPanel
                                web3={this.state.web3}
                                accounts={this.state.accounts}
                                >  
                            </CrowdsaleOwnerPanel>

                        </Grid>
                        <Grid item>

                        </Grid>
                    </Grid>
                </div>
            );
        
    }



    /*
        <FinalShutdownBox 
            stakingAddress={this.state.stakingAddress}                                        
            web3={this.state.web3}
            contractInterface={this.state.stakingInstance}
            account={this.state.accounts[0]}
        />
    */

}


export default OwnerBox;