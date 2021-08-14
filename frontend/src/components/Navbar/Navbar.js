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
        <div className={classes.leftGrow} />
        <Link to="/">
          <img src={logo} alt="Deckbay logo" className={classes.logo} />
        </Link>
        <div className={classes.rightGrow} />
        <Button color="inherit" onClick={handleClickOpenLogin}>
          <Typography>Login</Typography>
        </Button>
        <LoginModal open={openLoginModal} setOpen={toggleLoginModal} />
        <Button color="inherit" onClick={handleClickOpenRegister}>
          <Typography>Register</Typography>
        </Button>
        <RegisterModal open={openRegisterModal} setOpen={toggleRegisterModal} />
      </Toolbar>
    </AppBar>
  );
}

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.primary.dark,
    flex: 1,
  },
  logo: {
    width: "200px",
    height: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "150px",
    },
  },
  leftGrow: {
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  rightGrow: {
    flex: 0.8,
    [theme.breakpoints.down("sm")]: {
      flex: 1,
    },
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },
  inputRoot: {
    color: "inherit",
  },
}));
