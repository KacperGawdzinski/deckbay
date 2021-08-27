import { Collapse, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import VisibilityIcon from '@material-ui/icons/Visibility';
import axios from 'axios';
import React, { useState, useRef } from 'react';
import { ChessRoomInfo } from '../../dataTypes/chessTypes';
import theme from '../../theme';
// import { useHistory } from 'react-router-dom';
// import InactiveUser from '../../assets/images/inactive-user.png';
// import Lock from '../../assets/images/lock.png';
// import ActiveUser from '../../assets/images/user.png';
import { randomColor } from '../../utils/randomColor';
import { useWidth } from '../../utils/useWidth';

interface Props {
  game: ChessRoomInfo;
}

const RoomListItem: React.FC<Props> = (props) => {
  const classes = useStyles();
  const width = useWidth();
  const [color, setColor] = useState(randomColor());
  const [open, setOpen] = useState(false);
  const [infoLabel, setInfoLabel] = useState('Password');
  const [infoValue, setInfoValue] = useState('');

  return (
    <div
      onClick={() => setOpen((prev) => !prev)}
      style={{ cursor: 'pointer', position: 'relative' }}>
      {props.game.password ? (
        <Collapse in={open} collapsedSize={60} style={{ width: '100%' }}>
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
    [theme.breakpoints.only('xs')]: {
      padding: '0px 10px 0px 10px',
    },
  },

  staticGrid: {
    height: '60px',
    padding: '20px 25px 20px 25px',
    display: 'flex',
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
    },
  },

  timers: {
    position: 'absolute',
    right: '220px',
    [theme.breakpoints.only('xs')]: {
      right: '130px',
      paddingTop: '15px',
    },
  },

  iconWrapper: {
    display: 'flex',
    marginLeft: 'auto',
    [theme.breakpoints.only('xs')]: {
      flexBasis: '100%',
    },
  },
}));
