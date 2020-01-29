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
            newOwner: "",
            potToReturn: 0
        }

        this.web3 = props.web3
        this.handleSubmit = this.handleSubmit.bind(this);
        this.transerOwnership = this.transerOwnership.bind(this);
        this.handleChangeOwner = this.handleChangeOwner.bind(this)

        this.handlePotChange = this.handlePotChange.bind(this);
        this.handleReturnPot = this.handleReturnPot.bind(this);

    }


    componentDidMount(){

        this.setState({
            newOwner: ""
        })

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




    transerOwnership(){
        this.state.contractInterface.methods.transferOwnership(this.state.newOwner).send({ from: this.state.account }).then((result) =>{
            console.log(result)
            
  

        }).catch( (err) =>{
            console.log(err)
            this.props.enqueueSnackbar("Unable to transfer ownership", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
        });
    }


    handleChangeOwner(event){
        var newAddress = event.target.value


        this.setState({
            newOwner: newAddress
        }, () => {
            console.log(this.state.newOwner)
        })

    }


    handleSubmit(event){
        event.preventDefault();
        this.finalShutdown();
    }


    handlePotChange(event){
        var potValue = event.target.value;

        this.setState({
            potToReturn: potValue
        }, () => {
            console.log(this.state.potToReturn)
        })

    }


    handleReturnPot(event){
        event.preventDefault();


        this.state.contractInterface.methods.returnPot(this.state.potToReturn).send({ from: this.state.account }).then((result) =>{
            console.log(result)
            this.props.enqueueSnackbar("Pot returned", {
                variant: 'info',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });

        }).catch( (err) =>{
            console.log(err)
            this.props.enqueueSnackbar("Unable to withdraw from pot", {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                },
            });
        });

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
                                <Grid item>
                                    <TextField value={this.state.newOwner} onChange={this.handleChangeOwner}></TextField>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={this.transerOwnership}>Transfer Ownership</Button>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" component="h3">Chose the amount to withdraw from the pot</Typography>
                                    <TextField value={this.state.potToReturn} onChange={this.handlePotChange}></TextField>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="secondary" onClick={this.handleReturnPot}>Return Pot</Button>
                                </Grid>
                        </Grid>
                            
                    </Paper>
            </Grow>
            
        );

    }
}

export default withSnackbar(FinalShutdownBox);
