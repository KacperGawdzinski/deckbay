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

import logo from '../../assets/images/logo.png';
import { logout } from '../../redux/actions/usernameActions';
import { RootState } from '../../redux/reducers';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';

export default function Navbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openLoginModal, toggleLoginModal] = useState(false);
  const [openRegisterModal, toggleRegisterModal] = useState(false);
  const [loginConfirmation, toggleLoginConfirmation] = useState(false);
  const [registerConfirmation, toggleRegisterConfirmation] = useState(false);
  const [logoutConfirmation, toggleLogoutConfirmation] = useState(false);
  const username = useSelector((state: RootState) => state.username);

  const handleClickOpenLogin = () => {
    toggleLoginModal(true);
  };

  const handleClickOpenRegister = () => {
    toggleRegisterModal(true);
  };

  const handleClickLogout = () => {
    toggleLogoutConfirmation(true);
    dispatch(logout());
  };

  return (
    <AppBar position="static" className={classes.background}>
      <Toolbar style={{ paddingLeft: '10px' }}>
        <Link to="/">
          <img src={logo} alt="Deckbay logo" className={classes.logo} />
        </Link>
        <div style={{ flexGrow: 1 }} />
        {username ? (
          <div className={classes.buttonContainer}>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              endIcon={<AccountCircleIcon />}>
              <Typography>{username}</Typography>
            </Button>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={handleClickLogout}>
              <Typography>Log out</Typography>
            </Button>
          </div>
        ) : (
          <div className={classes.buttonContainer}>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={handleClickOpenLogin}>
              <Typography>Login</Typography>
            </Button>
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={handleClickOpenRegister}>
              <Typography>Register</Typography>
            </Button>
          </div>
        )}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          className={classes.hamburgerMenu}>
          <MenuIcon />
        </IconButton>
        <LoginModal
          open={openLoginModal}
          setOpen={toggleLoginModal}
          toggleLoginConfirmation={toggleLoginConfirmation}
        />
        <RegisterModal
          open={openRegisterModal}
          setOpen={toggleRegisterModal}
          setWarning={toggleRegisterConfirmation}
        />
        <Snackbar
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
        </Snackbar>
      </Toolbar>
    </AppBar>
  );
}

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.primary.dark,
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

  logo: {
    width: '215px',
    height: 'auto',
    paddingTop: 3,
    [theme.breakpoints.down('xs')]: {
      width: '150px',
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
