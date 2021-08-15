import { CircularProgress, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { useState } from 'react';

export default function LoginModal(props) {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, toggleUsernameError] = useState(false);

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', {
        username: username,
        password: password,
      });
      handleClose();
    } catch (err) {
      if (err.response.data.userError) toggleUsernameError(true);
    }
  };

  const switchErrorTextField = (e) => {
    setUsername(e.target.value);
    toggleUsernameError(false);
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>
        Login
      </DialogTitle>
      <DialogContent style={{ width: '400px' }}>
        {usernameError ? (
          <TextField
            error
            fullWidth
            margin="dense"
            label="Username not found"
            autoComplete="false"
            type="text"
            defaultValue={username}
            onChange={switchErrorTextField}
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
}));
