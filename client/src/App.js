import React, { Component } from "react";
import StakingContract from "./contracts/Staking.json";
import BitcoinCompanyNetworkTestToken from "./contracts/BitcoinCompanyNetworkTestToken.json"

import getWeb3 from "./utils/getWeb3";

import "./App.css";

import OwnerPanel from "./OwnerPanel"
import UserBox from "./UserBox"
import TokenContext from './TokenContext'
import TokenSetup from "./TokenSetup"
import Web3ErrorPage from "./Web3ErrorPage"

import 'typeface-roboto';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'

import Box from '@material-ui/core/Box';


import { translate, Trans } from "react-i18next";


import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";



const styles = theme => ({
  appBackgroud: {
      background: 'linear-gradient(#8c8281 30%, #FFFFFF)',
      borderRadius: 3,
      border: 0,
      color: 'white',
  },
});



class App extends Component {

  constructor(props){
    super(props);
    this.state = { 
      web3: null,   //TODO Remove web3 from the state
      accounts: null, 
      StakingInstance: null, 
      StakingAddress: null,
      isOwner: false,
      approved: false,
      isTokenSet: false,
      tokenAddress: null, 
      tokenInstance: null ,
      tokenDecimals: null,
      tokenName: null,
      tokenSymbol: null,
      tokenLoaded: false,
      error: false,
      menuOpened: false,
      menuCallback: null,
      language: 'en',
      callbackLanguage: this.props.i18n.changeLanguage,
      web3Unavailable: false    //Used when a browser that does not support web3 is detected
    };




    //this.stakingAddress = "0xC89Ce4735882C9F0f0FE26686c53074E09B0D550"
    //Mainnet
    this.stakingAddress = "0x6d9F3Cd627a5c9a65b3a5A6C94F061ef6cA43002"
    //Rinkeby
    //this.stakingAddress = "0xbE186FbAC291c332342F2463338789Ffe2095fB5"


    this.openMenuCallback = this.openMenuCallback.bind(this)
    this.languageChanged = this.languageChanged.bind(this)

  }




