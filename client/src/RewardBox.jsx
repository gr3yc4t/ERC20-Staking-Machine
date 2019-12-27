import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import { Typography } from "@material-ui/core";

import { withSnackbar } from 'notistack';

import { Trans } from "react-i18next";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    withdrawRewardButton: {
        background: 'linear-gradient(45deg, #23a644 30%, #024714 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        //height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
  });


class RewardBox extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInstance: props.contractInstance,
            tokenDecimals: props.tokenDecimals,
            account: props.account,
            stakeID: props.stakeID,
            availableReward: props.availableReward,
            
        }


        this.withdrawRewards = this.withdrawRewards.bind(this)
    }




    componentDidMount(){
        this.state.contractInstance.events.PotExhausted().on('data', event => {
            console.log("PotExhausted - Event Received")

            this.props.enqueueSnackbar("Pot Exhausted", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
        });
    }



    withdrawRewards(){
        this.state.contractInstance.methods.withdrawReward(this.state.stakeID).send({ from: this.state.account }).then( (rawResult) => {

            console.log(rawResult)

            let result = Boolean(rawResult)

            if(result){
                console.log("Reward successfully withdrawed");
            }else{
                console.log("The POT is exhausted!!!!")
            }

        }).catch( (err) => {
            console.log("There was an error : " + err)
            this.props.enqueueSnackbar("Pot Exhausted", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
        });
    }

    


    render(){

        const { classes } = this.props;


        return(
            <div>
                <Typography color="textPrimary"><Trans i18nKey="stake_detail.availableRewards" />: <b>{this.state.availableReward.toString()}</b></Typography>
                <Button 
                    className={classes.withdrawRewardButton}
                    onClick={this.withdrawRewards}
                    >
                        <Trans i18nKey="stake_detail.withdrawReward" />
                </Button>
            </div>
        )
    }

}




RewardBox.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withSnackbar(withStyles(styles)(RewardBox));
