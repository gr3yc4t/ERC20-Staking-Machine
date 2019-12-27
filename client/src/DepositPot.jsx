import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress';

import Grow from '@material-ui/core/Grow';


import { withSnackbar } from 'notistack';


import BigNumber from "big-number"


//TODO: Handle multiple accounts


class DepositPot extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInterface: this.props.contractInterface,
            account: this.props.account,
            tokenDecimals: props.tokenDecimals,
            tokenSymbol: props.tokenSymbol,
            tokenName: props.tokenName,
            tokenInstance: props.tokenInstance,
            stakingAddress: props.stakingAddress,
            depositAmount: 0,
            realDepositAmount: 0,
            currentPot: 0,
            potentialWithdraw: 0,
            machineState: 0,
            showError: false,
            errorMessage: "",
            loading: false,
            approvementConfirmed: false
        }

        this.web3 = props.web3

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    componentDidMount(){
        //Pot Deposit Listener
        this.state.contractInterface.events.PotUpdated().on('data', event => {
            console.log("Pot Updated - Event Received")
            this.updatePotValue(event);
        });

        this.getCurrentPot();   //Update Pot value
        this.getPotentialWithdrawAmount();
        this.getMachineState();
    }

    componentWillUnmount(){
        //TODO Unsubscribe the "Pot Deposit Listener"
    }



    depositIntoPot(){

        this.state.contractInterface.methods.depositPot(this.state.realDepositAmount.toString()).send({ from: this.state.account }).then((result) =>{
            console.log("Pot Deposited")
            this.props.enqueueSnackbar("Successful deposit", {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });            
            
            this.setState({loading: false})


            this.getCurrentPot();
  

        }).catch( (err) =>{
            console.log(err)
            this.setState({loading: false})
            this.props.enqueueSnackbar("Unable to deposit pot, check your balace", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
        });
    }



    handleChange(event){

        var integerAmount = Number(event.target.value)


        var decimals = BigNumber(10).pow(this.state.tokenDecimals)

        var result = BigNumber(integerAmount).multiply(decimals)

        var finalAmount = this.web3.utils.toBN(result.toString())

        this.setState({
            depositAmount: event.target.value,
            realDepositAmount: finalAmount
        })
    }

    handleSubmit(event){
        event.preventDefault();

        this.getApprove().then( (res) => {
            this.setState({approvementConfirmed: true})
            this.depositIntoPot().then( (res) => {
                this.setState({approvementConfirmed: false})
            });
        }).catch( (err) => {
            console.log("Unable to get the allowance: " + err)
        }) 
    }

    getCurrentPot(){
        this.state.contractInterface.methods.getCurrentPot().call().then( (result) => {
    
                console.log("Current pot : " + this.toViewAmount(result))
                this.setState({currentPot: this.toViewAmount(result)});

        }).catch( (err) => {
            console.log(err);
            this.props.enqueueSnackbar("Unable to fetch current pot", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
        }); 

    }


    updatePotValue(event){
        let newPot = event.returnValues.newPot;
        this.setState({
            currentPot: this.toViewAmount(newPot)
        })
    }


    toViewAmount(_amount){
        let BN = this.web3.utils.BN;
        let decimals = new BN(10).pow( new BN(this.state.tokenDecimals));
        let currentPot = new BN(_amount);
        let viewAmount = currentPot.div(decimals) 
        return viewAmount.toNumber();       
    }

    async getApprove(){
        
        if(this.state.tokenInstance == null){
            console.log("The contract is not instantiated yet")
            return;
        }


        console.log("Get Approve")
        console.log(this.state.realDepositAmount)

        this.setState({loading: true})

        await this.state.tokenInstance.approve(this.state.stakingAddress, this.state.realDepositAmount.toString(), {from: this.state.account}).then( (response) => {
            console.log(response);
            if(response === true){
                console.log("Approved the management of " + this.state.approvedAmount + " tokens")
            }else{
                console.log("Has NOT the approvement")
            }
            return response;
        }).catch( (err) =>{
            console.log(err);
            this.setState({loading: false})
        });

    }


    async getPotentialWithdrawAmount(){

        this.state.contractInterface.methods.getPotentialWithdrawAmount().call().then( (result) => {
    
            console.log("Current pot : " + this.toViewAmount(result))
            this.setState({potentialWithdraw: this.toViewAmount(result)});

        }).catch( (err) => {
            console.log(err);
            this.props.enqueueSnackbar("Unable to fetch the potential withdraw amount", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
        }); 
        
    }


    async getMachineState(){
        this.state.contractInterface.methods.getMachineState().call().then( (result) => {
    
            console.log("Machine state : " + this.toViewAmount(result))
            this.setState({machineState: this.toViewAmount(result)});

        }).catch( (err) => {
            console.log(err);
            this.props.enqueueSnackbar("Unable to fetch the machine state", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
        });         
    }


    render(){

        return (
            <Grow in={true}>
                <Paper 
                    elevation={4}
                    style={{ padding: 20, margin: 0, backgroundColor: '#fafafa' }}
                    >
                        <Typography variant="h4" component="h4">Deposit Pot</Typography>

                        <Grid
                            container
                            spacing={1}
                            direction="column"
                            justify="center"
                            alignItems="center"
                            >
                                {this.state.loading ? (
                                    <div>
                                        {this.state.approvementConfirmed && (
                                           <Typography variant="body1" component="h3">Approvement confirmed, waiting for the deposit confirmation...</Typography> 
                                        )}
                                        <CircularProgress></CircularProgress>
                                    </div>
                                ) : ( 
                                <div>
                                <Grid item>
                                    <Typography variant="body1" component="h3">Amount to deposit</Typography>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Amount to deposit"
                                        margin="normal"
                                        variant="outlined" 
                                        value={this.state.depositAmount}
                                        onChange={this.handleChange}                                
                                        />
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="secondary" onClick={this.handleSubmit}>Deposit</Button>
                                </Grid>
                                </div>
                                )}
                                <Grid item>
                                    <Typography variant="body1" component="h6">Current Pot: <b>{this.state.currentPot}</b> {this.state.tokenSymbol}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" component="h6">Potential Withdraw: <b>{this.state.potentialWithdraw}</b> {this.state.tokenSymbol}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" component="h6">Machine State: <b>{this.state.machineState}</b> {this.state.tokenSymbol}</Typography>
                                </Grid>
                        </Grid>
                            
                    </Paper>
            </Grow>
            
        );

    }
}

export default withSnackbar(DepositPot);
