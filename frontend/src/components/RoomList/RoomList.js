import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';

import { Typography } from '../../../node_modules/@material-ui/core/index';
import theme from '../../theme';
import RoomListItem from '../RoomListItem/RoomListItem';
import NewRoom from './NewRoom/NewRoom';
import './RoomList.css';

const RoomList = ({ game }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState(false);
  const [setHeight, setHeightState] = useState('0px');

  const content = useRef(null);

  // useEffect(() => {
  //   socket.emit('join-room-list', game);
  //   socket.emit('load_rooms', game);

  //   socket.on('rooms', (data) => {
  //     setRooms(data);
  //   });

  //   return () => socket.disconnect();
  // }, []);

  return (
    <GameRoomContainer maxWidth="md">
      <Grid
        container
        diretion="column"
        alignItems="center"
        justifyContent="center">
        <Grid
          item
          style={{
            width: '100%',
            height: '50px',
            backgroundColor: '#121858',
          }}>
          <Typography
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '300px',
              fontSize: '30px',
              color: 'white',
            }}>
            {game.toUpperCase()} ROOM LIST
          </Typography>
        </Grid>
        {/* <div className="list_header">
          <p> {game.toUpperCase()} ROOM LIST</p>
        </div> */}
        {/* <div
          ref={content}
          className="animation_wrapper"
          style={{ maxHeight: `${setHeight}` }}>
          <NewRoom game={game} />
        </div>
        <div>
          {rooms.map((info) => {
            return (
              <RoomListItem key={info.fullRoomName} info={info} game={game} />
            );
          })}
        </div> */}
      </Grid>
    </GameRoomContainer>
  );
};

const GameRoomContainer = styled(Container)`
  margin-top: 50px;
`;

export default RoomList;
