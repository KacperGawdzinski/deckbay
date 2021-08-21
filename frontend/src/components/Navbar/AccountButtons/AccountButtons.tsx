import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
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
  const [loginConfirmation, setLoginConfirmation] = useState(false);
  const [registerConfirmation, setRegisterConfirmation] = useState(false);
  const [logoutConfirmation, setLogoutConfirmation] = useState(false);

  const username = useSelector((state: RootState) => state.username);

  const handleClickOpenLogin = () => {
    setLoginModal(true);
  };

  const handleClickOpenRegister = () => {
    setRegisterModal(true);
  };

  const handleClickLogout = () => {
    setLogoutConfirmation(true);
    dispatch(logout());
  };

  const handleLoginAlertClose = () => {
    setLoginConfirmation(false);
  };

  const handleLogoutAlertClose = () => {
    setLogoutConfirmation(false);
  };

  const handleRegisterAlertClose = () => {
    setRegisterConfirmation(false);
  };

  return (
    <div className={classes.accountButtons}>
      {username ? (
        <ButtonWrapper>
          <Button
            className={classes.button}
            variant="contained"
            endIcon={<AccountCircleIcon />}>
            <Typography>{username}</Typography>
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleClickLogout}>
            <Typography>Log out</Typography>
          </Button>
        </ButtonWrapper>
      ) : (
        <ButtonWrapper>
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleClickOpenLogin}>
            <Typography>Login</Typography>
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleClickOpenRegister}>
            <Typography>Register</Typography>
          </Button>
        </ButtonWrapper>
      )}
      <LoginModal
        open={openLoginModal}
        setOpen={setLoginModal}
        setLoginConfirmation={setLoginConfirmation}
      />
      <RegisterModal
        open={openRegisterModal}
        setOpen={setRegisterModal}
        setEmailWarning={setRegisterConfirmation}
      />
      <Alert
        open={loginConfirmation}
        close={handleLoginAlertClose}
        severity={'success'}
        message={'Succesfully logged in'}
      />
      <Alert
        open={logoutConfirmation}
        close={handleLogoutAlertClose}
        severity={'success'}
        message={'Succesfully logged out'}
      />
      <Alert
        open={registerConfirmation}
        close={handleRegisterAlertClose}
        severity={'warning'}
        message={'Check your email in order to complete registration'}
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

  button: {
    '&:hover': {
      backgroundColor: 'grey',
    },
  },
}));

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`;
