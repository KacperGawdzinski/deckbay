import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import axios from 'axios';
import clsx from 'clsx';
import React, { useState } from 'react';

import { LOADING_STEPS } from '../../config';

export default function RegisterModal(props) {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [usernameError, toggleUsernameError] = useState(false);
  const [passwordError, togglePasswordError] = useState(false);
  const [emailError, toggleEmailError] = useState(false);
  const [loadingStep, setLoadingStep] = useState(LOADING_STEPS.INPUT_DATA);

  const validateEmail = (email) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setLoadingStep(LOADING_STEPS.FETCHING_RESPONSE);
    if (!validateEmail(email)) {
      setLoadingStep(LOADING_STEPS.NEGATIVE_RESPONSE);
      toggleEmailError(true);
      return;
    }
    try {
      await axios.post('http://localhost:5000/register', {
        username: username,
        password: password,
        email: email,
      });
      setLoadingStep(LOADING_STEPS.POSITIVE_RESPONSE);
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err) {
      setLoadingStep(LOADING_STEPS.NEGATIVE_RESPONSE);
      if (err.response.data.usernameError) toggleUsernameError(true);
      else if (err.response.data.passwordError) togglePasswordError(true);
      else if (err.response.data.emailError) toggleEmailError(true);
    }
  };

  const switchUsernameErrorTextField = (e) => {
    setLoadingStep(LOADING_STEPS.INPUT_DATA);
    setUsername(e.target.value);
    toggleUsernameError(false);
  };

  const switchPasswordErrorTextField = (e) => {
    setLoadingStep(LOADING_STEPS.INPUT_DATA);
    togglePasswordError(false);
  };

  const switchEmailErrorTextField = (e) => {
    setLoadingStep(LOADING_STEPS.INPUT_DATA);
    toggleEmailError(false);
  };

  const handleClose = () => {
    props.setOpen(false);
    setLoadingStep(LOADING_STEPS.INPUT_DATA);
    setUsername('');
    setPassword('');
    setEmail('');
    toggleUsernameError(false);
    togglePasswordError(false);
    toggleEmailError(false);
  };

  // TODO: custom error message for email on register
  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
        Register
        {loadingStep === LOADING_STEPS.FETCHING_RESPONSE && (
          <CircularProgress className={classes.iconWrapper} />
        )}
        {loadingStep === LOADING_STEPS.POSITIVE_RESPONSE && (
          <CheckCircleOutlineIcon
            className={clsx(classes.largeIcon, classes.successIcon)}
          />
        )}
        {loadingStep === LOADING_STEPS.NEGATIVE_RESPONSE && (
          <HighlightOffIcon
            className={clsx(classes.largeIcon, classes.failIcon)}
          />
        )}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {emailError ? (
          <TextField
            error
            fullWidth
            margin="dense"
            label="Incorrect email"
            type="text"
            onChange={switchEmailErrorTextField}
          />
        ) : (
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            autoComplete="false"
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <div className={classes.inputWrapper}>
          {usernameError ? (
            <TextField
              error
              fullWidth
              margin="dense"
              label="Username already taken"
              autoComplete="false"
              type="text"
              defaultValue={username}
              onChange={switchUsernameErrorTextField}
            />
          ) : (
            <TextField
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              defaultValue={username}
              autoComplete="false"
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
        </div>
        <div className={classes.inputWrapper}>
          {passwordError ? (
            <TextField
              error
              fullWidth
              margin="dense"
              label="Incorrect password"
              type="password"
              onChange={switchPasswordErrorTextField}
            />
          ) : (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleRegister} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    alignSelf: 'center',
    paddingBottom: 0,
  },
  inputWrapper: {
    paddingTop: 5,
  },
  dialogContent: {
    width: '400px',
    [theme.breakpoints.down('xs')]: {
      width: '70vw',
    },
  },
  iconWrapper: {
    position: 'absolute',
    right: 10,
  },
  largeIcon: {
    width: '50px',
    height: '50px',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  failIcon: {
    color: red[500],
  },
  successIcon: {
    color: green[500],
  },
}));
