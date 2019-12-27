import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';


import CircularProgress from '@material-ui/core/CircularProgress';
import LockIcon from '@material-ui/icons/Lock';

import PropTypes from 'prop-types';


import BigNumber from "big-number"
import { Trans } from "react-i18next";


import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    bar: {
      color: 'orange',
      colorDefault: 'black',
      background : '#2E3B55'
    },
    stakeButton: {
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
  

class StakingForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInstance: props.contractInstance,
            account: props.account,
            tokenInstance: props.tokenInstance,
            tokenDecimals: props.tokenDecimals,
            stakingAddress: props.stakingAddress,
            amountToStake: 100,
            timeToLock: 0,
            showReferralInput: false,
            hasReferral: false,
            referralAddress: "",
            loading: false,                      //Display the loading icon during contract request,
            approvementConfirmed: false
        }


        this.web3 = props.web3

        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReferralCheckbox = this.handleReferralCheckbox.bind(this)
        this.handleReferralAddress = this.handleReferralAddress.bind(this)
    }


    componentDidMount(){
        this.hasReferral();
    }


    handleAmountChange(event){
        let _amountToStake = Number(event.target.value)

        let decimals = BigNumber(10).pow(this.state.tokenDecimals)

        let result = BigNumber(_amountToStake).multiply(decimals)

        let finalAmount = this.web3.utils.toBN(result.toString())

        this.setState({
            amountToStake: _amountToStake,
            finalAmount: finalAmount
        })
    }


    handleReferralCheckbox(event){
        if(event.target.checked === true)
            this.setState({showReferralInput: true})
        else
            this.setState({showReferralInput: false})
    }

    handleReferralAddress(event){
        this.setState({referralAddress: event.target.value})
    }




    handleSubmit(event){
        event.preventDefault();

        if(this.state.finalAmount === null){
            console.log("Invalid amount")
        }

        //this.getApprove().then( (res) => {
            this.activateStake(); 
        //})  
   
    }


    async getApprove(){
        
        if(this.state.tokenInstance == null){
            console.log("The contract is not instantiated yet")
            return;
        }

        console.log("Get Approve")

        this.setState({loading: true})

        await this.state.tokenInstance.approve(this.state.stakingAddress, this.state.finalAmount.toString(), {from: this.state.account}).then( (response) => {
            console.log(response);
            if(response === true){
                console.log("Approved the management of " + this.state.approvedAmount + " tokens")
            }else{
                console.log("Has NOT the approvement")
            }
            this.setState({approvementConfirmed: true})
            return response;
        }).catch( (err) =>{
            console.log(err);
            this.setState({loading: false})
        });

    }




    async activateStake(){

        var _referralAddress = "0x0000000000000000000000000000000000000001";

        if(!this.state.hasReferral && this.state.showReferralInput)
            _referralAddress = this.state.referralAddress

        this.setState({loading: true})

        this.state.contractInstance.methods.stakeToken(this.state.finalAmount.toString(), _referralAddress).send({ from: this.state.account }).then( (result) => {
            console.log("Correctly staked " + this.state.amountToStake + " tokens")
            this.setState({
                loading: false,
                approvementConfirmed:false
            })



            this.props.enqueueSnackbar("Correctly staked " + this.state.amountToStake + " tokens", {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });


            this.hasReferral(); //Used to hide the Referral input

        }).catch( (err) => {
            console.log("Unable to stake; " + err)
            this.setState({loading: false})
            this.props.enqueueSnackbar("Unable to stake", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
        });

    }


    async hasReferral(){
        this.state.contractInstance.methods.hasReferral().call().then( (result) => {
            this.setState({
                hasReferral: Boolean(result)
            })
        }).catch( (err) => {
            console.log("Unable to fetch if the account has referral")
        });        
    }


    render(){

        const { classes } = this.props;


        let referral_input

        if (this.state.showReferralInput === true){
            referral_input = (
                <Grid item>
                    <TextField
                                label={<Trans i18nKey="staking_form.referralPlaceholder" />}
                                margin="normal"
                                variant="outlined" 
                                onChange={this.handleReferralAddress}
                                value={this.state.referralAddress}                               
                    /> 
                </Grid>
            );
        }


        if(this.state.loading){
            return(
                <div>
                    <CircularProgress />
                    {this.state.approvementConfirmed && (
                        <Typography>Approvement granted, waiting for the contract transaction...</Typography>
                    )}
                </div>
            );
        }

        return (
            <div>
                <Grid
                    container
                    spacing={1}
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>
                        <TextField
                                type="number"
                                required
                                label={<Trans i18nKey="staking_form.textBoxHelper" />}
                                margin="normal"
                                variant="outlined" 
                                onChange={this.handleAmountChange}
                                value={this.state.amountToStake}  
                                autoFocus 
                                inputProps={{ min: "100", max: "100000", step: "1" }}

                        />
                    </Grid>

                    <Grid item>

                    </Grid>
                    {!this.state.hasReferral && ( 
                    <Grid item>
                        <Grid 
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            >
                            <Grid item>
                                <Typography variant="body1" component="p"><Trans i18nKey="staking_form.referralCheckbox" /></Typography>
                            </Grid>
                            <Grid item>
                                <Checkbox
                                    checked={this.state.showReferralInput}
                                    onChange={this.handleReferralCheckbox}
                                    checked={this.state.showReferralInput}
                                    inputProps={{
                                    'aria-label': 'primary checkbox',
                                    }}
                                    className={classes.checkBoxReferral}
                                />
                            </Grid>
                        </Grid>

                        {referral_input}
                    </Grid>
                    )}
                    <Grid item>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            onClick={this.handleSubmit}
                            startIcon={<LockIcon />}
                            className={classes.stakeButton}                            

                            >
                                Stake
                            </Button>
                    </Grid>
                </Grid>
            </div>
        );

    }


}



StakingForm.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withSnackbar( withStyles(styles)(StakingForm));