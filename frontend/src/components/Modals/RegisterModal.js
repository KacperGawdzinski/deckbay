import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import axios from 'axios';
import React, { useState } from 'react';

import { LOADING_STEPS } from '../../config';

export default function RegisterModal(props) {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loadingStep, setLoadingStep] = useState(LOADING_STEPS.INPUT_DATA);

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleRegister = async () => {
    setLoadingStep(LOADING_STEPS.FETCHING_RESPONSE);
    try {
      await axios.post('http://localhost:5000/register', {
        username: username,
        password: password,
        email: email,
      });
      setLoadingStep(LOADING_STEPS.POSITIVE_RESPONSE);
      setTimeout(() => {
        handleClose();
        setLoadingStep(LOADING_STEPS.INPUT_DATA);
      }, 1000);
    } catch (err) {
      setLoadingStep(LOADING_STEPS.NEGATIVE_RESPONSE);
      console.log(err.response);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle
        id="form-dialog-title"
        style={{ marginLeft: 'auto', marginRight: 'auto', paddingBottom: 0 }}>
        Register
        {loadingStep === LOADING_STEPS.FETCHING_RESPONSE && (
          <CircularProgress className={classes.iconWrapper} />
        )}
        {loadingStep === LOADING_STEPS.POSITIVE_RESPONSE && (
          <CheckCircleOutlineIcon className={classes.largeIcon} />
        )}
        {loadingStep === LOADING_STEPS.NEGATIVE_RESPONSE && (
          <HighlightOffIcon className={classes.largeIcon} />
        )}
      </DialogTitle>

      <DialogContent style={{ width: '400px' }}>
        <TextField
          autoFocus
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          autoComplete="false"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Username"
          type="text"
          fullWidth
          autoComplete="false"
          onChange={(e) => setUsername(e.target.value)}
        />
        <div style={{ paddingTop: 5 }}>
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
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
}));
