import { IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import AccountButtons from './AccountButtons/AccountButtons';

const Navbar: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <Link to="/">
          <img src={logo} alt="Deckbay logo" className={classes.logo} />
        </Link>
        <div className={classes.spacingDiv} />
        <AccountButtons />
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          className={classes.hamburgerMenu}>
          <MenuIcon />
        </IconButton>
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

  logo: {
    width: '215px',
    height: 'auto',
    paddingTop: 3,
    [theme.breakpoints.down('xs')]: {
      width: '150px',
    },
  },

  spacingDiv: {
    flex: 1,
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
}));
