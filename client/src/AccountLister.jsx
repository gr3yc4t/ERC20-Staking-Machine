import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";



class AccountLister extends Component{

    constructor(props){
        super(props);

        this.state = {
            accounts: props.accounts,
            selectedAccount: props.accounts[0],
            callback: props.callback
        }


        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }


    handleChange = (event) =>{
        let selectedValue = event.target.value;
        this.props.callback(selectedValue);
    }


    handleSubmit(event){
        event.preventDefault();

        this.state.callback(event.target.value)
    }




    render(){

        const accountList = this.state.accounts.map((account) =>
            <option
                key={account}
                value={account}>
                {account}
            </option>

        );



        return (
            <div>
                <select name="accountSelector" onChange={this.handleChange}>
                    <option>Select Account where you want to withdraw</option>
                    {accountList}
                </select>
            </div>
        );

    }


}


export default AccountLister;