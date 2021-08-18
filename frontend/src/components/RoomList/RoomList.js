import Collapse from '@material-ui/core/Collapse';
import Container from '@material-ui/core/Container';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';

import { IconButton } from '../../../node_modules/@material-ui/core/index';
import { Typography } from '../../../node_modules/@material-ui/core/index';
import theme from '../../theme';
import RoomListItem from '../RoomListItem/RoomListItem';
import NewRoom from './NewRoom/NewRoom';
import './RoomList.css';

const RoomList = ({ game }) => {
  const classes = useState();
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState(false);
  const [setHeight, setHeightState] = useState('0px');
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };
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
        <Collapse
          in={checked}
          collapsedSize={200}
          style={{ width: '100%', heigth: '200px' }}>
          <Grid
            item
            style={{
              height: '200px',
              backgroundColor: theme.palette.primary.dark,
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '25px',
              borderTopLeftRadius: '25px',
              borderTopRightRadius: '25px',
            }}>
            <div style={{ display: 'flex' }}>
              <Typography
                style={{
                  fontSize: '24px',
                  color: 'white',
                  paddingTop: '15px',
                  width: '300px',
                }}>
                {game.toUpperCase()} ROOM LIST
              </Typography>
              <IconButton
                style={{
                  color: 'white',
                  marginLeft: 'auto',
                  height: '60px',
                }}
                onClick={handleChange}>
                <AddIcon
                  style={{
                    width: '45px',
                    height: '45px',
                    paddingRight: '5px',
                  }}
                />
              </IconButton>
            </div>
            <div>
              <Typography style={{ color: 'white' }}>test</Typography>
            </div>
          </Grid>
        </Collapse>

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

const useStyles = makeStyles((theme) => ({
  root: {
    height: 180,
  },
  container: {
    display: 'flex',
  },
  paper: {
    margin: theme.spacing(1),
  },
  svg: {
    width: 100,
    height: 100,
  },
  polygon: {
    fill: theme.palette.common.white,
    stroke: theme.palette.divider,
    strokeWidth: 1,
  },
}));

const GameRoomContainer = styled(Container)`
  margin-top: 50px;
`;

export default RoomList;
