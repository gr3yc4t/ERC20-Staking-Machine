import React, { Component } from "react";


import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'


import { Trans } from "react-i18next";

import { withSnackbar } from 'notistack';

import ApproveInfo from './ApproveInfo'
import TokenAmountTextBox from "./TokenAmountTextBox"
import BigNumber from "big-number"


import EditIcon from '@material-ui/icons/Edit';

/**
 * @brief Component responsible for approving ERC20 transfer
 * 
 * Load the Token contract and call the "approve()" method specifying the amount of token
 * this Dapp is allowed to manage.
 */


const style = {
    height: 200,
    width: 200,
    margin: "1em",
    textAlign: 'center',
    display: 'inline-block',
  };
  



class ApproveTranfer extends React.Component{


    /**
     * Connect to the web3 interface and deploy the contract
     * @param {function} callback is the callback function called after the cotract is
     * instantiated
     */
    constructor(props){
        super(props);
        this.state = {
            //TokenContext Data
            tokenAddress: props.tokenAddress,
            tokenDecimals: props.decimals,
            tokenName: props.tokenName,
            tokenInstance: props.tokenInstance,
            tokenSymbol: props.tokenSymbol,
            accounts: props.accounts,

            stakingAddress: props.stakingAddress,
            approvedAmount: 0,
            viewApprovedAmount: 0,
            hasAllowance: false,
            setApprovement: props.setApprovement,
            editAmountModeMode: false,
            loading: false
        }


        this.web3 = props.web3;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this)
    }



    componentDidMount(){
        console.log("Checking allowance...")

        this.state.tokenInstance.Transfer().on('data', event => {
            console.log("Transfer detected - Event Received")
            var sender = event.returnValues[0]
            if(sender === this.state.accounts[0])
                this.hasAllowance();
        });
        

        this.hasAllowance();
    }


    async hasAllowance(){

        if(this.state.tokenInstance === null)
            return;



        await this.state.tokenInstance.allowance(this.state.accounts[0], this.state.stakingAddress).then( (response) => {
            console.log(response)
            var amountAllowed = response;

            if(!amountAllowed.isZero() && !amountAllowed.isNeg()){
                    
                    var BN = this.web3.utils.BN;
                    var decimals = new BN(10).pow( new BN(this.state.tokenDecimals));
        
                    var result = amountAllowed.div(decimals)
    
                   
                    console.log("Has the allowance to manage " + result.toString() + " tokens")
                    this.setState({
                        hasAllowance: true,
                        viewApprovedAmount: result.toString(10),
                        approvedAmount: amountAllowed
                    })
                    this.props.enqueueSnackbar("Has the allowance to manage " + result.toString(10) + " tokens", {
                        variant: 'success',
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                        },
                    });
                    //this.state.setApprovement(true);
                



            }else{
                console.log("Has NOT the allowance")
                this.setState({
                    hasAllowance: true
                })
                //this.state.setApprovement(false);
            }
        }).catch( (err) =>{
            alert(err);
        });
    }


    async getApprove(){
        
        if(this.state.tokenInstance == null){
            console.log("The contract is not instantiated yet")
            return;
        }


        console.log("Get Approve")

        this.setState({loading: true})



        console.log(this.state.stakingAddress)
        console.log(this.state.approvedAmount.toString())

        await this.state.tokenInstance.approve(this.state.stakingAddress, this.state.approvedAmount.toString(), {from: this.state.accounts[0]}).then( (response) => {
            console.log(response);
            if(response === true){
                console.log("Approved the management of " + this.state.approvedAmount.toString() + " tokens to " + this.state.stakingAddress)
                this.setState({
                    hasAllowance: true
                }, () => {
                    this.props.enqueueSnackbar("Approved the management of " + this.state.approvedAmount.toString() + " tokens", {
                        variant: 'success',
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                        },
                    });
                })
            }else{
                console.log("Has NOT the approvement")
                this.setState({
                    hasAllowance: false
                });
                
            }
            this.setState({loading: false})
            return response;
        }).catch( (err) =>{
            console.log(err);
            this.setState({loading: false})
        });


    }

    handleChange(_amount){
    
        let _amountToApprove = _amount;
        console.log("Amount: " + _amountToApprove)
        this.setState({
            approvedAmount: _amountToApprove
        });
        
    
    }


    toViewAmount(_realAmount){
        if(_realAmount === 0)
            return 0;

        var decimals = BigNumber(10).pow(this.state.decimals);
        var result = BigNumber(_realAmount).divide(decimals)
        console.log(result)
        return result;
    }

    

    handleSubmit(event){
        event.preventDefault();

        this.getApprove().then( () => {
            this.hasAllowance();
        });
    }

    handleEditButton(event){
        var newState = !this.state.editAmountMode;
        this.setState({
            editAmountMode: newState
        })
    }




    render(){


        var allowanceMessage, approveButtonText;

        if(this.state.hasAllowance){
            allowanceMessage = (
                <div>
                    <Typography variant="body1" component="h3">
                    <Trans i18nKey="approvementPanel.approvementStatus" /> <b>{this.state.viewApprovedAmount}</b> {this.state.tokenSymbol} tokens
                    </Typography>
                </div>
            );
            approveButtonText = (<Trans i18nKey="approvementPanel.editInternalButton" />);
        }else{
            allowanceMessage = (
                <Typography variant="body1" component="h3">Does not have the approvement</Typography>
            );
            approveButtonText = "Amount to approve";

        }




        if(this.state.tokenInstance == null){
            return(
                <div>
                    <Typography variant="body1" component="h3">Unable to load token contract</Typography>
                </div>
            )
        }


        return(
            <Paper 
                elevation={4}
                style={{ padding: 20, margin: 10, backgroundColor: '#fafafa' }}
            >  
                <Grid
                    container
                    spacing={1}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    >
                        <Grid item>
                            <Typography variant="h5" component="h5"><Trans i18nKey="approvementPanel.title" /></Typography>
                        </Grid>
                        <Grid item>
                            {allowanceMessage}
                            {!this.state.editAmountMode && this.state.hasAllowance && (
                                <Button color="secondary" onClick={this.handleEditButton}><Trans i18nKey="approvementPanel.editExternalButton" /></Button>
                            )}
                        </Grid>
                        {(!this.state.hasAllowance || this.state.editAmountMode) && (
                        <div>
                        <Grid item>
                            <ApproveInfo></ApproveInfo>
                        </Grid>
                        <Grid container
                            spacing={1}
                            direction="column"
                            justify="center"
                            alignItems="center">
                            <Grid>
                                <TokenAmountTextBox
                                    label={<Trans i18nKey="approvementPanel.textLabel" />}
                                    placeholder="500"
                                    variant="outlined"
                                    amount={0}
                                    decimals={this.state.tokenDecimals}
                                    onChange={this.handleChange}
                                />
                            </Grid>
                            <Grid>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={this.handleSubmit}
                                    startIcon={<EditIcon />}
                                    >
                                        {approveButtonText}
                                </Button>
                            </Grid>
                            {this.state.editAmountMode && (
                                <Button color="secondary" onClick={this.handleEditButton}><Trans i18nKey="approvementPanel.closeButton" /></Button>
                            )}
                        </Grid>
                        </div>
                        )}
                </Grid>
            </Paper>
        );

    }

}


export default withSnackbar(ApproveTranfer);