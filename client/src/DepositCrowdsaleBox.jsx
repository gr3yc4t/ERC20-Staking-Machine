import React, { Component } from "react";



import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import { Trans } from "react-i18next";


import getWeb3 from "./utils/getWeb3";

import BigNumber from "big-number"
import { Button } from "@material-ui/core";



class DepositCrowdsaleBox extends React.Component{

    constructor (props){
        super(props);

        this.state = {
            web3: props.web3,
            currentRate: 0,
            amountToDeposit: 0,
            currentLiquidity: 0
        }



        this.handleChange = this.handleChange.bind(this)
    }


    handleChange(event){

        try{
            let integerAmount = Number(event.target.value)
               
            let decimals = BigNumber(10).pow(18)    //TODO change with TOkenDecimals
    
            let rawBITNamount = BigNumber(integerAmount).multiply(decimals)

            this.setState({
                amountOfBITN: rawBITNamount.toString(),
                amountToDeposit: rawBITNamount
            })
        }catch( err ){
            console.log(err)
            this.setState({
                amountToDeposit: 0,
                amountOfBITN: 0
            })
        }

    }



    render(){

        return(
            <Grid
                container
                spacing={1}
                direction="column"
                justify="center"
                alignItems="center"
            >
                <Grid item>
                    <Typography variant="h5">Deposit Crowdsale</Typography>
                </Grid>
                <Grid item>
                    <TextField disabled label="Current Liquidity" value={this.state.currentRate}></TextField>
                </Grid>
                <Grid item>
                    <TextField label="Amount to deposit" onChange={this.handleChange} value={this.state.amountToDeposit}></TextField>
                </Grid>
                <Grid item>
                    <Button>Deposit</Button>
                </Grid>
            </Grid>
        );

    }



}


export default DepositCrowdsaleBox;