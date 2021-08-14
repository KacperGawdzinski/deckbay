import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import LoginModal from "./LoginModal";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import RegisterModal from "./RegisterModal";
import { IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

export default function Navbar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openLoginModal, toggleLoginModal] = React.useState(false);
  const [openRegisterModal, toggleRegisterModal] = React.useState(false);

  const handleClickOpenLogin = () => {
    toggleLoginModal(true);
  };

  const handleClickOpenRegister = () => {
    toggleRegisterModal(true);
  };

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static" className={classes.background}>
      <Toolbar>
        <div className={classes.logoContainer}>
          <Link to="/">
            <img src={logo} alt="Deckbay logo" className={classes.logo} />
          </Link>
        </div>
        <div className={classes.buttonContainer}>
          <Button color="inherit" onClick={handleClickOpenLogin}>
            <Typography>Login</Typography>
          </Button>

          <Button color="inherit" onClick={handleClickOpenRegister}>
            <Typography>Register</Typography>
          </Button>
        </div>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          className={classes.hamburgerMenu}
        >
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
    display: "flex",
    position: "absolute",
    right: "20px",
    [theme.breakpoints.down("xs")]: {
      right: "0px",
      display: "none",
    },
  },

  logoContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
  },

  logo: {
    width: "200px",
    height: "auto",
    left: "100px",
    [theme.breakpoints.down("xs")]: {
      width: "150px",
    },
  },

  hamburgerMenu: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      marginLeft: "auto",
    },
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },

  inputRoot: {
    color: "inherit",
  },
}));
