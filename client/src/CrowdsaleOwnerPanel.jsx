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
            priceData: null,
            newOwner: ""
        }


        //this.crowdsaleAddress = "0xe982E462b094850F12AF94d21D470e21bE9D0E9C"
        //Mainnet
        this.crowdsaleAddress = "0x37Ff0201d4f574064d94844e46845BF8dDd1a9C6"


        this.handleChange= this.handleChange.bind(this)
        this.handleSetRate = this.handleSetRate.bind(this)
        this.handleChangeOwner = this.handleChangeOwner.bind(this)
        this.changeOwner = this.changeOwner.bind(this)
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

            let realAmount = this.state.web3.utils.fromWei(res)

            this.setState({
                availableBalance: realAmount.toString()
            })

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


    handleChangeOwner(event){
        this.setState({
            newOwner: event.target.value
        }, () => {
            console.log(this.state.newOwner)
        })
    }


    changeOwner(){

        this.state.web3.eth.getAccounts().then( (account) => {

            //this.state.crowdsaleInstance.setRate(this.state.web3.utils.toBN(this.state.newRate).toString(), {from: account[0]}).then( (res) => {
            this.state.crowdsaleInstance.transferOwnership(this.state.newOwner, {from: account[0]}).then( (res) => {
            
                console.log(res)
                
            }).catch( (err) => {
                console.log(err)
            })



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
                        <Typography>Current exchange rate: <b>{this.state.currentRate}</b> wei</Typography>
                    </Grid>
                    <Grid item>
                        <Typography>Current exchange liquidity: <b>{this.state.availableBalance}</b></Typography>
                    </Grid>
                    <Grid item>
                        <Typography>Set new rate:</Typography>
                        <TextField value={this.state.newRate} onChange={this.handleChange}></TextField>
                    </Grid>
                    <Grid item>
                        <Button onClick={this.handleSetRate} variant="contained" color="primary">Set Rate</Button>
                    </Grid>
                    <Grid item>
                        <CrowdsaleTesting web3={this.state.web3} />
                    </Grid>
                    <Grid item>
                        <TextField value={this.state.newOwner} onChange={this.handleChangeOwner} />
                        <Button onClick={this.changeOwner}>Change Owner</Button>
                    </Grid>
                </Grid>
            </Paper>
        )
    }


}


export default CrowdsaleOwnerPanel;