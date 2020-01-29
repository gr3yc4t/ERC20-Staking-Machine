import React, { Component } from "react";


import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CircularProgress from '@material-ui/core/CircularProgress'

import BigNumber from "big-number"

import {CopyToClipboard} from 'react-copy-to-clipboard';


import ReferralEntry from './ReferralEntry'

import GetAppIcon from '@material-ui/icons/GetApp';

import Grow from '@material-ui/core/Grow'

import { Trans } from "react-i18next";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from "@material-ui/core";

import { withSnackbar } from 'notistack';


class ReferralBox extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInstance: props.contractInstance,
            account: props.account,
            tokenDecimals: props.tokenDecimals,
            referrals: null,
            referral_list: "",
            viewReferralReward: 0
        }

        this.referral_list = ""

        this.withdrawReferralReward = this.withdrawReferralReward.bind(this)

    }



    componentDidMount(){
        this.fetchReferral();
        this.fetchTotalReward();

        this.state.contractInstance.events.referralRewardSent().on('data', event => {
            console.log("Referral Withdraw - Event Received")

            console.log(event)
            this.fetchReferral();

            this.forceUpdate();
            let referral = event.returnValues.account;

            console.log(referral)
            console.log(this.state.account)
            if(referral == this.state.account){
                this.fetchReferral();
            }

        });

    }

    fetchReferral(){
        
        this.state.contractInstance.methods.getCurrentReferrals().call().then( (result) => {
            console.log("Fetched Referrals")
            console.log(result)

            if(result.length == 0){
                result = null;
            }

            this.setState({referrals: result}, () => {
                this.fetchTotalReward();
            });
        }).catch( (err) => {
            console.log("Unable to list active stake; " + err)
        });       
         
    }


    fetchTotalReward(){
        this.state.contractInstance.methods.calculateTotalRewardReferral().call().then( (rawResult) => {

            console.log("TotalReward:" + rawResult)

            let decimals = BigNumber(10).power(this.state.tokenDecimals);
            let realAmount = BigNumber(rawResult).divide(decimals);

            this.setState({
                viewReferralReward: realAmount.toString()
            })

        }).catch( (err) => {
            console.log(err)
        });

        if(this.state.referrals === null || this.state.referrals.length === 0){
            console.log("No referrals present")
            return;
        }

        
        this.state.contractInstance.methods.getLowestStake(this.state.referrals[0]).call().then( (rawResult) => {
            console.log("Lowest stake:")
            console.log(rawResult)

        }).catch( (err) => {
            console.log(err)
        });
        

    }


    fetchStakeReward(){
        this.state.contractInstance.methods.calculateRewardReferral(this.state.referrals[0]).call().then( (rawResult) => {
            console.log(rawResult)
        }).catch( (err) => {
            console.log("Unable to calculate")
        });
    }


    withdrawReferralReward(){
        this.setState({
            loading: true
        })
        this.state.contractInstance.methods.withdrawReferralReward().send({ from: this.state.account }).then( (rawResult) => {

            console.log(rawResult)

            let result = Boolean(rawResult)

            if(result){
                console.log("Reward successfully withdrawed");
            }else{
                console.log("The POT is exhausted!!!!")
            }

            this.fetchTotalReward();
            this.fetchReferral();
            this.setState({loading: false})
        }).catch( (err) => {
            console.log("There was an error : " + err)
            this.setState({loading: false})

        });
    }



    render(){

        return (
            <Grow in={true}>
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
                            <Typography variant="h4" component="h4"><Trans i18nKey="referral_panel.referralTitle" /></Typography>
                        </Grid>
                        <Grid item>
                            <Typography><Trans i18nKey="referral_panel.myReferralLabel" />: </Typography>
                        </Grid>
                        <Grid item>
                            <TextField value={this.state.account}></TextField>
                        </Grid>
                        <Grid item>
                            <CopyToClipboard
                                text={this.state.account}
                                onCopy={() => {
                                    this.props.enqueueSnackbar(<Trans i18nKey="referral_panel.copyMessage" />, {
                                        variant: 'info',
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        },
                                    });
                                }}
                            > 
                                <Button variant="outlined"><Trans i18nKey="referral_panel.copyButton" /></Button>
                            </CopyToClipboard>
                            
                        </Grid>
                            {this.state.referrals !== null ? (
                                <div>
                                    <Grid item>
                                        {!this.state.loading ? (
                                            this.referral_list = this.state.referrals.map( (ref_address) => 
                                            <ListItem button>
                                                <ReferralEntry
                                                    contractInstance={this.state.contractInstance}
                                                    account={this.state.account}
                                                    tokenDecimals={this.state.tokenDecimals}
                                                    referredAddress={ref_address}
                                                >
                                                </ReferralEntry>
                                            </ListItem>
                                            )
                                        ) : (
                                            <CircularProgress />
                                        )}
                                        <List component="nav">

                                        </List>
                                    </Grid>
                                    <Grid item>
                                        <Typography><Trans i18nKey="referral_panel.totalAvailavelReward" />: <b>{this.state.viewReferralReward}</b></Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button 
                                            onClick={this.withdrawReferralReward}
                                            variant="contained" 
                                            color="primary"
                                            startIcon={<GetAppIcon />}
                                        >
                                            <Trans i18nKey="referral_panel.withdrawAll" />
                                        </Button>
                                    </Grid>
                                </div>
                            ): (
                                <Grid item>
                                    <Typography color="error"><ErrorOutlineIcon></ErrorOutlineIcon></Typography>
                                    <Typography color="error"><Trans i18nKey="referral_panel.noReferral" /></Typography>
                                </Grid>
                            )}

                    </Grid>
                </Paper>
            </Grow>
        );

    }


}


export default withSnackbar(ReferralBox);