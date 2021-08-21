import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { logout } from '../../../redux/actions/usernameActions';
import { RootState } from '../../../redux/reducers';
import Alert from '../../Alert/Alert';
import LoginModal from '../../Modals/LoginModal';
import RegisterModal from '../../Modals/RegisterModal';

const AccountButtons: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openLoginModal, setLoginModal] = useState(false);
  const [openRegisterModal, setRegisterModal] = useState(false);
  const [logoutConfirmation, setLogoutConfirmation] = useState(false);

  const username = useSelector((state: RootState) => state.username);

  const handleClickLogin = () => {
    setLoginModal(true);
  };

  const handleClickRegister = () => {
    setRegisterModal(true);
  };

  const handleClickLogout = () => {
    setLogoutConfirmation(true);
    dispatch(logout());
  };

  const handleAlertClose = () => {
    setLogoutConfirmation(false);
  };

  return (
    <div className={classes.accountButtons}>
      {username ? (
        <div className={classes.buttonWrapper}>
          <Button
            className={classes.button}
            variant="contained"
            endIcon={<AccountCircleIcon />}
            color="primary">
            <Typography>{username}</Typography>
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleClickLogout}
            color="primary">
            <Typography>Log out</Typography>
          </Button>
        </div>
      ) : (
        <div className={classes.buttonWrapper}>
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleClickLogin}
            color="primary">
            <Typography>Login</Typography>
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleClickRegister}
            color="primary">
            <Typography>Register</Typography>
          </Button>
        </div>
      )}
      <LoginModal open={openLoginModal} setOpen={setLoginModal} />
      <RegisterModal open={openRegisterModal} setOpen={setRegisterModal} />
      <Alert
        open={logoutConfirmation}
        close={handleAlertClose}
        severity={'success'}
        message={'Succesfully logged out'}
      />
    </div>
  );
};
export default AccountButtons;

const useStyles = makeStyles((theme) => ({
  accountButtons: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },

  buttonWrapper: {
    display: 'flex',
    gap: '10px',
  },

  button: {
    '&:hover': {
      backgroundColor: 'grey',
    },
  },
}));
