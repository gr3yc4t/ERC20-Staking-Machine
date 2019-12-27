import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";


import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import { Typography } from "@material-ui/core";

class StakeTimeSelector extends Component{

    constructor(props){
        super(props);

        this.state = {
            onSelectCallback: props.onSelect,
            timeToLock: 0,
            gain: 0

        }


        this.handleSelector = this.handleSelector.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }



    handleSelector(event){
        var inputTime = Number(event.target.value)

        this.setState({timeToLock: inputTime},
            () => {

                switch(this.state.timeToLock){

                    case 0:
                        console.log("DEBUG TIME INSERTED");
                        this.setState({gain: 999});
                        break;
                    case 2592000:
                        this.setState({gain: 15})
                        break;
                    case 7776000:
                        this.setState({gain: 18})
                        break;
                    case 15552000:
                        this.setState({gain: 20})
                        break;    
                    case 31536000:
                            this.setState({gain: 20})
                            break;                        
                    default:
                        this.setState({gain: 15})
                        break;
                }

                this.state.onSelectCallback(this.state.timeToLock)   
        });



    }


    handleSubmit(event){
        event.preventDefault()

        this.state.onSelectCallback(this.state.timeToLock)
    }


    render(){
        return(
            <div>
                <Grid container
                    spacing={1}
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item>

                    </Grid>
                    <Grid item>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Time to lock</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.timeToLock}
                                onChange={this.handleSelector}
                                >
                                    <MenuItem value={0}>DEBUG</MenuItem>
                                    <MenuItem value={2592000}>1 months</MenuItem>
                                    <MenuItem value={7776000}>3 months</MenuItem>
                                    <MenuItem value={15552000}>6 months</MenuItem>
                                    <MenuItem value={31536000}>12 months</MenuItem>
                            </Select>
                            <FormHelperText>Time to lock</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" component="p">Gain: <b>{this.state.gain}%</b></Typography>
                    </Grid>
                </Grid>
            </div>
        );
    }

}


export default StakeTimeSelector;