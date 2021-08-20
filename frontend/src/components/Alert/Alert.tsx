import { Typography } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { Color } from '@material-ui/lab/Alert';

interface Props {
  close: () => void;
  open: boolean;
  severity: Color;
  message: string;
}

const Alert: React.FC<Props> = (props) => {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={5000}
      style={{ marginTop: '50px' }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={props.close}>
      <MuiAlert elevation={6} variant="filled" severity={props.severity}>
        <Typography>{props.message}</Typography>
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
