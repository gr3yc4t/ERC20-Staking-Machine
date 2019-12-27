import React, { Component } from "react";
import StakingContract from "./contracts/Staking.json";
import getWeb3 from "./utils/getWeb3";


import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'


class TokenSetup extends Component {



    constructor(props){
        super(props);

        this.state = {
                    callbackTokenSetted: props.callbackSetted,
                    stakingInstance: props.stakingInstance,
                    tokenAddress: "",
                    account: props.account,
                    showSuccessLabel: false
            };

        

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    writeTokenAddress(){

        this.state.stakingInstance.methods.setTokenAddress(this.state.tokenAddress).send({ from: this.state.account }).then((result) =>{
            console.log("Account setted")
            this.setState({showSuccessLabel: true})
            //this.state.callbackTokenSetted(this.state.tokenAddress);

        }).catch( (err) => {
            console.log("Invalid address");
            this.setState({tokenAddress: null})
            return;
        });

    }



    handleChange(event){
        this.setState({tokenAddress: event.target.value})
    }

    handleSubmit(event) {
        console.log("Token Address: " + this.state.tokenAddress);
        event.preventDefault();


        this.writeTokenAddress();
    }
    

    render(){

        return (
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    >
                        <Grid item>
                            <Typography variant="body1" component="h2" color="textSecondary">You must initialized the contract</Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                            required
                            label="Token Address"
                            placeholder="0x000000000000000000000000000"
                            margin="normal"
                            variant="outlined"  
                            onChange={this.handleChange}                          
                            />
                        </Grid>
                        <Grid>
                            <Button variant="contained" color="primary" onClick={this.handleSubmit}>Set Address</Button>
                        </Grid>
                        {this.state.showSuccessLabel && (
                            <Grid item>
                                <Typography variant="body1" component="h2">Success operation, refresh the page</Typography>
                            </Grid>
                        )}

                </Grid>
        )

    }

}


export default TokenSetup;