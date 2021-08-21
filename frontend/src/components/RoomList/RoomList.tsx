import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import React, { useState, useRef } from 'react';
import ChessRoomListheader from './RoomListHeaders/ChessRoomListHeader';

// import RoomListItem from '../RoomListItem/RoomListItem';

interface Props {
  game: string;
}

const RoomList: React.FC<Props> = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState(false);
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const [value, setValue] = React.useState('white');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const content = useRef(null);

  return (
    <Container maxWidth="md" className={classes.container}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center">
        <ChessRoomListheader game={props.game} />
        {/* <div>
          {rooms.map((info) => {
            return (
              <RoomListItem key={info.fullRoomName} info={info} game={game} />
            );
          })}
        </div>  */}
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
