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

// import './RoomListItem.css';

interface Props {
  game: ChessRoomInfo;
}

const RoomListItem: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [color, setColor] = useState(randomColor());
  const [open, setOpen] = useState(false);
  const [infoLabel, setInfoLabel] = useState('Password');
  const [infoValue, setInfoValue] = useState('');
  let playerIcons = [];

  const calculateTimersMargin = () => {
    if (props.game.observators === 0 && !props.game.password) {
      return 135;
    }
    return 40;
  };

  //   if (game === 'chess' || game === 'checkers') {
  //     for (let i = 1; i <= maxPlayers.get(game); i++) {
  //       if (i <= info.playerCount)
  //         playerIcons.push(
  //           <img
  //             key={i}
  //             className="user_img"
  //             src={ActiveUser}
  //             alt="activeUser"
  //           />,
  //         );
  //       else
  //         playerIcons.push(
  //           <img
  //             key={i}
  //             className="user_img"
  //             src={InactiveUser}
  //             alt="inactiveUser"
  //           />,
  //         );
  //     }
  //   }

  return (
    <div
      onClick={() => setOpen((prev) => !prev)}
      style={{ cursor: 'pointer', position: 'relative' }}>
      {props.game.password ? (
        <Collapse
          in={open}
          collapsedSize={window.innerWidth < 600 ? 55 : 60}
          style={{ width: '100%' }}>
          <Grid item className={classes.grid}>
            <div style={{ padding: '10px 0px 10px 0px', display: 'flex' }}>
              <Typography>{props.game.roomName}</Typography>

              <Typography className={classes.iconMargin}>
                {`${props.game.gameLength}m/${props.game.bonusTime}s`}
              </Typography>
            </div>
            <div style={{ flex: 1 }} />

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                marginLeft: 'auto',
                width: '30%',
                height: '55px',
              }}>
              <div
                style={{
                  flexBasis: '100%',
                  display: 'flex',
                }}>
                {props.game.observators > 0 ? (
                  <div style={{ display: 'flex', marginLeft: 'auto' }}>
                    <Typography>{props.game.observators}</Typography>
                    <VisibilityIcon className={classes.iconMargin} />
                  </div>
                ) : null}
                <div style={{ display: 'flex' }}>
                  <Typography>{`${props.game.players}/2`}</Typography>
                  <PersonIcon className={classes.iconMargin} />
                </div>
              </div>
              <div
                style={{
                  flexBasis: '100%',
                  display: 'flex',
                }}>
                <LockIcon
                  className={classes.iconMargin}
                  style={{ marginLeft: 'auto' }}
                />
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
          style={{
            backgroundColor: color,
            height: '60px',
            padding: '20px 25px 20px 25px',
            display: 'flex',
          }}>
          <Typography>{props.game.roomName}</Typography>
          <div style={{ flex: 1 }} />
          {props.game.observators > 0 ? (
            <div style={{ display: 'flex' }}>
              <Typography>{props.game.observators}</Typography>
              <VisibilityIcon className={classes.iconMargin} />
            </div>
          ) : null}
          <Typography className={classes.iconMargin}>
            {`${props.game.gameLength}m/${props.game.bonusTime}s`}
          </Typography>
          <Typography>{`${props.game.players}/2`}</Typography>
          <PersonIcon className={classes.iconMargin} />
          {props.game.hasStarted ? (
            <SportsEsportsIcon />
          ) : (
            <HourglassEmptyIcon />
          )}
        </Grid>
      )}
    </div>
  );
  {
    /* {game === 'chess' || game === 'checkers' ? (
          <React.Fragment> {playerIcons} </React.Fragment>
        ) : (
          <React.Fragment>
            <p>{`${info.playerCount} / ${maxPlayers.get(game)}`}</p>
            <img className="user_img" src={ActiveUser} />
          </React.Fragment>
        )} */
  }
  {
    /* {info.password && (
        <div
          ref={wrapper}
          className="animation_wrapper"
          style={{ maxHeight: `${setHeight}` }}>
          <div style={{ backgroundColor: color }} className="list_item">
            <form method="POST" style={{ width: '100%' }} onSubmit={Submit}>
              <input
                name="password"
                style={{
                  display: 'inline',
                  width: '50%',
                  maxWidth: '400px',
                  marginLeft: '10%',
                  height: '30px',
                  fontSize: '16px',
                }}
                type="password"
                placeholder={infoLabel}
                value={infoValue}
                onChange={(e) => setInfoValue(e.target.value)}
              />
              <input
                style={{
                  display: 'inline',
                  width: '30%',
                  marginRight: '10%',
                  height: '30px',
                  marginBottom: 0,
                  padding: 0,
                  fontSize: '16px',
                }}
                type="submit"
                value="Join"
              />
              <input type="hidden" name="room" value={info.fullRoomName} />
            </form>
          </div>
        </div>
      )} */
  }
};
export default RoomListItem;

const useStyles = makeStyles((theme) => ({
  grid: {
    backgroundColor: randomColor(),
    height: '120px',
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
}));
