import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'

import { Trans } from "react-i18next";
import Grow from '@material-ui/core/Grow'


import getWeb3 from "./utils/getWeb3";
import BITNCrowdsale from "./contracts/BITNCrowdsale"
import { TextField } from "@material-ui/core";

import BigNumber from "big-number"

import PriceChart from './PriceChart'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';


const styles = theme => ({
    bar: {
      color: 'orange',
      colorDefault: 'black',
      background : '#2E3B55'
    },
    buyButton: {
        background: '#ff551f',
        color: "#efeded",
        border: "1 px solid",
        borderColor: "rgba(43, 43, 43, 0.5)",
        "&:hover, &.Mui-focusVisible": { 
            backgroundColor: "#f77f5ae8",
            color: "#000000",
            border: "1 px solid",
            borderColor: "rgba(43, 43, 43, 0.5)",
        }
    },
    checkBoxReferral: {
        "&:checked, &.Mui-checked": {
            color: "#cf5d26"
        }
    }
  });

class CrowdsalePanel extends React.Component{

    constructor (props){
        super(props);

        this.state = {
            web3: props.web3,
            tokenDecimals: props.tokenDecimals,
            crowdsaleInstance: null,
            availableBalance: 0,
            currentRate: 0,
            viewBITNAmount: 0,
            amountOfBITN: 0,
            amountOfETH: 0,
            amountOfWEI: 0
            
        }


        //this.crowdsaleAddress = "0xe982E462b094850F12AF94d21D470e21bE9D0E9C"
        //Mainnet
        this.crowdsaleAddress = "0x37Ff0201d4f574064d94844e46845BF8dDd1a9C6"

        this.handleBuy = this.handleBuy.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }



    componentDidMount(){
        this.loadCrowdsaleContract().then( () => {
            this.getCurrentRate();
            this.getAvailableBalance();
        });
    }


    async loadCrowdsaleContract(){
        const contract = require('truffle-contract')
        const crowdsaleContract = contract(BITNCrowdsale)
        crowdsaleContract.setProvider(this.state.web3.currentProvider)
    
        
        await crowdsaleContract.at(this.crowdsaleAddress).then(instance => {
            console.log("Crowdsale contract: " + crowdsaleContract.address)

            this.setState({
                crowdsaleInstance: instance
            });

            this.getCurrentRate();

        }).catch( (err) => {
            console.log("There was an error: " + err)
        })
    }


    async getCurrentRate(){
        this.state.crowdsaleInstance.getCurrentRate.call().then( (res) => {
            console.log(res.toString())
            this.setState({
                currentRate: res.toString()
            })
        }).catch( (err) => {
            console.log("Unable to fetch the current rate")
        })
    }

    async getAvailableBalance(){
        this.state.crowdsaleInstance.getAvailableToken.call().then( (res) => {

            let realAmount = this.state.web3.utils.fromWei(res)

            this.setState({
                availableBalance: realAmount.toString()
            })

        });
    }



    handleBuy(event){
        event.preventDefault();

        this.state.web3.eth.getAccounts().then( (account) => {

            console.log("Accout beneficiary: " + account[0])
            console.log(this.state.web3.utils.toWei(this.state.amountOfWEI, "wei").toString())
            this.state.crowdsaleInstance.buyTokens(account[0], {value: this.state.web3.utils.toWei(this.state.amountOfWEI, "wei"), from: account[0] }).then( (res) => {
                this.props.enqueueSnackbar(<Trans i18nKey="crowdsale.snackbarSuccess" />, {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                });
            }).catch( (err) => {
                this.props.enqueueSnackbar(<Trans i18nKey="crowdsale.snackbarFailure" />, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                });
            })



        })

    }

    
    handleChange(event){
        try{
            let integerAmount = Number(event.target.value)
            
            if(integerAmount > this.state.availableBalance){
                integerAmount = this.state.availableBalance;
                this.props.enqueueSnackbar(<Trans i18nKey="crowdsale.liquidityLimitReached" />, {
                    variant: 'info',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                });
            }

            console.log(this.state.currentRate)
            let currentRate = BigNumber(this.state.currentRate)

            let decimals = BigNumber(10).pow(this.state.tokenDecimals)

            let rawBITNAmount = BigNumber(integerAmount).multiply(decimals)
            let BITNAmount = this.state.web3.utils.toBN(rawBITNAmount.toString())


            let ethResult = rawBITNAmount.divide(currentRate)
            let WEIAmount = this.state.web3.utils.toBN(ethResult.toString())

            let ETHAmount = this.state.web3.utils.fromWei(WEIAmount);

            this.setState({
                viewBITNAmount: integerAmount,
                amountOfBITN: BITNAmount,
                amountOfWEI: WEIAmount,
                amountOfETH: ETHAmount
            })
        }catch (err){
            console.log(err)
        }
    }

    render(){

        const { classes } = this.props;


        return(
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
                    <Grid item>
                        <Typography variant="h4"><Trans i18nKey="crowdsale.title" /></Typography>
                    </Grid>
                    <Grid item>
                        {this.state.crowdsaleInstance !== null && (
                            <PriceChart crowdsaleInstance={this.state.crowdsaleInstance} />
                        )}
                    </Grid>
                    <Grid item>
                        <Typography><Trans i18nKey="crowdsale.liquidity" />: {this.state.availableBalance}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography><Trans i18nKey="crowdsale.currentRate" />: <b>{this.state.currentRate}</b></Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            value={this.state.viewBITNAmount}
                            label={<Trans i18nKey="crowdsale.amountBITN" />}
                            onChange={this.handleChange}
                        ></TextField>
                    </Grid>
                    <Grid item>
                        <TextField
                            value={this.state.amountOfETH.toString()}
                            label={<Trans i18nKey="crowdsale.amountETH" />}
                        ></TextField>                        
                    </Grid>
                    <Grid item>

                    </Grid>
                    <Grid item>
                        <Button 
                            onClick={this.handleBuy} 
                            variant="outlined"
                            className={classes.buyButton}>
                                <Trans i18nKey="crowdsale.buyButton" />
                        </Button>
                    </Grid>

                </Grid>
            </Paper>
            </Grow>
        )
    }


}

CrowdsalePanel.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default  withSnackbar(withStyles(styles)(CrowdsalePanel));