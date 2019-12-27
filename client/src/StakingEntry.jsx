import React, { Component } from "react";
import StakingDetail from "./StakingDetail"


import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid'

import Cookies from 'universal-cookie';
import BigNumber from "big-number"


import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    expansionPanel: {
        //background: 'linear-gradient(#3b3735 19%, #FFFFFF 15% )',
        //backgroundImage:
        //'url("https://media.istockphoto.com/photos/plant-growing-picture-id510222832?k=6&m=510222832&s=612x612&w=0&h=Pzjkj2hf9IZiLAiXcgVE1FbCNFVmKzhdcT98dcHSdSk=")',
        borderRadius: 3,
        border: 2,
        //height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(18, 30, 29, .5)',
    },
  });


class StakingEntry extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInstance: props.contractInstance,
            accounts: props.accounts,
            stakeID: props.stakeID,     //The ID of the stake in the contract
            tokenDecimals: props.tokenDecimals,
            timeLocked: 0,
            compoundReward: 0,
            amountStaked: 0,
            referralAddress: 0,
            moreDetail: false,
            isArchived: props.isArchived
        }

        this.cookies = new Cookies();



        this.detailBox = (
            <p></p>
        );


        this.handleDetailView = this.handleDetailView.bind(this);
        this.handleArchivement = this.handleArchivement.bind(this);
    }



    componentDidMount(){
        this.getStakeAmount();
        this.getStakeTime();
        this.getCompoundReward();
    }



    async getStakeAmount() {
        
        this.state.contractInstance.methods.getCurrentStakeAmount(this.state.stakeID).call().then( (result) => {
            let _amount = BigNumber(result);

            let decimals = BigNumber(10).power(this.state.tokenDecimals)
            _amount = _amount.divide(decimals)


            this.setState({amountStaked: _amount.toString()}, () => {

            });
        }).catch( (err) => {
            console.log("Unable to get stake amound for ID " + this.state.stakeID + "; " + err)
        });
        
    }


    async getStakeTime() {
        /*
        this.state.contractInstance.methods.getCurrentStakeTime(this.state.stakeID).call().then( (result) => {
            let timeLocked = Number(result);
            this.setState({timeLocked: timeLocked}, () => {

            });
        }).catch( (err) => {
            console.log("Unable to list active stake; " + err)
        });
        */
    }


    async getCompoundReward() {
        this.state.contractInstance.methods.calculateCompoundInterest(this.state.stakeID).call().then( (result) => {
            console.log(result)
        }).catch( (err) => {
            console.log("Unable get compound reward; " + err)
        });        
    }



    handleDetailView() {
        if(this.state.moreDetail === true)
            this.setState({moreDetail: false})
        else
            this.setState({moreDetail: true})
    }


    handleArchivement(){
        //TODO Handle archivement auto-hide
        //this.setState({isArchived: true});
    }


    render(){

        const { classes } = this.props;



        if(this.state.moreDetail){
            this.detailBox = (
                <StakingDetail 
                    stakeID={this.state.stakeID} 
                    contractInstance={this.state.contractInstance} 
                    accounts={this.state.accounts}
                    archivedCallback={this.handleArchivement}
                    tokenDecimals={this.state.tokenDecimals}
                    isArchived={this.state.isArchived}
                    ></StakingDetail>
            );
        }else{
            this.detailBox = (
                <div></div>
            )
        }



        return (
            <ExpansionPanel 
                onChange={this.handleDetailView}
                className={classes.expansionPanel}
                >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel-content"
                    id="panel-header"
                >
                    {this.state.isArchived ? (
                        <NotInterestedIcon />
                    ) : (
                        <AttachMoneyIcon />
                    )}
                    <Typography variant="body1" component="h6" color="textPrimary"> Amount Staked: <b>{this.state.amountStaked}</b></Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container>
                        {this.detailBox}
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );

    }


}


StakingEntry.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(StakingEntry);