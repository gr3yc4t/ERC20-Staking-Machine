import React, { Component } from "react";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Grow from '@material-ui/core/Grow'
import Avatar from '@material-ui/core/Avatar'
//import { Link } from '@material-ui/core';
import { Link } from 'react-router-dom'

import BigNumber from "big-number"


import { Trans } from "react-i18next";


class HomePage extends Component {

    constructor(props){
        super(props)
        this.state = {
            web3: props.web3,
            tokenInstance: props.tokenInstance,
            tokenDecimals: props.tokenDecimals,
            accounts: props.accounts,
            tokenBalance: 0
        }
    }




    componentDidMount(){
        this.getTokenBalance();
    }



    async getTokenBalance(){
        await this.state.tokenInstance.balanceOf(this.state.accounts[0]).then( (response) => {

            let decimals = BigNumber(10).pow(this.state.tokenDecimals)

            let viewBalance = BigNumber(response.toString()).divide(decimals)

            this.setState({tokenBalance: viewBalance.toString()})

        }).catch( (err) =>{
            console.log(err);
        });
    }




    render(){

        return (
            <Grow in={true}>
                <Paper 
                    elevation={4}
                    style={{ padding: 20, margin: 0, backgroundColor: '#fafafa' }}
                    >
                        <Typography variant="h4" component="h4"><Trans i18nKey="HomePage.title" /></Typography>

                        <Grid
                            container
                            spacing={1}
                            direction="column"
                            justify="center"
                            alignItems="center"
                            >
                                <Grid item>
                                    <Typography variant="subtitle1" gutterBottom><Trans i18nKey="HomePage.subtitle" /></Typography>
                                </Grid>
                                <Grid item>
                                    <Avatar alt="logo" src="https://www.bitcoincompany.it/wp-content/uploads/2018/07/Logo-finale-trasparente.png" style={{width: 200, height: 200}}/>
                                </Grid>
                                <Grid item>
                                    <Typography><Trans i18nKey="HomePage.tokenBalance" />: <b>{this.state.tokenBalance}</b></Typography>
                                </Grid>
                                <Grid item>
                                    <Typography><Trans i18nKey="HomePage.stakeToken" /></Typography>
                                    <Button 
                                        variant="outlined" 
                                        component={Link} to="/staking-form"
                                        style={{color: "#303f9f"}}
                                        >
                                            <Trans i18nKey="HomePage.goStaking" />
                                        </Button>
                                </Grid>
                                <Grid item>
                                    <Typography><Trans i18nKey="HomePage.needToken" /></Typography>
                                    <Button     
                                        variant="outlined" 
                                        component={Link} to="/crowdsale"
                                        style={{color: "#303f9f"}}
                                        ><Trans i18nKey="HomePage.goCrowdsale" />
                                    </Button>
                                </Grid>
                        </Grid>
                </Paper>
            </Grow>
        );
    }

}

export default HomePage;