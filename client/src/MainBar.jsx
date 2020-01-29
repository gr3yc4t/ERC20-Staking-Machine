import React, { Component } from "react";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid'


import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import Popup from "reactjs-popup";
import Flag from 'react-world-flags'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Trans } from "react-i18next";


const styles = theme => ({
    bar: {
      color: 'orange',
      colorDefault: 'black',
      background : '#2E3B55'
    },
    logo: {
        margin: 10,
    },
    languageButton: {
        background: '#50646e',
        "&:hover, &.Mui-focusVisible": { 
            backgroundColor: "#927b7ba6",
            color: "#000000",
            border: "1 px solid",
            borderColor: "rgba(43, 43, 43, 0.5)",
        }
    }
  });
  

class MainBar extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            isEnglish: true,
            language: 'en',
            modalOpen: false
        }

        this.changeLanguageCallback = this.props.changeLanguageCallback;
        this.handleEnglish = this.handleEnglish.bind(this)
        this.handleItalian = this.handleItalian.bind(this)
        this.handleChinese = this.handleChinese.bind(this)
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({ modalOpen: true });
    }
    closeModal() {
    this.setState({ modalOpen: false });
    }

    handleEnglish(event){
        this.setState({
            isEnglish: true,
            language: 'en'
        })
        this.changeLanguageCallback('en')
        this.closeModal();

    }
    handleItalian(event){
        this.setState({
            isEnglish: false,
            language: 'it'
        })
        this.changeLanguageCallback('it')
        this.closeModal();

    }

    handleChinese(event){
        this.setState({
            isEnglish: false,
            language: 'ch'
        })
        this.changeLanguageCallback('ch')   
        this.closeModal();
     
    }

    render(){

        const { classes } = this.props;

        return(
            <AppBar position="static" className={classes.bar}>
                <Toolbar>
                <IconButton 
                    edge="start"  
                    color="inherit" 
                    aria-label="menu" 
                    onClick={this.props.openMenuCallback('', true)}
                    >
                    <MenuIcon />
                </IconButton>
                <Avatar alt="logo" src="https://www.bitcoincompany.it/wp-content/uploads/2019/08/BITN-Token-RGB-256x256.png" className={classes.logo} />
                <Typography variant="h6" >
                    <b><Trans i18nKey="Title" /></b>
                </Typography>

                <Button 
                    variant="contained"
                    color="secondary"
                    className={classes.languageButton}
                    onClick={this.openModal}
                    style={{
                        marginLeft: "auto",
                        marginRight: -12
                    }}
                    > 
                    Language 
                </Button>
                <Popup
                    open={this.state.modalOpen}
                    modal
                    closeOnDocumentClick
                    onClose={this.closeModal}

                >
                    <Grid 
                        container
                        spacing={1}
                        direction="column"
                        justify="center"
                        alignItems="center">
                            <Grid item>
                                <Button
                                    onClick={this.handleItalian}
                                    > 
                                    ITA
                                    <Flag code="ITA" height="16"/>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={this.handleEnglish}
                                    > 
                                    ENG 
                                    <Flag code="GBR" height="16"/>
                                </Button>                            
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={this.handleChinese}
                                    >
                                    CHN 
                                    <Flag code="CHN" height="16"/>
                                </Button>                            
                            </Grid>

                    </Grid>
                </Popup>

                </Toolbar>
            </AppBar>
        );
    }

}

MainBar.propTypes = {
    classes: PropTypes.object.isRequired,
};




export default withStyles(styles)(MainBar);

/*


                {this.state.isEnglish ? (
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.languageButton}
                        onClick={this.handleItalian}
                        style={{
                            marginLeft: "auto",
                            marginRight: -12
                        }}
                        >
                        ITA
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.languageButton}
                        onClick={this.handleEnglish}
                        style={{
                            marginLeft: "auto",
                            marginRight: -12
                        }}
                        >
                        ENG
                    </Button>                   
                )}


*/