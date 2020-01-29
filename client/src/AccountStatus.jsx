import React, { Component } from "react";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import { Trans } from "react-i18next";


import BigNumber from "big-number"


class AccountStatus extends Component {

    constructor(props){
        super(props)
        this.state = {
            web3: props.web3,
            tokenInstance: props.tokenInstance,
            tokenDecimals: props.tokenDecimals,
            accounts: props.accounts,
            tokenBalance: 0
        }
    }




    componentDidMount(){
        this.getTokenBalance();
    }



    async getTokenBalance(){
        await this.state.tokenInstance.balanceOf(this.state.accounts[0]).then( (response) => {
            console.log(response);

            let decimals = BigNumber(10).pow(this.state.tokenDecimals)

            let viewBalance = BigNumber(response.toString()).divide(decimals)

            this.setState({tokenBalance: viewBalance.toString()})

        }).catch( (err) =>{
            console.log(err);
        });
    }



    render(){

        return (
            <Grid container>
                <Grid item>
                    <Typography><Trans i18nKey="HomePage.tokenBalance" />: <b>{this.state.tokenBalance}</b></Typography>
                </Grid>
            </Grid>
        );
    }

}

export default AccountStatus;