  componentDidMount = async () => {

    try {
      // Get network provider and web3 instance.
      const _web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const _accounts = await _web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await _web3.eth.net.getId();
      const deployedNetwork = StakingContract.networks[networkId];

      if(deployedNetwork === null){
        alert("Unable to detect the staking contract")
      }


      _web3.eth.defaultAccount = _accounts[0];
      //console.log("Staking Address: " + deployedNetwork.address)

      const instance = new _web3.eth.Contract(
        StakingContract.abi,
        this.stakingAddress,
      );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
         web3: _web3, 
         accounts: _accounts, 
         StakingInstance: instance, 
         StakingAddress: this.stakingAddress,
        }, () => {
          this.handleContractRole();

          this.checkToken().then( () => {
            if(this.state.isTokenSet === true){
              console.log("The token is setted, fetching the address...")

              this.getTokenAddress().then( (res) => {

                if(this.state.tokenAddress !== null){
                  console.log("Fetching the token info")
                  this.loadTokenInfo().then( () => {
                  });
                }
              });
            }
          })
      });
    
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      alert(error)
      console.error(error);
    }
  };


  handleContractRole = async() => {
    console.log("Checking which role has the client wallet...")

    this.state.StakingInstance.methods.isOwner().call().then( (response) => {
      
      if( response === true){
        console.log("The current account is the owner of the contract")
        this.setState({ isOwner: true })
      }else{
        console.log("The current account is NOT the owner of the contract")
        this.setState({ isOwner: false })        
      }

    });


  }



  checkToken = async () => {
    console.log("Checking if the token address is already setted...")
    // Get the value from the contract to prove it worked.
    await this.state.StakingInstance.methods.isTokenSet().call().then( (response) => {
      console.log("Response: " + response)
      if(response === true){
        this.setState({
          isTokenSet: true
        });
        return true;
      }else{
        this.setState({
          isTokenSet: false
        });        
        return false;
      }
    }).catch( (error) => {
      console.log("Unable to check if the token is set")
      return false;
    });
  };


  getTokenAddress = async () => {
    const address = await this.state.StakingInstance.methods.getTokenAddress().call();
    console.log("Fetched token address: " + address);
    
    
    if(typeof address === 'undefined'){
      console.log("Unable to load the correct address")
      this.setState({error: true});
      return false;
    }


    this.setState({tokenAddress: address});
    return true;

  };

  loadTokenInfo = async () => {

    //TODO Create a web3 instance from the token Address and call ERC20 functions
    //Then save it into the context

    const contract = require('truffle-contract')
    const tokenContract = contract(BitcoinCompanyNetworkTestToken)
    tokenContract.setProvider(this.state.web3.currentProvider)

    
    await tokenContract.at(this.state.tokenAddress) //Address of the contract, obtained from Etherscan
    .then(instance => {
      var tokenContractInstance = instance
      this.setState({tokenInstance: tokenContractInstance}, async () =>{ 

        this.state.tokenInstance.decimals.call().then( (res) => {
          console.log("Token Decimals : " + res)
          this.setState({tokenDecimals: Number(res)}, () => {


            this.state.tokenInstance.name.call().then( (name) => {
              console.log("Token Name : " + name)
              this.setState({tokenName:name}, () => {

                this.state.tokenInstance.symbol.call().then( (symbol) => {
                  console.log("Token Symbol : " + symbol)
                  this.setState({tokenSymbol: symbol}, () => {

                    this.isTokenLoaded()
                  });
                })


              });
            })

          });
        })





      });
      console.log("Token Contract - Contract Instantiated from " + this.state.tokenAddress);

    }).catch( (err) => {
      console.log("Unable ot load the Token Address Contract")
    })


  }


  isTokenLoaded(){
    if(
        this.state.tokenDecimals !== null &&
        this.state.tokenName !== null &&
        this.state.tokenSymbol !== null &&
        this.state.tokenInstance !== null
      ){
        console.log("Token Loaded")
        this.setState({tokenLoaded: true})
      }
  }


  openMenuCallback(){
    this.setState({menuOpened: true})
  }


  languageChanged(_language){
    this.setState({
      language: _language
    })
    this.props.i18n.changeLanguage(_language)
  }


  render() {

    const { classes } = this.props;



    //Handle browser that does not support web3
    if(this.state.web3Unavailable){
      return(
        <Web3ErrorPage />
      );
    }



    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let body;


    if(this.state.isOwner){

      if(this.state.isTokenSet && this.state.tokenLoaded){
        body = (
          <div>
            <Typography variant="h4" component="h2" gutterBottom>Owner Panel</Typography>
                       
            <TokenContext.Provider
                    value={{
                      accounts: this.state.accounts,
                      address: this.state.tokenAddress,
                      instance: this.state.tokenInstance,
                      decimals: this.state.tokenDecimals,
                      name: this.state.tokenName,
                      symbol: this.state.tokenSymbol,
                      stakingInstance: this.state.StakingInstance,
                      stakingAddress: this.state.StakingAddress,
                      web3: this.state.web3
                    }}
              >
                <OwnerPanel 
                  accounts={this.state.accounts} 
                  stakingInstance={this.state.StakingInstance}
                  stakingAddress={this.state.StakingAddress}
                  web3={this.state.web3}>
                </OwnerPanel>
            </TokenContext.Provider>
          </div>
        );
      }else{
        body = (
          <TokenSetup 
            stakingInstance={this.state.StakingInstance} 
            account={this.state.accounts[0]}
            callbackSetted={this.checkToken}>
          </TokenSetup>
        )
      }

    }else{

      if(this.state.tokenLoaded && this.state.tokenLoaded){

        body = (
          <Router>
            <TokenContext.Provider
              value={{
                web3: this.state.web3,
                accounts: this.state.accounts,
                address: this.state.tokenAddress,
                instance: this.state.tokenInstance,
                decimals: this.state.tokenDecimals,
                name: this.state.tokenName,
                symbol: this.state.tokenSymbol,
                stakingInstance: this.state.StakingInstance,
                stakingAddress: this.state.StakingAddress,
              }}
            >
                <UserBox 
                  accounts={this.state.accounts} 
                  contractInstance={this.state.StakingInstance}
                  stakingAddress={this.state.StakingAddress}
                  tokenAddress={this.state.tokenAddress}
                  web3={this.state.web3}
                  changeLanguageCallback={this.languageChanged}
                  >
                </UserBox>
            </TokenContext.Provider>
          </Router>
        );
      }else{
        body = (
          <div>
            <Container maxWidth="sm">
              <Grid container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="h4" component="h2" gutterBottom>BITN Staking Machine</Typography>
                </Grid>
                <Grid item>
                  <Avatar alt="logo" src="https://www.bitcoincompany.it/wp-content/uploads/2018/07/Logo-finale-trasparente.png" style={{width: 200, height: 200}}/>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" component="p" color="textSecondary" gutterBottom> Loading user panel...</Typography>
                  <CircularProgress></CircularProgress>
                </Grid>
              </Grid>
            </Container>

          </div>
        );        
      }



    }





    return (
      <div className="App">
        <Box className={classes.appBackgroud}>
          {body}
        </Box>
      </div>
    );
  }
}



App.propTypes = {
  classes: PropTypes.object.isRequired,
};



export default withStyles(styles)(App);
