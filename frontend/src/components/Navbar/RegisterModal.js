import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function RegisterModal(props) {
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle
        id="form-dialog-title"
        style={{ alignSelf: "center", paddingBottom: 0 }}
      >
        Register
      </DialogTitle>
      <DialogContent style={{ width: "400px" }}>
        <TextField
          autoFocus
          margin="dense"
          id="standard-basic"
          label="Email"
          type="email"
          fullWidth
          autoComplete="false"
        />
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
            autoFocus
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
