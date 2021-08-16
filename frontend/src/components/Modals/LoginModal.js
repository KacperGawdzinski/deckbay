import { CircularProgress, makeStyles } from '@material-ui/core';
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
import { useDispatch } from 'react-redux';

import { LOADING_STEPS } from '../../config';
import { login } from '../../redux/actions/usernameActions';

export default function LoginModal(props) {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, toggleUsernameError] = useState(false);
  const [passwordError, togglePasswordError] = useState(false);
  const [loadingStep, setLoadingStep] = useState(LOADING_STEPS.INPUT_DATA);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoadingStep(LOADING_STEPS.FETCHING_RESPONSE);
    try {
      await axios.post('http://localhost:5000/login', {
        username: username,
        password: password,
      });
      setLoadingStep(LOADING_STEPS.POSITIVE_RESPONSE);
      handleClose();
      props.toggleLoginCorfirmation(true);
      dispatch(login(username));
    } catch (err) {
      setLoadingStep(LOADING_STEPS.NEGATIVE_RESPONSE);
      if (err.response.data.usernameError) toggleUsernameError(true);
      else if (err.response.data.passwordError) togglePasswordError(true);
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

  const handleClose = () => {
    props.setOpen(false);
    setLoadingStep(LOADING_STEPS.INPUT_DATA);
    setUsername('');
    setPassword('');
    toggleUsernameError(false);
    togglePasswordError(false);
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
        Login
        {loadingStep === LOADING_STEPS.FETCHING_RESPONSE && (
          <CircularProgress className={classes.iconWrapper} />
        )}
        {loadingStep === LOADING_STEPS.NEGATIVE_RESPONSE && (
          <HighlightOffIcon
            className={clsx(classes.largeIcon, classes.failIcon)}
          />
        )}
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {usernameError ? (
          <TextField
            error
            fullWidth
            margin="dense"
            label="Username not found"
            autoComplete="false"
            type="text"
            defaultValue={username}
            onChange={switchUsernameErrorTextField}
          />
        ) : (
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            defaultValue={username}
            autoComplete="false"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <div className={classes.passwordWrapper}>
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
        <Button onClick={handleLogin} color="primary">
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
  passwordWrapper: {
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
