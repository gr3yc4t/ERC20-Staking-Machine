import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import StakingEntry from "./StakingEntry"
import AccountInfo from './AccountInfo'
import TokenContext from './TokenContext'



import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import Switch from '@material-ui/core/Switch';

import green from '@material-ui/core/colors/purple';

import Cookies from 'universal-cookie';
import ViewListIcon from '@material-ui/icons/ViewList';

import { translate, Trans } from "react-i18next";

import Grow from '@material-ui/core/Grow'


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    archivedSwitch: {
        color: green[300],
        '&$colorChecked': {
            color: green[500],
            '& + $colorBar': {
            backgroundColor: green[500],
            },
        }
    }
  });


class StakingLister extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInstance: props.contractInstance,
            accounts: props.accounts,
            numberOfStake: -1,
            numberOfActiveStake: 0,
            totalAmountStaked: 0,
            stakingList: "",
            showArchived: false,
            referral: "",
            referralLoaded: false,
            tokenDecimals: props.tokenDecimals,
            tokenSymbol: props.tokenSymbol
        }

        this.cookies = new Cookies();

        this.handleShowArchived = this.handleShowArchived.bind(this)
    }



    componentDidMount(){

        //Listeners
        this.state.contractInstance.events.NewStake().on('data', event => {
            console.log("New Stake - Event Received")
            this.newStakeListener(event);
        });

        this.state.contractInstance.events.StakeWithdraw().on('data', event => {
            console.log("Stake Withdraw - Event Received")
            this.newWithdrawListener(event);
        });


        this.listActiveStake().then( () => {
            this.populateStakingList();
        });
        
        this.getTotalStake();

        this.getActiveStakeNumber();

        this.hasReferral();
    }




    async listActiveStake() {
        
        await this.state.contractInstance.methods.getStakeCount().call().then( (result) => {
            var _numberOfStake = Number(result);
            console.log("Number of stakes: " + _numberOfStake)
            this.setState({numberOfStake: _numberOfStake});
            this.forceUpdate()
        }).catch( (err) => {
            console.log("Unable to list stake; " + err)
        });
        
    }

    async getActiveStakeNumber() {
        
        await this.state.contractInstance.methods.getActiveStakeCount().call().then( (result) => {
            var _numberOfActiveStake = Number(result);
            console.log("Number of active stakes: " + _numberOfActiveStake)
            this.setState({numberOfActiveStake: _numberOfActiveStake});
        }).catch( (err) => {
            console.log("Unable to list active stake; " + err)
        });
        
    }

    async getTotalStake() {
        await this.state.contractInstance.methods.getTotalStakeAmount().call().then( (result) => {
            console.log("getTotalStake: " + result)
            let _totalStake = Number(result);
            this.setState({totalAmountStaked: _totalStake}, () => {

            });
        }).catch( (err) => {
            console.log("Unable to list active stake; " + err)
        });
    }






    newStakeListener(event) {
        this.getTotalStake();
        this.listActiveStake();
        this.updateUI()
    }


    newWithdrawListener(event){
        this.getTotalStake();
        this.listActiveStake();
        this.updateUI()
    }
    

    populateStakingList(){

        let list = []

        for(let i=0; i<this.state.numberOfStake; i++){
            console.log("Staking number " + i)

            let archived
            let archived_string = this.cookies.get('stake' + i)

            console.log(archived_string)

            if(archived_string === "archived"){
                archived = true;
            }else if (archived_string === "unarchived"){
                archived = false;   
            }else{
                //If it not exists set to "unarchived"
                if(typeof this.state.stakeID !== "undefined"){
                    this.cookies.set("stake" + this.state.stakeID, "unarchived", {path: "/"});
                    archived = false;
                }
            }
            
            
            console.log("Is "+ i + " archived? -> " + Boolean(archived)  )




            if(archived && !this.state.showArchived){
                console.log("Detected archived stake at " + i   )
                continue;
            }

            console.log("Pushinng stake : " + i)
            list.push(
                    <StakingEntry 
                        stakeID={i} 
                        contractInstance={this.state.contractInstance} 
                        accounts={this.state.accounts}
                        isArchived={archived}

                        tokenDecimals={this.state.tokenDecimals}
                        tokenSymbol={this.state.tokenSymbol}
                        >
                    </StakingEntry>
            );
        }

        console.log(list)

        this.setState({
            stakingList: list
        })

        this.forceUpdate();
    }



    updateUI(){
        this.listActiveStake().then( () => {
            this.getTotalStake().then( () => {
                this.populateStakingList();
            });
        });
    }


    handleShowArchived(){
        let currentValue = this.state.showArchived

        this.setState({
            showArchived: !currentValue
        })
        this.updateUI();
    }


    async hasReferral(){

        await this.state.contractInstance.methods.hasReferral().call().then( (result) => {
            console.log("Has referral")
            console.log(result);

            let boolResult = Boolean(result);

            if(boolResult){
                this.getReferral();
            }else{
                this.setState({
                    referralLoaded: true,
                    referral: ""
                })
            }

        }).catch( (err) => {
            console.log("Unable to list active stake; " + err)
        });



    }


    async getReferral(){

        await this.state.contractInstance.methods.getMyReferral().call().then( (result) => {
            let myReferral = result
            console.log("Referral: "+ myReferral)
            this.setState({
                    referralLoaded: true,
                    referral: myReferral
            })
        }).catch( (err) => {
            console.log("Fetch referral address; " + err)
        });

    }



    render(){

        const { classes } = this.props;


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
                            <Grid container direction="row" alignItems="center">
                                <ViewListIcon />
                                <Typography variant="h4" component="h4"><Trans i18nKey="staking_list.title" /></Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {this.state.referralLoaded & this.state.numberOfActiveStake !== -1 && (
                                <AccountInfo
                                stakeNumber={this.state.numberOfActiveStake}
                                amountStaked={this.state.totalAmountStaked}
                                referral={this.state.referral}
                                tokenDecimals={this.state.tokenDecimals}
                                ></AccountInfo>
                            )}

                            <Trans i18nKey="staking_list.showArchived" />
                            <Switch
                                checked={this.state.showArchived}
                                onChange={this.handleShowArchived}
                                value={this.state.showArchived}
                                //inputProps={{ 'aria-label': 'secondary checkbox' }}
                                className={classes.archivedSwitch}
                            />               
                        </Grid>
                        <Grid item>
                            {this.state.stakingList === "" ? (
                                <Typography color="textSecondary"><Trans i18nKey="staking_list.noStakePresent" /></Typography>
                            ): (
                                this.state.stakingList
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Grow>
        );

    }


}


StakingLister.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(StakingLister);