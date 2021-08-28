import { CircularProgress, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import axios from 'axios';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LOADING_STEPS } from '../../configFiles/rootConfig';
import { login } from '../../redux/actions/usernameActions';
import Alert from '../Alert/Alert';

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

const LoginModal: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [loginAlert, setLoginAlert] = useState(false);

  const [loadingStep, setLoadingStep] = useState(LOADING_STEPS.INPUT_DATA);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingStep(LOADING_STEPS.FETCHING_RESPONSE);
    try {
      await axios.post(
        '/login',
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
      handleClose();
      dispatch(login(username));
      setLoginAlert(true);
    } catch (err: any) {
      setLoadingStep(LOADING_STEPS.NEGATIVE_RESPONSE);
      if (err.response?.data?.usernameError)
        setUsernameErrorMessage(err.response.data.usernameError);
      else if (err.response?.data?.passwordError)
        setPasswordErrorMessage(err.response.data.passwordError);
    }
  };

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameErrorMessage('');
    setUsername(e.target.value);
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordErrorMessage('');
    setPassword(e.target.value);
  };

  const handleLoginAlertClose = () => {
    setLoginAlert(false);
  };

  const handleClose = () => {
    props.setOpen(false);
    setLoadingStep(LOADING_STEPS.INPUT_DATA);
    setUsername('');
    setPassword('');
    setUsernameErrorMessage('');
    setPasswordErrorMessage('');
  };

  return (
    <>
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle className={classes.dialogTitle}>
          Login
          {loadingStep === LOADING_STEPS.FETCHING_RESPONSE && (
            <CircularProgress className={classes.loadingIcon} />
          )}
          {loadingStep === LOADING_STEPS.NEGATIVE_RESPONSE && (
            <HighlightOffIcon
              className={clsx(classes.largeIcon, classes.failIcon)}
            />
          )}
        </DialogTitle>
        <form onSubmit={handleLogin}>
          <DialogContent className={classes.dialogContent}>
            <TextField
              error={(usernameErrorMessage as unknown) as boolean}
              fullWidth
              margin="dense"
              label={usernameErrorMessage ? usernameErrorMessage : 'Username'}
              autoComplete="false"
              type="text"
              autoFocus
              onChange={handleUsernameInput}
            />
            <div className={classes.inputWrapper}>
              <TextField
                error={(passwordErrorMessage as unknown) as boolean}
                fullWidth
                margin="dense"
                label={passwordErrorMessage ? passwordErrorMessage : 'Password'}
                type="password"
                onChange={handlePasswordInput}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Alert
        open={loginAlert}
        close={handleLoginAlertClose}
        severity={'success'}
        message={'Succesfully logged in'}
      />
    </>
  );
};
export default LoginModal;

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    alignSelf: 'center',
    paddingBottom: 0,
  },
  inputWrapper: { paddingTop: 5 },
  dialogContent: {
    width: '400px',
    [theme.breakpoints.down('xs')]: {
      width: '70vw',
    },
  },
  loadingIcon: {
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
