import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import Link from '@material-ui/core/Link';

import ListItemText from '@material-ui/core/ListItemText';
import Container from '@material-ui/core/Container';
import BigNumber from "big-number"

import { Trans } from "react-i18next";




class ReferralEntry extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInstance: props.contractInstance,
            tokenDecimals: props.tokenDecimals,
            account: props.account,
            referredAddress: props.referredAddress,
            stakeID: null,
            availableReward: 0,
          
        }


        this.withdrawRewards = this.withdrawRewards.bind(this)
    }


    componentDidMount(){
        this.fetchReferralReward();
    }


    withdrawRewards(){

    }


    fetchReferralReward(){
        this.state.contractInstance.methods.calculateRewardReferral(this.state.referredAddress).call().then( (rawResult) => {
            console.log(rawResult)

            let decimals = BigNumber(10).power(this.state.tokenDecimals);
            let realAmount = BigNumber(rawResult).divide(decimals);

            this.setState({
                availableReward: realAmount.toString()
            })
        }).catch( (err) => {
            console.log("Unable to calculate")
        });
    }  


    render(){
        return(
            <Container maxWidth="sm">
                <Link href={"https://etherscan.io/address/"+ this.state.referredAddress} id="list-elem">
                    <ListItemText primary={this.state.referredAddress} />
                </Link>
                <Typography color="textSecondary"><Trans i18nKey="referral_panel.availableReward" />: {this.state.availableReward}</Typography>
            </Container>
        )
    }

}


export default ReferralEntry;
