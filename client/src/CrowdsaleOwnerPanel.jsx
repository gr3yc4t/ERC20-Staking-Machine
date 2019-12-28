import React, { Component } from "react";

import CrowdsaleTesting from './CrowdsaleTesting'
import PriceChart from './PriceChart'


import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'



import BITNCrowdsale from "./contracts/BITNCrowdsale"




class CrowdsaleOwnerPanel extends React.Component{

    constructor (props){
        super(props);

        this.state = {
            web3: props.web3,
            crowdsaleInstance: null,
            crowdsaleAddress: "",
            accounts: props.accounts,
            currentRate: 0,
            newRate: 0,
            amountOfBITN: 0,
            amountOfWEI: 0,
            amountOfETH: 0,
            priceData: null
        }


        this.crowdsaleAddress = "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb"
        //Mainnet
        //this.crowdsaleAddress = "0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B"


        this.handleChange= this.handleChange.bind(this)
        this.handleSetRate = this.handleSetRate.bind(this)
    }



    componentDidMount(){
        this.loadCrowdsaleContract().then( (res) => {
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
            this.getHistoricalPriceData();

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

            console.log("Available token: " + res.toString())

        });
    }



    handleSetRate(event){
        event.preventDefault();

        console.log("Setting rate to : " + this.state.newRate.toString())

        this.state.web3.eth.getAccounts().then( (account) => {

            //this.state.crowdsaleInstance.setRate(this.state.web3.utils.toBN(this.state.newRate).toString(), {from: account[0]}).then( (res) => {
                this.state.crowdsaleInstance.setRate(this.state.web3.utils.toWei(this.state.newRate, "wei"), {from: account[0]}).then( (res) => {
            
            console.log(res)
                this.getCurrentRate();
            }).catch( (err) => {
                console.log(err)
            })



        })

    }


    handleChange(event){
        this.setState({
            newRate: String(event.target.value)
        })
    }







    render(){
        return(
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
                        {this.state.crowdsaleInstance !== null && (
                            <PriceChart crowdsaleInstance={this.state.crowdsaleInstance} />
                        )}
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">Crowdsale Settings</Typography>
                    </Grid>
                    <Grid item>
                        <Typography>Current exchange rate: {this.state.currentRate} wei</Typography>
                    </Grid>
                    <Grid item>
                        <Typography>Set new rate:</Typography>
                        <TextField value={this.state.newRate} onChange={this.handleChange}></TextField>
                        <Button onClick={this.handleSetRate}>Set Rate</Button>
                    </Grid>
                    <Grid item>
                        <CrowdsaleTesting web3={this.state.web3} />
                    </Grid>
                </Grid>
            </Paper>
        )
    }


}


export default CrowdsaleOwnerPanel;