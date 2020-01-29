import React, { Component } from "react";

import StakingPanel from "./StakingPanel"
import ReferralBox from "./ReferralBox"
import TokenContext from './TokenContext'
import StakingLister from './StakingLister'
import CrowdsalePanel from './CrowdsalePanel'
import HomePage from './HomePage'
import TestingBox from './TestingBox'
import AccountStatus from "./AccountStatus"

import MainBar from "./MainBar"
import MachineState from './MachineState'
import ApproveTransfer from './ApproveTransfer'

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Avatar from '@material-ui/core/Avatar'

import HowToVoteIcon from '@material-ui/icons/HowToVote';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HomeIcon from '@material-ui/icons/Home';

import { Trans } from "react-i18next";

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
        background: 'linear-gradient(45deg, #8c8281 10%, #ebd7d5 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        //height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
  });

/**
 * @brief Component responsible of managing the contract User's feature
 * 
 * Interface for the contract's user feature, like depositing in the pot.
 * 
 * It should be displayed only if the fetched account is the user of the contract
 */
class UserBox extends Component{

    constructor(props){
        super(props);

        this.state = {
            web3: props.web3,
            stakingInstance: props.contractInstance,
            accounts: props.accounts,
            tokenAddress: null, 
            stakingAddress: props.stakingAddress,
            menuOpened: false,
        }
        
        this.toggleDrawer = this.toggleDrawer.bind(this)

    }



    

    toggleDrawer = (view, open) => event => {
            if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                return;
              }

