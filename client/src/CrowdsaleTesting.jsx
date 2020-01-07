import React, { Component } from "react";



import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import { Trans } from "react-i18next";


import getWeb3 from "./utils/getWeb3";

import BigNumber from "big-number"



class CrowdsaleTesting extends React.Component{

    constructor (props){
        super(props);

        this.state = {
            web3: props.web3,
            currentRate: 0,
            amountOfBITN: 0,
            amountOfWEI: 0,
            amountOfETH: 0
        }



        this.handleBITNChange = this.handleBITNChange.bind(this)
        this.handleRateChange = this.handleRateChange.bind(this)
    }


    handleBITNChange(event){

        try{
            let integerAmount = Number(event.target.value)
            
            let currentRate = BigNumber(this.state.currentRate)
    
            let decimals = BigNumber(10).pow(18)
    
            let rawBITNAmount = BigNumber(integerAmount).multiply(decimals)
    
            let ethResult = rawBITNAmount.divide(currentRate)
            let WEIAmount = this.state.web3.utils.toBN(ethResult.toString())
    
            let ETHAmount = this.state.web3.utils.fromWei(WEIAmount);
    
    
            this.setState({
                amountOfBITN: integerAmount,
                amountOfWEI: WEIAmount.toString(),
                amountOfETH: ETHAmount.toString()
            })
        }catch( err ){
            console.log(err)
            this.setState({
                amountOfBITN: 0,
                amountOfWEI: 0,
                amountOfETH: 0
            })
        }

    }

    handleRateChange(event){
        console.log("Gwei rate: " + Number(event.target.value))
        this.setState({
            currentRate: Number(event.target.value)
        })
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
                    <Typography variant="h5">Rate testing area</Typography>
                </Grid>
                <Grid item>
                    <TextField label="Custom rate in wei" value={this.state.currentRate} onChange={this.handleRateChange}></TextField>
                </Grid>
                <Grid item>
                    <TextField label="Amount of BITN" onChange={this.handleBITNChange} value={this.state.amountOfBITN}></TextField>
                </Grid>
                <Grid item>
                    <TextField label="Amount of wei" value={this.state.amountOfWEI}></TextField>
                </Grid>
                <Grid item>
                    <TextField label="Amount of ETH" value={this.state.amountOfETH}></TextField>
                </Grid>
            </Grid>
        );

    }



}


export default CrowdsaleTesting;