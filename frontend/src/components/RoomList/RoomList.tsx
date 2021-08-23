import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChessRoomInfo } from '../../dataTypes/chessTypes';
import { connect } from '../../redux/actions/socketioActions';
import { RootState } from '../../redux/reducers/index';
import RoomListItem from '../RoomListItem/RoomListItem';
import ChessRoomListHeader from './RoomListHeaders/ChessRoomListHeader';

interface Props {
  game: string;
}

const RoomList: React.FC<Props> = (props) => {
  const classes = useStyles();
  const socket = useSelector((state: RootState) => state.socket);
  const [roomList, setRoomList] = useState<ChessRoomInfo[]>([]);
  socket.emit('joinChessRoomList');
  socket.on('getChessRoomList', (data: ChessRoomInfo[]) => setRoomList(data));
  return (
    <Container maxWidth="md" className={classes.container}>
      <Grid container direction="column" justifyContent="center">
        <ChessRoomListHeader game={props.game} />
        <div>
          {roomList.map((roomInfo) => {
            return <RoomListItem key={roomInfo.roomName} game={roomInfo} />;
          })}
        </div>
      </Grid>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '50px',
    [theme.breakpoints.only('sm')]: {
      marginTop: '35px',
    },
    [theme.breakpoints.only('xs')]: {
      marginTop: '20px',
      padding: '0 5px',
    },
  },
}));

export default RoomList;