              this.setView(view, open)
    }




    componentDidMount(){
        this.getTokenAddress();
    }


    setView(view, open){
        let _view

        if(view === null){
            _view = this.state.currentView
        }else{
            _view = view
        }
        

        this.setState({ 
            menuOpened: open,
            currentView: _view
        });
    }

    async getTokenAddress() {
        console.log("Asking for token address")
        const response = await this.state.stakingInstance.methods.getTokenAddress().call();
        console.log("Fetched token address: " + response);
        this.setState({tokenAddress: response});
        return response;
    };



       



    render(){

        const { classes } = this.props;


        return(
            <div>
                <MainBar
                    openMenuCallback={this.toggleDrawer}
                    changeLanguageCallback={this.props.changeLanguageCallback}
                ></MainBar>
                <Container maxWidth="md" style={{padding: 6}}>
                    <SwipeableDrawer
                        open={this.state.menuOpened}
                        onClose={this.toggleDrawer('', false)}
                        onOpen={this.toggleDrawer('', true)}
                    >
                        <List>
                            <ListItem >
                                <Avatar alt="logo" src="https://www.bitcoincompany.it/wp-content/uploads/2019/08/BITN-Token-RGB-256x256.png" style={{margin:10}} />
                                <ListItemText primary={<Trans i18nKey="sideMenu.menuTitle" />} />
                            </ListItem>
                            <ListItem button component={Link} to="/" onClick={this.toggleDrawer('', false)}>
                                <ListItemIcon><HomeIcon /></ListItemIcon>
                                <ListItemText primary={<Trans i18nKey="sideMenu.homeEntry" />} />
                            </ListItem>
                            <ListItem button component={Link} to="/staking-form" onClick={this.toggleDrawer('', false)}>
                                <ListItemIcon><HowToVoteIcon /></ListItemIcon>
                                <ListItemText primary={<Trans i18nKey="sideMenu.stakingForm" />} />
                            </ListItem>
                            <ListItem button component={Link} to="/stake-list" onClick={this.toggleDrawer('', false)}>
                                <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                                <ListItemText primary={<Trans i18nKey="sideMenu.stakeList" />} />
                            </ListItem>
                            <ListItem button component={Link} to="/referrals" onClick={this.toggleDrawer('', false)}>
                                <ListItemIcon><CardGiftcardIcon /></ListItemIcon>
                                <ListItemText primary={<Trans i18nKey="sideMenu.referrals" />} />
                            </ListItem>
                            <Divider />
                            <ListItem button component={Link} to="/crowdsale" onClick={this.toggleDrawer('', false)}>
                                <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
                                <ListItemText primary={<Trans i18nKey="sideMenu.crowdsaleEntry" />} />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <TokenContext.Consumer>
                                    {context => (
                                        <MachineState
                                            contractInterface={this.state.stakingInstance}
                                            tokenDecimals={context.decimals}
                                        />
                                    )}
                                    </TokenContext.Consumer>
                            </ListItem>
                            <Divider />
                            <ListItem>
                            <TokenContext.Consumer>
                                    {context => (
                                        <AccountStatus
                                            web3={this.state.web3}
                                            tokenInstance={context.instance}
                                            tokenDecimals={context.decimals}
                                            accounts={this.state.accounts}
                                        />
                                    )}
                                    </TokenContext.Consumer>
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={this.toggleDrawer(null, false)}>
                                <ListItemIcon><InboxIcon /></ListItemIcon>
                                <ListItemText primary={<Trans i18nKey="sideMenu.closeEntry" />} />
                            </ListItem>
                        </List>
                    </SwipeableDrawer>
                    {this.state.tokenAddress !== null ? (
                        <Grid
                        container
                        spacing={5}
                        direction="column"
                        justify="center"
                        alignItems="center"
                        >

                            <Switch>
                                <Route path="/staking-form">
                                    <TokenContext.Consumer>
                                        {context => (
                                            <div>
                                                <Grid item>
                                                    <ApproveTransfer 
                                                        tokenAddress={context.address}
                                                        tokenName={context.name}
                                                        tokenSymbol={context.symbol}
                                                        decimals={context.decimals}
                                                        tokenInstance={context.instance}
                                                        accounts={this.state.accounts}
                                                        stakingAddress={this.state.stakingAddress}
                                                        web3={this.state.web3}>
                                                    </ApproveTransfer>
                                                </Grid>
                                                <Grid item>
                                                    <StakingPanel
                                                        contractInterface={this.state.stakingInstance} 
                                                        accounts={this.state.accounts}
                                                        

                                                        stakingAddress={this.state.stakingAddress}
                                                        web3={this.state.web3}
                                                        >
                                                    </StakingPanel>
                                                </Grid>
                                            </div>
                                        )}
                                    </TokenContext.Consumer>
                                </Route>
                                <Route path="/testing">
                                    <TokenContext.Consumer>
                                        {context => (
                                            <Grid item>

                                            <TestingBox
                                                contractInterface={this.state.stakingInstance} 
                                                accounts={this.state.accounts}
                                                tokenAddress={context.address}
                                                tokenDecimals={context.decimals}
                                                tokenInstance={context.instance}

                                                stakingAddress={this.state.stakingAddress}
                                                web3={this.state.web3}
                                                >
                                            </TestingBox>

                                            </Grid>
                                        )}
                                    </TokenContext.Consumer>
                                </Route>
                                <Route path="/referrals">
                                    <TokenContext.Consumer>
                                        {context => (
                                           <Grid item>

                                            <ReferralBox 
                                                contractInstance={this.state.stakingInstance} 
                                                account={this.state.accounts[0]}
                                                tokenDecimals={context.decimals}>
                                            </ReferralBox>
                                           </Grid>
                                        )}
                                    </TokenContext.Consumer>
                                </Route>
                                <Route path="/stake-list">
                                    <TokenContext.Consumer>
                                    {context => (
                                        <Grid item>
                                        <StakingLister 
                                            contractInstance={this.state.stakingInstance} 
                                            accounts={this.state.accounts}
                                            tokenDecimals={context.decimals}>
                                        </StakingLister>
                                        </Grid>
                                    )}
                                    </TokenContext.Consumer>
                                </Route>
                                <Route path="/crowdsale">
                                    <TokenContext.Consumer>
                                    {context => (
                                        <Grid item>
                                        <CrowdsalePanel
                                            web3={this.state.web3}
                                            tokenDecimals={context.decimals}
                                        ></CrowdsalePanel>
                                        </Grid>
                                    )}
                                    </TokenContext.Consumer>
                                </Route>
                                <Route path="/">
                                    <TokenContext.Consumer>
                                        {context => (
                                            <Grid item>
                                            <HomePage
                                                web3={this.state.web3}
                                                tokenInstance={context.instance}
                                                tokenDecimals={context.decimals}
                                                accounts={this.state.accounts}

                                            />
                                            </Grid>
                                        )}
                                    </TokenContext.Consumer>
                                </Route>
                            </Switch>
                        </Grid>
                ) : (
                    <p>Loading token contract...</p>
                )}
                </Container>
            </div>
        );
    }




}



UserBox.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(UserBox);