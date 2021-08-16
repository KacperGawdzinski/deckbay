import { CircularProgress, Typography } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import logo from '../../assets/images/logo.png';
import { logout } from '../../redux/actions/usernameActions';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';

export default function Navbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openLoginModal, toggleLoginModal] = useState(false);
  const [openRegisterModal, toggleRegisterModal] = useState(false);
  const username = useSelector((state) => state.username);

  const handleClickOpenLogin = () => {
    toggleLoginModal(true);
  };

  const handleClickOpenRegister = () => {
    toggleRegisterModal(true);
  };

  const handleClickLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static" className={classes.background}>
      <Toolbar>
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
        <LoginModal open={openLoginModal} setOpen={toggleLoginModal} />
        <RegisterModal open={openRegisterModal} setOpen={toggleRegisterModal} />
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
