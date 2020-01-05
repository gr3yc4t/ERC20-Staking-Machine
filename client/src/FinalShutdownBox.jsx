import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress';

import Grow from '@material-ui/core/Grow';


import { withSnackbar } from 'notistack';


import BigNumber from "big-number"


//TODO: Handle multiple accounts


class FinalShutdownBox extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInterface: this.props.contractInterface,
            account: this.props.account,
            stakingAddress: props.stakingAddress,
            loading: false,
        }

        this.web3 = props.web3
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    componentDidMount(){

    }

    componentWillUnmount(){
        //TODO Unsubscribe the "Pot Deposit Listener"
    }



    finalShutdown(){

        this.state.contractInterface.methods.finalShutdown().send({ from: this.state.account }).then((result) =>{
            console.log(result)
            this.props.enqueueSnackbar("Final shutdown executed", {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });            
  

        }).catch( (err) =>{
            console.log(err)
            this.props.enqueueSnackbar("Unable to call the final shutdown", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
        });
    }




    handleSubmit(event){
        event.preventDefault();
        this.finalShutdown();
    }


    render(){

        return (
            <Grow in={true}>
                <Paper 
                    elevation={4}
                    style={{ padding: 20, margin: 0, backgroundColor: '#fafafa' }}
                    >
                        <Typography variant="h4" component="h4">Final Shutdown Box</Typography>

                        <Grid
                            container
                            spacing={1}
                            direction="column"
                            justify="center"
                            alignItems="center"
                            >
                                <Grid item>
                                    <Typography variant="body1" component="h3">Press the button to start the final shutdown on {this.state.stakingAddress}</Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="secondary" onClick={this.handleSubmit}>Final Shutdown</Button>
                                </Grid>
                        </Grid>
                            
                    </Paper>
            </Grow>
            
        );

    }
}

export default withSnackbar(FinalShutdownBox);
