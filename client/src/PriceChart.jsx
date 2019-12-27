import React, { Component } from "react";


import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'


import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
  } from 'recharts';



  class PriceChart extends React.Component{

    constructor (props){
        super(props);

        this.state = {
            web3: props.web3,
            crowdsaleInstance: props.crowdsaleInstance,
            priceData: null
        }

    }


    componentDidMount(){
        this.getHistoricalPriceData();
    }



    getHistoricalPriceData(){

        this.state.crowdsaleInstance.getPastEvents("RateUpdated", {fromBlock: 0, toBlock: 'latest'}).then( (events) => {
            console.log("Past events:");
            //console.log(events)


            let data = []

            events.forEach( (event) => {

                //console.log(event)

                let _blockNumber = event.blockNumber;

                let _rate = event.args.newRate;
                console.log("- " + _blockNumber + " - " + _rate.toString())
                //console.log(event)

                data.push({name: _blockNumber, rate: _rate})

            })

            this.setState({
                priceData: data
            })
        });

    }



    render(){

        return(
            <ResponsiveContainer style={{  width: 800, height: 800}}>
            <LineChart width={600} height={300} data={this.state.priceData}
            margin={{top: 20, right: 30, left: 20, bottom: 10}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" height={60} />
                <YAxis/>
                <Line type="monotone" dataKey="rate" stroke="#8884d8" />
            </LineChart>  
            </ResponsiveContainer>
        )
    }



  }

  export default PriceChart;