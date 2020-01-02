import React, { Component } from "react";



import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions';


import HelpIcon from '@material-ui/icons/Help';

import { Trans } from "react-i18next";

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Link from '@material-ui/core/Link'

const styles = theme => ({
    helpButton: {
        background: '#50646e',
        color: "#efeded",
        border: "1 px solid",
        borderColor: "rgba(43, 43, 43, 0.5)",
        "&:hover, &.Mui-focusVisible": { 
            backgroundColor: "#927b7ba6",
            color: "#000000",
            border: "1 px solid",
            borderColor: "rgba(43, 43, 43, 0.5)",
        }
    }
  });


class ApproveInfo extends React.Component{

    constructor (props){
        super(props);

        this.state = {
            open: false
        }

        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }


    handleClickOpen() {
        this.setState({
            open: true
        })
    }


    handleClose(){
        this.setState({
            open: false
        })
    }


    render(){

        const { classes } = this.props;


        return(
            <div>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={this.handleClickOpen}
                    startIcon={<HelpIcon />}
                    className={classes.helpButton}
                >
                   <Trans i18nKey="staking_form.helpButton" />
                </Button>
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={this.state.open}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        ERC20 "Allowance"
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            <Trans i18nKey="help.p1" />
                        </Typography>
                        <Typography gutterBottom>
                            <Trans i18nKey="help.p2" />
                        </Typography>
                        <Typography gutterBottom>
                            <Trans i18nKey="help.p3" />
                        </Typography>
                        <Typography gutterBottom>
                            <Trans i18nKey="help.p4" />
                        </Typography>
                        <Typography gutterBottom>
                            <Link href="https://tokenallowance.io/it/index.html"><Trans i18nKey="help.linkText" /></Link>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.handleClose} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );

    }






}


ApproveInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(ApproveInfo);