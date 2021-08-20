import { Typography } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/images/logo.png';
import { logout } from '../../redux/actions/usernameActions';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import AccountButtons from './AccountButtons/AccountButtons';

const Navbar: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <Link to="/" className={classes.logoLink}>
          <DeckbayLogo src={logo} alt="Deckbay logo" />
        </Link>
        <SpacingDiv />
        <AccountButtons />
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          className={classes.hamburgerMenu}>
          <MenuIcon />
        </IconButton>

        {/* <Snackbar
          open={loginConfirmation}
          autoHideDuration={5000}
          style={{ marginTop: '50px' }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={() => toggleLoginConfirmation(false)}>
          <MuiAlert elevation={6} variant="filled" severity="success">
            <Typography>Succesfully logged in</Typography>
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={logoutConfirmation}
          autoHideDuration={2500}
          style={{ marginTop: '50px' }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={() => toggleLogoutConfirmation(false)}>
          <MuiAlert elevation={6} variant="filled" severity="success">
            <Typography>Succesfully logged out</Typography>
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={registerConfirmation}
          autoHideDuration={2500}
          style={{ marginTop: '50px' }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={() => toggleRegisterConfirmation(false)}>
          <MuiAlert elevation={6} variant="filled" severity="warning">
            <Typography>
              Check your email in order to complete registration
            </Typography>
          </MuiAlert>
        </Snackbar>  */}
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: theme.palette.primary.dark,
  },

  toolbar: {
    paddingLeft: '10px',
  },

  logoLink: {
    width: '215px',
    [theme.breakpoints.down('xs')]: {
      width: '150px',
    },
  },

  buttonContainer: {
    display: 'flex',
    gap: '10px',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },

  button: {
    '&:hover': {
      backgroundColor: 'grey',
    },
  },

  hamburgerMenu: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      marginLeft: 'auto',
    },
  },

  inputRoot: {
    color: 'inherit',
  },
}));

const DeckbayLogo = styled.img`
  width: 100%;
  height: auto;
  padding-top: 3;
`;

const SpacingDiv = styled.div`
  flex: 1;
`;
