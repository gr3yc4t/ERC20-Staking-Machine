import React, { Component } from "react";

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';


import BigNumber from 'big-number'

import { Trans } from "react-i18next";

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    box: {
        color: 'orange',
        colorDefault: 'black',
        background : '#2e3b55d6',
        borderRadius: 15,
        border: 2,
        padding: 20, 
        margin: 0, 
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
  });

class StakeInfo extends Component{

    constructor(props){
        super(props);

        this.state = {
            viewAmount: 0,
            referral: props.referral,
            amountStaked: props.amountStaked,
            numberOfStake: props.stakeNumber,
            tokenDecimals: props.tokenDecimals,
            hasReferral: true
        }

        console.log(props)
    }


    componentDidMount(){
        let _amount = BigNumber(this.props.amountStaked);
        let decimals = BigNumber(10).power(this.state.tokenDecimals)
        _amount = _amount.divide(decimals)

        
        let _referral = ""

        if(this.props.referral === ""){
            this.setState({
                referral: "No",
                hasReferral: false
            })
        }

        this.setState({
            viewAmount: _amount.toString(),
        })

    }

/*

                <Grid item>
                    {this.state.referer === "0x0000000000000000000000000000000000000001" ? (
                        <Typography color="textSecondary">Referer: <b>No</b></Typography>
                    ) : (
                        <Typography color="textSecondary">Referer: <Button onClick={this.handleShowReferer}>{refButton}</Button></Typography>
                    )}
                </Grid>
                <Grid item>
                    {this.state.showReferer && (
                        <TextField
                            label="Referer Address"

                            value={this.state.referer}>
                        </TextField>
                    )}
                </Grid>

*/


    render(){

        const { classes } = this.props;


        return(
            <Paper
            elevation={4}
            className={classes.box}>
                    <Typography variant="body1" component="p"><Trans i18nKey="account_info.totalAmount" />: <b>{this.state.viewAmount}</b></Typography>
                    <Typography variant="body1" component="p"><Trans i18nKey="account_info.numberOfActiveStake" />: <b>{this.state.numberOfStake}</b></Typography>
                    <Typography variant="body1" component="p">
                        <Trans i18nKey="account_info.noReferralPresent" />: 
                            {this.state.hasReferral ? (
                                <TextField value={this.state.referral}></TextField>
                            ) : (
                                <b> No</b>
                            )}

                        </Typography>

            </Paper>
        )

    }


}


StakeInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StakeInfo);