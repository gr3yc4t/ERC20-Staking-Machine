import React, { Component } from "react";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'


class Web3ErrorPage extends Component {

    constructor(props){

    }


    render(){

        return (
            <Grid container>
                <Grid item>
                    <Typography>Your browser currently not support this Dapp</Typography>
                </Grid>
                <Grid item>
                    <Typography>Desktop Browser: Parity, Mist, Brave</Typography>
                </Grid>
                <Grid item>
                    <Typography>Android Browser: Metamask, imToken, Trust Wallet</Typography>
                </Grid>
                <Grid item>
                    <Typography>iOS Browser: imToken, Metamask</Typography>
                </Grid>
            </Grid>
        );
    }

}

export default Web3ErrorPage;