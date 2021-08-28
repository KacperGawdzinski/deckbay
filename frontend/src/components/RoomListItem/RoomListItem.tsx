import { Collapse, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import VisibilityIcon from '@material-ui/icons/Visibility';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChessRoomInfo } from '../../dataTypes/chessTypes';
import theme from '../../theme';
import { randomColor } from '../../utils/randomColor';
import { useWidth } from '../../utils/useWidth';

interface Props {
  game: ChessRoomInfo;
}

const RoomListItem: React.FC<Props> = (props) => {
  const classes = useStyles();
  const width = useWidth();
  const history = useHistory();
  const [color, setColor] = useState('');
  const [open, setOpen] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [roomPasswordPlaceholder, setRoomPasswordPlaceholderError] = useState(
    'Enter password...',
  );

  useEffect(() => {
    setColor(randomColor());
  }, []);

  const handleRoomPasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomPasswordPlaceholderError('Enter password...');
    setRoomPassword(e.target.value);
  };

  const handleRoomPasswordSubmit = async () => {
    if (roomPassword === '') {
      setRoomPasswordPlaceholderError('Password field is empty');
      return;
    }
    try {
      await axios.post('/room-password', {
        roomName: props.game.roomName,
        password: roomPassword,
        game: 'chess',
      });
      history.push(`/${props.game.roomName}`);
    } catch (error: any) {
      setRoomPassword('');
      console.log(error.response?.data);

      if (error.response?.data?.roomNameError)
        setRoomPasswordPlaceholderError(error.response.data.roomNameError);
      else if (error.response?.data?.passwordError)
        setRoomPasswordPlaceholderError(error.response.data.passwordError);
      else if (error.response?.data?.gameError)
        setRoomPasswordPlaceholderError(error.response.data.gameError);
    }
  };

  const handleCollapseClose = (e: React.MouseEvent<HTMLElement>) => {
    const element = e.target as HTMLElement;
    if (
      element.id !== 'submitPasswordButton' &&
      element.id !== 'inputPasswordField' &&
      element.parentElement?.id !== 'submitPasswordButton'
    ) {
      setOpen((prev) => !prev);
    }
  };

  return (
    <div
      onClick={handleCollapseClose}
      style={{ cursor: 'pointer', position: 'relative' }}>
      {props.game.password ? (
        <Collapse
          in={open}
          collapsedSize={60}
          style={{
            width: '100%',
            zIndex: 100,
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
          }}>
          <Grid
            item
            className={classes.expandableGrid}
            style={{ backgroundColor: color }}>
            <Typography className={classes.roomName}>
              {props.game.roomName}
            </Typography>
            <Typography className={classes.timers}>
              {`${props.game.gameLength}m/${props.game.bonusTime}s`}
            </Typography>
            <div style={{ flex: 1 }} />

            <div className={classes.iconPanel}>
              <div className={classes.iconWrapper}>
                {props.game.observators > 0 ? (
                  <div style={{ display: 'flex', marginLeft: 'auto' }}>
                    <Typography>{props.game.observators}</Typography>
                    <VisibilityIcon className={classes.iconMargin} />
                  </div>
                ) : null}

                {width <= theme.breakpoints.values.sm ? (
                  <div
                    style={{
                      display: 'flex',
                      marginLeft: props.game.observators > 0 ? '0' : 'auto',
                    }}>
                    <Typography>{`${props.game.players}/2`}</Typography>
                    <PersonIcon />
                  </div>
                ) : (
                  <LockIcon className={classes.iconMargin} />
                )}
              </div>
              <div className={classes.iconWrapper}>
                {width <= theme.breakpoints.values.sm ? (
                  <LockIcon
                    className={classes.iconMargin}
                    style={{ marginLeft: 'auto' }}
                  />
                ) : (
                  <div style={{ display: 'flex' }}>
                    <Typography>{`${props.game.players}/2`}</Typography>
                    <PersonIcon className={classes.iconMargin} />
                  </div>
                )}
                {props.game.hasStarted ? (
                  <SportsEsportsIcon />
                ) : (
                  <HourglassEmptyIcon />
                )}
              </div>
            </div>
            <Input
              id="inputPasswordField"
              autoComplete="off"
              error={roomPasswordPlaceholder !== 'Enter password...'}
              value={roomPassword}
              className={classes.passwordBox}
              placeholder={roomPasswordPlaceholder}
              onChange={handleRoomPasswordInput}
            />
            <Button
              id="submitPasswordButton"
              className={classes.submitPasswordButton}
              onClick={handleRoomPasswordSubmit}>
              Submit
            </Button>
          </Grid>
        </Collapse>
      ) : (
        <Grid
          item
          className={classes.staticGrid}
          style={{ backgroundColor: color }}>
          <Typography className={classes.roomName}>
            {props.game.roomName}
          </Typography>

          <Typography className={classes.timers}>
            {`${props.game.gameLength}m/${props.game.bonusTime}s`}
          </Typography>
          <div style={{ flex: 1 }} />

          <div className={classes.iconPanel}>
            <div className={classes.iconWrapper}>
              {props.game.observators > 0 ? (
                <div style={{ display: 'flex', marginLeft: 'auto' }}>
                  <Typography>{props.game.observators}</Typography>
                  <VisibilityIcon className={classes.iconMargin} />
                </div>
              ) : null}

              {width <= theme.breakpoints.values.sm ? (
                <div
                  style={{
                    display: 'flex',
                    marginLeft: props.game.observators > 0 ? '0' : 'auto',
                  }}>
                  <Typography>{`${props.game.players}/2`}</Typography>
                  <PersonIcon />
                </div>
              ) : null}
            </div>
            <div className={classes.iconWrapper}>
              {width <= theme.breakpoints.values.sm ? null : (
                <div style={{ display: 'flex' }}>
                  <Typography>{`${props.game.players}/2`}</Typography>
                  <PersonIcon className={classes.iconMargin} />
                </div>
              )}
              {props.game.hasStarted ? (
                <SportsEsportsIcon style={{ marginLeft: 'auto' }} />
              ) : (
                <HourglassEmptyIcon style={{ marginLeft: 'auto' }} />
              )}
            </div>
          </div>
        </Grid>
      )}
    </div>
  );
};
export default RoomListItem;

