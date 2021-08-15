import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { useState } from 'react';

export default function LoginModal(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`/login`, {
        username: username,
        password: password,
      });
      handleClose();
      setUsername(res.data.login);
    } catch (err) {
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
        style={{ alignSelf: 'center', paddingBottom: 0 }}>
        Login
      </DialogTitle>
      <DialogContent style={{ width: '400px' }}>
        <TextField
          autoFocus
          margin="dense"
          id="standard-basic"
          label="Username"
          type="text"
          fullWidth
          autoComplete="false"
        />
        <div style={{ paddingTop: 5 }}>
          <TextField
            margin="dense"
            id="standard-basic"
            label="Password"
            type="password"
            fullWidth
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
