import React, { Component } from "react";


import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress';


import PenaltyWithdrawDialog from './PenaltyWithdrawDialog'

import { withSnackbar } from 'notistack';
import { Trans } from "react-i18next";


class WithdrawBox extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInstance: props.contractInstance,
            accounts: props.accounts,
            stakeID: props.stakeID,     //The ID of the stake in the contract
            amountStaked: 0,
            referralAddress: 0,
            withdrawPenalty: 0,
            selectedAccount: props.accounts[0],
            withdrawCallback: props.withdrawCallback,
            loading: false,
            elasped: true
        }


        this.handlePenaltyWithdraw = this.handlePenaltyWithdraw.bind(this)
        this.handleDialogClose = this.handleDialogClose.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setAccount = this.setAccount.bind(this)
    }




    handleSubmit(event){
        event.preventDefault();

        this.withdrawTokens();

    }



    withdrawTokens(){

        this.setState({loading: true})
        this.state.contractInstance.methods.returnTokens(this.state.stakeID).send({from: this.state.selectedAccount}).then( (result) => {

            this.setState({loading: false})
            console.log(result)

            if(this.isWithdrawed(this.state.stakeID)){
                console.log("Token successfullu withdrawed")

                this.state.withdrawCallback();

                this.props.enqueueSnackbar(<Trans i18nKey="withdrawBox.tokenSuccesWithdrawMsg" />, {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                });
            }else{
                console.log("Unable to withdraw tokens, probably the time is not expired yet")
                this.props.enqueueSnackbar(<Trans i18nKey="withdrawBox.tokenSuccesWithdrawMsg" />, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                });
            }


        }).catch( (err) => {
            console.log("Unable to list active stake; " + err)
            this.setState({loadig: false})
        });        
    }


    async isWithdrawed(_stakeID){
        await this.state.contractInstance.methods.getStakeInfo(_stakeID).call().then( (result) => {

            let withdrawed = Boolean(result[2])
            return withdrawed
        });
    }


    setAccount(_account){
        this.setState({selectedAccount: _account});
    }


    handleDialogClose(){
        this.setState({
            showPenaltyWarning: false
        })
    }


    handlePenaltyWithdraw(){
        this.state.withdrawCallback();
    }


    render(){

        if(this.state.loading){
            return(
                <CircularProgress />
            );
        }

        /*
                    <AccountLister 
                        accounts={this.state.accounts}
                        callback={this.setAccount}>
                    </AccountLister>


                <Grid item>
                    <TextField
                        required
                        label="Selected Account"
                        placeholder="500"
                        margin="normal"
                        variant="outlined" 
                        value={this.state.selectedAccount}
                        InputProps={{
                            readOnly: true,
                        }}                            
                    />
                </Grid>
              ) : (
                    <Grid item>
                        <PenaltyWithdrawDialog
                            open={this.state.showPenaltyWarning}
                            contractInstance={this.state.contractInstance}
                            accounts={this.state.accounts}
                            stakeID={this.state.stakeID}
                            onWithdraw={this.handlePenaltyWithdraw}>
                        </PenaltyWithdrawDialog>
                     </Grid>

        */

        return (
            <Grid 
                container
                spacing={1}
                direction="column"
                justify="center"
                alignItems="center"                
            >
                    <Grid item>
                        <Typography color="primary"><Trans i18nKey="withdrawBox.withdrawLabel" /></Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}><Trans i18nKey="stake_detail.withdraw" /></Button>
                    </Grid>

            </Grid>
        );

    }


}


export default withSnackbar(WithdrawBox);