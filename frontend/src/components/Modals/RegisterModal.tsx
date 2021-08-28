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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import axios from 'axios';
import clsx from 'clsx';
import React, { useState } from 'react';
import { LOADING_STEPS } from '../../configFiles/rootConfig';
import { EMAIL_REGEX } from '../../configFiles/rootConfig';
import Alert from '../Alert/Alert';

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

const RegisterModal: React.FC<Props> = (props) => {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [registerAlert, setRegisterAlert] = useState(false);
  const [loadingStep, setLoadingStep] = useState(LOADING_STEPS.INPUT_DATA);

  const validateEmail = (email: string) => {
    return EMAIL_REGEX.test(email);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingStep(LOADING_STEPS.FETCHING_RESPONSE);
    if (!validateEmail(email)) {
      setLoadingStep(LOADING_STEPS.NEGATIVE_RESPONSE);
      setEmailErrorMessage('Invalid email');
      return;
    }
    try {
      await axios.post('/register', {
        username: username,
        password: password,
        email: email,
      });
      setRegisterAlert(true);
      handleClose();
    } catch (err: any) {
      setLoadingStep(LOADING_STEPS.NEGATIVE_RESPONSE);
      if (err.response?.data?.usernameError)
        setUsernameErrorMessage(err.response.data.usernameError);
      else if (err.response?.data?.passwordError)
        setPasswordErrorMessage(err.response.data.passwordError);
      else if (err.response?.data?.emailError)
        setEmailErrorMessage(err.response.data.emailError);
    }
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailErrorMessage('');
    setEmail(e.target.value);
  };

  const handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameErrorMessage('');
    setUsername(e.target.value);
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordErrorMessage('');
    setPassword(e.target.value);
  };

  const handleRegisterAlertClose = () => {
    setRegisterAlert(false);
  };

  const handleClose = () => {
    props.setOpen(false);
    setLoadingStep(LOADING_STEPS.INPUT_DATA);
    setUsername('');
    setPassword('');
    setEmail('');
    setUsernameErrorMessage('');
    setPasswordErrorMessage('');
    setEmailErrorMessage('');
  };

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle className={classes.dialogTitle}>
          Register
          {loadingStep === LOADING_STEPS.FETCHING_RESPONSE && (
            <CircularProgress className={classes.iconWrapper} />
          )}
          {loadingStep === LOADING_STEPS.NEGATIVE_RESPONSE && (
            <HighlightOffIcon
              className={clsx(classes.largeIcon, classes.failIcon)}
            />
          )}
        </DialogTitle>
        <form onSubmit={handleRegister}>
          <DialogContent className={classes.dialogContent}>
            <TextField
              error={emailErrorMessage !== ''}
              fullWidth
              margin="dense"
              label={emailErrorMessage ? emailErrorMessage : 'Email'}
              type="email"
              onChange={handleEmailInput}
            />
            <div className={classes.inputWrapper}>
              <TextField
                error={usernameErrorMessage !== ''}
                fullWidth
                margin="dense"
                label={usernameErrorMessage ? usernameErrorMessage : 'Username'}
                autoComplete="false"
                type="text"
                onChange={handleUsernameInput}
              />
            </div>
            <div className={classes.inputWrapper}>
              <TextField
                error={passwordErrorMessage !== ''}
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
        open={registerAlert}
        close={handleRegisterAlertClose}
        severity={'warning'}
        message={'Check your email in order to complete registration'}
      />
    </div>
  );
};
export default RegisterModal;

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
