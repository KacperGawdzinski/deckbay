import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import React, { useState, useRef } from 'react';
import { ChessRoomInfo } from '../../dataTypes/chessTypes';
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
  const [color, setColor] = useState(randomColor());
  const [expanded, setExpanded] = useState(false);
  const [infoLabel, setInfoLabel] = useState('Password');
  const [infoValue, setInfoValue] = useState('');
  let playerIcons = [];

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
    <Grid item xl={12} style={{ backgroundColor: color }}>
      <div style={{ backgroundColor: color }}>
        <p>{props.game.roomName}</p>
        <p>{`${props.game.gameLength} ┃ ${props.game.bonusTime}`}</p>

        {/* {game === 'chess' || game === 'checkers' ? (
          <React.Fragment> {playerIcons} </React.Fragment>
        ) : (
          <React.Fragment>
            <p>{`${info.playerCount} / ${maxPlayers.get(game)}`}</p>
            <img className="user_img" src={ActiveUser} />
          </React.Fragment>
        )} */}
      </div>
      {/* {info.password && (
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
      )} */}
    </Grid>
  );
};

export default RoomListItem;
