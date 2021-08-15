import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { useState } from 'react';

export default function RegisterModal(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/register', {
        username: username,
        password: password,
        email: email,
      });
      handleClose();
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
        Register
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
