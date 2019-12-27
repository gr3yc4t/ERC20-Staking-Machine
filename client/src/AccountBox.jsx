import React, { Component } from "react";

import StakingContract from "./contracts/Staking.json";
import getWeb3 from "./utils/getWeb3";
import TutorialToken from "./contracts/TutorialToken.json"

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { withSnackbar } from 'notistack';

import StakeInfo from './AccountInfo'

/**
 * @brief Component responsible for approving ERC20 transfer
 * 
 * Load the Token contract and call the "approve()" method specifying the amount of token
 * this Dapp is allowed to manage.
 */


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    box: {
        background: 'linear-gradient(#ff9f73 10%, #FFFFFF 15% )',
        borderRadius: 3,
        border: 0,
        padding: 20, 
        margin: 0, 
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
  });



class AccountBox extends React.Component{



    constructor(props){
        super(props);

        this.state = {
                    contractInterface: this.props.contractInterface,
                    account: this.props.account,
                    callbackTokenSetted: props.callbackSetted,
                    stakingInstance: props.stakingInstance,
                    tokenAddress: "",
                    showSuccessLabel: false
            };

        

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    handleChange(event){
    
        let _amountToApprove = Number(event.target.value);
        console.log(_amountToApprove)
        this.setState({
            approvedAmount: _amountToApprove
        });
    
    }




    render(){

        const { classes } = this.props;


        if(this.state.contractInstance == null){
            return(
                <div>
                    <Typography variant="body1" component="h3">Unable to load the contract</Typography>
                </div>
            )
        }



        return(
            <Paper 
                elevation={4}
                className={classes.box}
            >  
                <Grid
                    container
                    spacing={1}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    >
                        <Grid item>
                            <Typography variant="h3" component="h3">Account Info</Typography>
                        </Grid>
                        <Grid item>
                            <StakeInfo />
                        </Grid>
                        <Grid item>
                        
                        </Grid>
                </Grid>
            </Paper>
        );

    }

}

AccountBox.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withSnackbar(withStyles(styles)(AccountBox));