const useStyles = makeStyles((theme) => ({
  expandableGrid: {
    height: '120px',
    padding: '20px 25px 20px 25px',
    display: 'flex',
    zIndex: 100,
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
    [theme.breakpoints.only('xs')]: {
      padding: '0px 10px 0px 10px',
    },
  },

  staticGrid: {
    height: '60px',
    padding: '20px 25px 20px 25px',
    display: 'flex',
    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
    zIndex: 100,
    [theme.breakpoints.only('xs')]: {
      padding: '0px 10px 0px 10px',
    },
  },

  iconMargin: {
    marginRight: '10px',
    [theme.breakpoints.only('xs')]: {
      marginRight: '5px',
    },
  },

  iconPanel: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: 'auto',
    width: 'auto',
    height: '55px',
    [theme.breakpoints.only('xs')]: {
      paddingTop: '3px',
    },
  },

  roomName: {
    [theme.breakpoints.only('xs')]: {
      paddingTop: '18px',
      textOverflow: 'ellipsis',
      width: '38vw',
      whiteSpace: 'nowrap',
      overflow: 'hidden !important',
    },
  },

  timers: {
    position: 'absolute',
    right: '220px',
    [theme.breakpoints.only('xs')]: {
      right: '110px',
      paddingTop: '18px',
    },
  },

  iconWrapper: {
    display: 'flex',
    marginLeft: 'auto',
    [theme.breakpoints.only('xs')]: {
      flexBasis: '100%',
    },
  },

  passwordBox: {
    position: 'absolute',
    left: 25,
    top: 60,

    [theme.breakpoints.only('xs')]: {
      left: 10,
      width: '50vw',
    },
  },

  submitPasswordButton: {
    position: 'absolute',
    right: 25,
    top: 60,
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    width: '200px',
    [theme.breakpoints.only('xs')]: {
      width: '30vw',
      right: 10,
    },
  },
}));
