import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";


import WithdrawBox from "./WithdrawBox"
import RewardBox from "./RewardBox"

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';


import Cookies from 'universal-cookie';
import BigNumber from "big-number"

import UnarchiveIcon from '@material-ui/icons/Unarchive';
import ArchiveIcon from '@material-ui/icons/Archive';
import { TextField } from "@material-ui/core";

import { Trans } from "react-i18next";



class StakingDetail extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInstance: props.contractInstance,
            accounts: props.accounts,
            stakeID: props.stakeID,     //The ID of the stake in the contract
            periods: 0,
            amountStaked: 0,
            referralAddress: 0,
            wasWithdraw: false,
            creationTime: 0,
            referer: 0,
            gain: 0,
            penalty: 0,
            currentAmount: 0,
            stakeWithdrawAmount: 0,
            isArchived: props.isArchived,
            loading: false,
            tokenDecimals: props.tokenDecimals,
            showReferer: false,
            infoLoaded: false,

            viewAmount: 0,
            elasped: false              //True if the locked time is elasped
        }

        this.cookies = new Cookies();

        this.archivedCallback = props.archivedCallback;
        this.timer = null;


        this.handleShowReferer = this.handleShowReferer.bind(this)
        this.handleArchivement = this.handleArchivement.bind(this)
        this.handleUnarchivement = this.handleUnarchivement.bind(this)
        this.handleWithdraw = this.handleWithdraw.bind(this)
    }




    componentDidMount(){
        //Stake Withdraw  Listener
        this.state.contractInstance.events.StakeWithdraw().on('data', event => {
            console.log("Stake Withdraw - Event Received")
            console.log(event)
        });

        this.state.contractInstance.events.rewardWithdrawed().on('data', event => {
            console.log("Reward Withdraw - Event Received")
            this.fetchStakeInfo();
        });

        this.fetchStakeInfo();
        this.isArchived()
        this.getPeriods();
        this.getAlreadyWithdrawed();
    }




    fetchStakeInfo(){
        this.setState({loading: true});
        
        //TODO The staked amount is fetched multiple time, even the parent knows its value
        this.state.contractInstance.methods.getStakeInfo(this.state.stakeID).call().then( (result) => {
            
            //1 - Amount Staked
            //2 - isWithdrawed
            //3 - Stake creation time
            //4 - Referer
            //5 - Current Amount (compound interest)
            //6 - Penalty


            this.setState({loading: false});

            let _amount = BigNumber(result[0]);
            let decimals = BigNumber(10).power(this.state.tokenDecimals)
            _amount = _amount.divide(decimals)


            let _currentAmount = BigNumber(result[4])
            _currentAmount = _currentAmount.divide(decimals)

            let _penalty = BigNumber(result[5])
            _penalty = _penalty.divide(decimals)

            this.setState({
                amountStaked: result[0],
                viewAmount: _amount.toString(),
                wasWithdraw: Boolean(result[1]),
                creationTime: result[2],
                referer: result[3],
                currentAmount: _currentAmount,
                penalty: _penalty,
                infoLoaded: true
            }, () => {
                this.calculateTime()
                this.forceUpdate();
            });

        }).catch( (err) => {
            console.log("Unable fetch Stake (" + this.state.stakeID + "); " + err)
        });
        
    }


    calculateTime(){
        var standardTimeLocked, standardCreationTime
        try{
            standardCreationTime = new Date(this.state.creationTime * 1000);
        }catch(err){
            console.log("Error while processing time")
            return;
        }


        if(Date.now() > standardTimeLocked){
            this.setState({elasped: true,
                           creationTimeString: standardCreationTime.toString()
                         });
        }else{
            this.setState({elasped: false,
                creationTimeString: standardCreationTime.toString(),
              });            
        }

    }




    getPeriods(){
        this.state.contractInstance.methods.calculatePeriods(this.state.stakeID).call().then( (result) => {
            let _periods = Number(result);
            console.log("Periods")
            console.log(result)
            this.setState({
                periods: _periods
            })
        }).catch( (err) => {
            console.log("Unable to fetch periods: " + err)
        })
    }


    calculateGain(){
        let reward = this.state.currentAmount - this.state.amountStaked;

        this.setState({
            gain: reward
        })
    }


    getAlreadyWithdrawed(){
        this.state.contractInstance.methods.getAlreadyWithdrawedAmount(this.state.stakeID).call().then( (result) => {
            console.log(result)
            if(Boolean(result)){
                console.log("Already Withdrawed")
            }else{
                console.log("Availabel to be Withdrawed")
            }
            
        }).catch( (err) => {
            console.log("Unable to fetch periods: " + err)
        })        
    }


    startTimer() {
        this.timer = setInterval(() => {
            this.calculateTime();
        }, 1000)
    }

    //TODO Betterm management of archived stakes

    handleArchivement(){
        this.cookies.set("stake" + this.state.stakeID, "archived", {path: "/"});
        this.archivedCallback();
        this.setState({isArchived: true})
    }


    handleUnarchivement(){
        this.cookies.set("stake" + this.state.stakeID, "unarchived", {path: "/"});
        this.archivedCallback();
        this.setState({isArchived: false})

    }

    isArchived(){
        let string_value = this.cookies.get('stake' + this.state.stakeID)
        let value = (string_value === "archived")
        return value;
    }


    handleWithdraw(){
        this.setState({
            wasWithdraw: true
        })
    }



    handleShowReferer(){
        let currentValue = this.state.showReferer;

        this.setState({
            showReferer: !currentValue
        })
    }


    render(){


        if(this.state.loading){
            return(
                <CircularProgress />
            );
        }


        return (
            
            <Grid
                container
                spacing={1}
                direction="column"
                justify="center"
                alignItems="center"
            >
                <Grid item>
                    <Typography><Trans i18nKey="stake_detail.amountStaked" /> : <b>{this.state.viewAmount}</b></Typography>
                    <Typography><Trans i18nKey="stake_detail.periodElasped" />: <b>{this.state.periods}</b></Typography>
                    <Typography><Trans i18nKey="stake_detail.penalty" />: <b>{this.state.penalty.toString()}</b></Typography>


                    {/*<Typography><Trans i18nKey="stake_detail.gain" />: <b color="green">{this.state.gain}%</b></Typography>*/}
                    <Typography><Trans i18nKey="stake_detail.withdrawed" />: <b>{this.state.wasWithdraw ? "YES" : "NO"}</b></Typography>
                </Grid>

                <Grid item>
                    <Typography color="textSecondary"><Trans i18nKey="stake_detail.creationTime" />: <b>{this.state.creationTimeString}</b></Typography>
                </Grid> 
                <Grid item>
                {!this.state.wasWithdraw ? (
                    <Grid 
                        container
                        spacing={1}
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item>
                            {this.state.infoLoaded && (
                                    <RewardBox
                                        stakeID={this.state.stakeID}
                                        contractInstance={this.state.contractInstance}
                                        account={this.state.accounts[0]}
                                        availableReward={this.state.currentAmount}
                                        tokenDecimals={this.state.tokenDecimals}  
                                    >
                                    </RewardBox>
                            )}
                        </Grid>

                        <Grid item>
                            <WithdrawBox 
                                stakeID={this.state.stakeID} 
                                contractInstance={this.state.contractInstance} 
                                accounts={this.state.accounts}
                                withdrawCallback={this.handleWithdraw}
                                >
                            </WithdrawBox>
                        </Grid>
                    </Grid>

                ) : (

                    <div>
                        {this.isArchived() ? (
                            <Button 
                                variant="outlined" 
                                color="inherit" 
                                onClick={this.handleUnarchivement}
                                startIcon={<UnarchiveIcon />}
                                >
                                    Unarchive
                            </Button>
                        ) : (
                            <Button 
                                variant="outlined" 
                                color="inherit" 
                                onClick={this.handleArchivement}
                                startIcon={<ArchiveIcon />}
                                >
                                    Archive
                            </Button>
                        )}
                    </div>

                )}  
                </Grid>
            </Grid>
        );

    }


}


export default StakingDetail;