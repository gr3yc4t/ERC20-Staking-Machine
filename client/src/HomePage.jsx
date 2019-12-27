import React, { Component } from "react";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Grow from '@material-ui/core/Grow'
import Avatar from '@material-ui/core/Avatar'
import Link from '@material-ui/core/Link'

import BigNumber from "big-number"


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
            console.log(response);

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
                        <Typography variant="h4" component="h4">Welcome</Typography>

                        <Grid
                            container
                            spacing={1}
                            direction="column"
                            justify="center"
                            alignItems="center"
                            >
                                <Grid item>
                                    <Typography variant="subtitle1" gutterBottom>Start using your the BITN staking machine now</Typography>
                                </Grid>
                                <Grid item>
                                    <Avatar alt="logo" src="https://www.bitcoincompany.it/wp-content/uploads/2018/07/Logo-finale-trasparente.png" style={{width: 200, height: 200}}/>
                                </Grid>
                                <Grid item>
                                    <Typography>Token balance: <b>{this.state.tokenBalance}</b></Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>Stake your token now!!</Typography>
                                    <Button variant="outlined" component={Link} to="/staking-form">Go to the staking page</Button>
                                </Grid>
                        </Grid>
                </Paper>
            </Grow>
        );
    }

}

export default HomePage;