import { IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/images/logo.png';
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
        <AccountButtons />
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
}));

const DeckbayLogo = styled.img`
  width: 100%;
  height: auto;
  padding-top: 3;
`;

const SpacingDiv = styled.div`
  flex: 1;
`;
