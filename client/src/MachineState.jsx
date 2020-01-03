import React, { Component } from "react";


import Typography from '@material-ui/core/Typography';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid'
import PieChart from 'react-minimal-pie-chart';


import BigNumber from 'big-number'

import { Trans } from "react-i18next";

class MachineState extends Component{

    constructor(props){
        super(props);

        this.state = {
            contractInterface: props.contractInterface,
            tokenDecimals: props.tokenDecimals,
            machineState: 0,
            statePercentpercentState: 0,
            loading: false
        }
    }

    componentDidMount(){
        this.getMachineState();
    }


    async getMachineState(){
        this.setState({loading: true});

        await this.state.contractInterface.methods.getMachineState().call().then( (rawResult) => {

            let decimals = BigNumber(10).power(this.state.tokenDecimals);
            let maxSupply = BigNumber(50000000);

            let normalAmount = BigNumber(rawResult).divide(decimals)
            let realAmount = normalAmount.toString();

            let statePercent = normalAmount.multiply(100).div(maxSupply)
            console.log(statePercent.toString())

            console.log("Machine state : " + realAmount);
            this.setState({
                machineState: realAmount,
                statePercent: statePercent.toString(),
                loading: false
            });

        }).catch( (err) => {
            console.log(err);
            this.setState({loading: false})
        });  
    
    }



    render(){

        return(
            <div>
                {this.state.loading ? (
                    <div>
                        <Typography><Trans i18nKey="sideMenu.loadingMachineState" />...</Typography>
                        <CircularProgress />
                    </div>
                ) : (
                        <Grid 
                            contaier
                            direction="column"
                            justify="space-around"
                            alignItems="stretch">
                            <Grid item>
                                <Typography><Trans i18nKey="sideMenu.machineState" />: {this.state.machineState}</Typography>
                            </Grid>
                            <Grid item>
                                <Grid
                                    container
                                    direction="column"
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <Grid item>
                                        <Typography>{this.state.statePercent}% <Trans i18nKey="sideMenu.machineAvailableAmount" /></Typography>         
                                    </Grid>
                                    <Grid item>
                                        <PieChart
                                            style={{width: "6em"}}
                                            data={[
                                                { title: 'Available', value: Number(this.state.statePercent), color: '#E38627' },
                                                { title: 'Supplied', value: 100-Number(this.state.statePercent), color: '#A28127' },
                                            ]}
                                            />
                                    </Grid>
                                </Grid>

                       
                            </Grid>
                        </Grid>
                )}
            </div>
        )
    }




}


export default MachineState;
