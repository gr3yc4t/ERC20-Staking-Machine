import React, { Component } from "react";
import TextField from "@material-ui/core/TextField"
import BigNumber from "big-number"

class TokenAmountTextBox extends Component{

    constructor(props){
        super(props);

        this.state = {
            decimals: props.decimals,
            amount: props.amount,
            viewAmount: 0
        }

        this.onChange = props.onChange;
        this.handleChange = this.handleChange.bind(this)
    }


    initializeViewAmount(){
        if(this.state.amount !== 0){
            
        }
    }


    calcRealAmount(_inputAmount){
        //try{
            var decimals = BigNumber(10).pow(this.state.decimals);
            var amount = BigNumber(_inputAmount);

            var result = amount.multiply(decimals)
            return result;
        //}catch(error){
        //    console.log("Unable to calculate the correct real amount;" + error)
        //}
    }

    calcViewAmount(_inputAmount){
        try{
            var decimals = BigNumber(10).pow(this.state.decimals);
            var amount = BigNumber(_inputAmount);
    
            var result = amount.divide(decimals)
            return result;
        }catch(error){
            console.log("Unable to calculate the correct view amount;" + error)
            return 0;
        }
    }


    handleChange(event){
        var input = event.target.value;
        var realAmount = this.calcRealAmount(input);
        console.log("REAL: " + realAmount.toString())
        this.setState({
            amount: realAmount,
            viewAmount: input
        });

        this.onChange(realAmount);
    }   


    render(){

        return(
            <TextField 
                value={this.state.viewAmount} 
                onChange={this.handleChange}
                label={this.props.label}
                margin="normal"
                placeholder={this.props.placeholder}
                variant={this.props.variant}>
            </TextField>
        );

    }
}


export default TokenAmountTextBox;