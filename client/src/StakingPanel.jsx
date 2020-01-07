import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import StakingLister from "./StakingLister"
import StakingForm from "./StakingForm"

import ViewListIcon from '@material-ui/icons/ViewList';


import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'


import TokenContext from './TokenContext'
import ApproveInfo from "./ApproveInfo"

import { translate, Trans } from "react-i18next";
import Grow from '@material-ui/core/Grow'



class StakingPanel extends Component{

    constructor(props){
        super(props);

        console.log(props);

        this.state = {
            tokenAddress: props.tokenAddress,
            contractInterface: this.props.contractInterface,
            stakingAddress: props.stakingAddress,
            accounts: props.accounts,
            account: props.accounts[0],
            subscriptionEnded: false
        }

        this.newStakeHandler = this.newStakeHandler.bind(this)      

    }



    componentDidMount(){
        this.checkSubscriptionEnd();
    }



    newStakeHandler(){
        this.forceUpdate();
    }

        


    checkSubscriptionEnd(){
        this.state.contractInterface.methods.isSubscriptionEnded().call().then( (result) => {
            console.log(result)
            console.log("Subscription ended?  " + result);
            this.setState({
                subscriptionEnded: Boolean(result)
            })
        }).catch ( (err) => {
            console.log(err)
        });
    }




    render(){

        console.log(this.state.subscriptionEnded)

        return (
            <Grow in={true}>
                <Paper 
                    elevation={4}
                    style={{ padding: 20, margin: 0, backgroundColor: '#fafafa' }}
                >  
                    <Grid
                        container
                        spacing={1}
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        {!this.state.subscriptionEnded ? (
                            <div>
                            <Grid item>  
                                <Typography color="textPrimary" variant="h4"><Trans i18nKey="staking_form.title" /></Typography>
                                <Typography color="textSecondary">
                                    <Trans i18nKey="staking_form.subtitle" />
                                </Typography>
                                <ApproveInfo></ApproveInfo>
                            </Grid>
                            <Grid item>
                                <TokenContext.Consumer>
                                            {context => (
                                                <StakingForm 
                                                    tokenAddress={context.address}
                                                    tokenName={context.name}
                                                    tokenSymbol={context.symbol}
                                                    tokenInstance={context.instance}
                                                    stakingAddress={this.state.stakingAddress}
                                                    web3={context.web3}
                                                    contractInstance={this.state.contractInterface} 
                                                    account={this.state.account}
                                                    newStakeHandler={this.newStakeHandler}
                                                    tokenDecimals={context.decimals}>
                                                </StakingForm>
                                            )}
                                </TokenContext.Consumer>
                            </Grid>
                            </div>
                        ) : (
                            <div>
                                <Typography>Subscription ended</Typography>
                            </div>
                        )}

                    </Grid>
                </Paper>
            </Grow>
        );

    }

}


export default StakingPanel;