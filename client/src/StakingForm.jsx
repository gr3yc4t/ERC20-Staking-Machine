import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grow from '@material-ui/core/Grow'


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
            tokenBalance: 0,
            showReferralInput: false,
            hasReferral: false,
            hasAllowance: false,
            allowanceValue: 0,
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
        this.checkAllowance();
        this.getTokenBalance();
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

    async getTokenBalance(){
        await this.state.tokenInstance.balanceOf(this.state.account).then( (response) => {
            console.log(response);

            let decimals = BigNumber(10).pow(this.state.tokenDecimals)

            let viewBalance = BigNumber(response.toString()).divide(decimals)

            this.setState({tokenBalance: viewBalance.toString()})

        }).catch( (err) =>{
            console.log(err );
        });
    }


    handleSubmit(event){
        event.preventDefault();
        console.log(this.state.finalAmount)
        if(typeof this.state.finalAmount == "undefined"){
            console.log("Invalid amount")
            this.props.enqueueSnackbar(<Trans i18nKey="staking_form.errorUndefinedStake" />, {
                variant: 'warning',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
            return;
        }

        this.checkAllowance().then( () => {

            console.log(this.state.allowanceValue)
            if(this.state.amountToStake > this.state.allowanceValue){
                this.props.enqueueSnackbar(<Trans i18nKey="staking_form.errorNoAllowance" />, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                });
                return;
            }
    
            console.log(this.state.tokenBalance)
            if(this.state.amountToStake > this.state.tokenBalance){
                this.props.enqueueSnackbar(<Trans i18nKey="staking_form.errorInsufficientFunds" />, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                });
                return
            }
    
    
            
            this.activateStake(); 


        });


    }


    async checkAllowance(){
        
        if(this.state.tokenInstance == null){
            console.log("The contract is not instantiated yet")
            return;
        }


        this.setState({loading: true})

        await this.state.tokenInstance.allowance(this.state.account, this.state.stakingAddress).then( (amountAllowed) => {
            if(!amountAllowed.isZero()){
                console.log("Has positive allowance");

                //Calculating the current allowance
                let decimals = BigNumber(10).pow(this.state.tokenDecimals)

                let viewBalance = BigNumber(amountAllowed.toString()).divide(decimals)
    
                this.setState({
                    allowanceValue: viewBalance.toString(),
                    hasAllowance: true,
                    loading: false
                })

                console.log(this.state.allowanceValue)
            }else{
                console.log("Has negative allowance");
                this.setState({
                    hasAllowance: false,
                    loading: false,
                    allowanceValue: 0
                })
            }
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



            this.props.enqueueSnackbar(<Trans i18nKey="staking_form.correctStake" />, {
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
            this.props.enqueueSnackbar(<Trans i18nKey="staking_form.stakingPending" />, {
                variant: 'warning',
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

        /*
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
        */


        /*
        if(!this.state.hasAllowance){

            return (
                <div>
                    <Typography>Currently you have no allowance, please set a value in the "Approvement" panel</Typography>
                </div>
            )

        }
        */

        return (
            <Grow in={true}>
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
            </Grow>
        );

    }


}



StakingForm.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withSnackbar( withStyles(styles)(StakingForm));