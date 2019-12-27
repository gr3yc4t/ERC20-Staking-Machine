import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from "@material-ui/core";



class PenaltyWithdrawDialog extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInstance: props.contractInstance,
            accounts: props.accounts,
            stakeID: props.stakeID,     //The ID of the stake in the contract
            amountStaked: props.amountStaked,
            open: false,
            withdrawPenalty: 0,
            selectedAccount: props.accounts[0],
            withdrawCallback: props.withdrawCallback,
            onWithdrawCallback: props.onWithdraw,     //Callback called when the dialog is closed
            loading: false,
        }

        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClickClose = this.handleClickClose.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleClickOpen(){
      this.setState({
        open: true
      })
    }

    handleClickClose(){
      this.setState({
        open: false
      })
    }

    handleSubmit(){
      this.setState({loading: true})
      this.state.contractInstance.methods.withdrawWithPenalty(this.state.stakeID).send({from: this.state.selectedAccount}).then( (result) => {
        this.setState({loading: false})
        this.state.onWithdrawCallback();
      });
    }



    render(){
         return(
            <div>
            <Button variant="outlined" color="secondary" onClick={this.handleClickOpen}>
                Withdraw with penalty
            </Button>
            <Dialog open={this.state.open} onClose={this.handleClickClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Penalty Warning</DialogTitle>
                {this.state.loading ? (
                  <CircularProgress></CircularProgress>
                ) : (
                  <DialogContent>
                    <DialogContentText>
                        <Typography color="error" component="h1" variant="h3">Warning:</Typography> 
                        <Typography color="error" component="h5" variant="h5">Time is not elasped yet</Typography>
                        <Typography component="body">
                          If you withdraw while the time is not elasped yet you wil 
                          incurr in a penalty of 10% of your amount.
                        </Typography>
                        <Typography component="h5" variant="h5">
                          Continue?
                        </Typography>
                    </DialogContentText>
                </DialogContent>
              )}
              <DialogActions>
                {this.state.loading ? (
                  <div></div>
                ) : (
                  <div>
                    <Button onClick={this.handleClickClose} color="primary">
                      No
                    </Button>
                    <Button onClick={this.handleSubmit} color="secondary">
                      Yes
                    </Button>
                  </div>
                )}

              </DialogActions>
            </Dialog>
          </div>
        );


    }



}


export default PenaltyWithdrawDialog;
