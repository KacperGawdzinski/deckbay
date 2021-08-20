import Collapse from '@material-ui/core/Collapse';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  Button,
  TextField,
} from '../../../node_modules/@material-ui/core/index';
import { RadioGroup } from '../../../node_modules/@material-ui/core/index';
import { Radio } from '../../../node_modules/@material-ui/core/index';
import { FormControl } from '../../../node_modules/@material-ui/core/index';
import { FormLabel } from '../../../node_modules/@material-ui/core/index';
import { IconButton } from '../../../node_modules/@material-ui/core/index';
import { Typography } from '../../../node_modules/@material-ui/core/index';
import { FormControlLabel } from '../../../node_modules/@material-ui/core/index';
import { LENGTH_MARKS, BONUS_MARKS } from '../../configFiles/chessConfig';

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

  const CustomSlider = withStyles({
    root: {
      color: '#6f8eff',
    },
    track: {
      height: 4,
      borderRadius: 2,
    },
    thumb: {
      height: 15,
      width: 15,
      border: '1px solid currentColor',
      // marginTop: 0,
    },
    markLabel: {
      color: 'white',
    },
  })(Slider);

  const CustomRadio = withStyles({
    root: {
      color: 'blue',
    },
    checked: {
      color: '#6f8eff !important',
    },
  })(Radio);

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
        direction="column"
        alignItems="center"
        justifyContent="center">
        <Collapse
          in={checked}
          collapsedSize={70}
          style={{ width: '100%', height: '340px' }}>
          <Grid
            item
            style={{
              height: '340px',
              backgroundColor: theme.palette.primary.light,
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
                {props.game.toUpperCase()} ROOM LIST
              </Typography>
              <IconButton
                style={{
                  color: 'white',
                  marginLeft: 'auto',
                  height: '60px',
                }}
                onClick={handleChange}>
                {checked ? (
                  <RemoveIcon
                    style={{
                      width: '45px',
                      height: '45px',
                      paddingRight: '5px',
                    }}
                  />
                ) : (
                  <AddIcon
                    style={{
                      width: '45px',
                      height: '45px',
                      paddingRight: '5px',
                    }}
                  />
                )}
              </IconButton>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ paddingTop: '22px' }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" style={{ color: 'white' }}>
                    Play as
                  </FormLabel>
                  <RadioGroup
                    value={value}
                    onChange={handleRadioChange}
                    style={{ color: 'white' }}>
                    <FormControlLabel
                      value="white"
                      color="default"
                      control={<CustomRadio />}
                      label="White"
                    />
                    <FormControlLabel
                      style={{ color: 'white' }}
                      value="black"
                      control={<CustomRadio />}
                      label="Black"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div
                style={{
                  width: '300px',
                  display: 'block',
                  padding: '20px 0 0 50px',
                }}>
                <div
                  style={{ color: 'white', fontFamily: 'Roboto, sans-serif' }}>
                  {' '}
                  Game length{' '}
                </div>
                <CustomSlider
                  defaultValue={10}
                  step={1}
                  valueLabelDisplay="auto"
                  marks={LENGTH_MARKS}
                  min={1}
                  max={30}
                />

                <div style={{ marginTop: '40px' }}>
                  <CssTextField
                    variant="outlined"
                    required
                    label="Room name"
                    InputLabelProps={{
                      classes: {
                        root: classes.chuj,
                        focused: classes.chuj,
                      },
                    }}
                    InputProps={{
                      classes: {
                        root: classes.chuj,
                        focused: classes.chuj,
                        notchedOutline: classes.chuj,
                      },
                    }}
                    style={{
                      width: '300px',
                    }}></CssTextField>
                </div>
              </div>

              <div
                style={{
                  width: '300px',
                  display: 'block',
                  padding: '20px 0 0 80px',
                }}>
                <div
                  style={{ color: 'white', fontFamily: 'Roboto, sans-serif' }}>
                  {' '}
                  Time bonus{' '}
                </div>
                <CustomSlider
                  defaultValue={10}
                  step={1}
                  valueLabelDisplay="auto"
                  marks={BONUS_MARKS}
                  min={0}
                  max={30}
                />

                <div style={{ marginTop: '40px' }}>
                  <CssTextField
                    variant="outlined"
                    label="Password"
                    InputLabelProps={{
                      classes: {
                        root: classes.chuj,
                        focused: classes.chuj,
                      },
                    }}
                    InputProps={{
                      classes: {
                        root: classes.chuj,
                        focused: classes.chuj,
                        notchedOutline: classes.chuj,
                      },
                    }}
                    style={{
                      width: '300px',
                    }}></CssTextField>
                </div>

                <div>
                  <Button
                    style={{
                      color: theme.palette.primary.contrastText,
                      backgroundColor: '#6f8eff',
                      marginTop: '20px',
                      width: '100px',
                      marginLeft: '200px',
                    }}>
                    Submit
                  </Button>
                </div>
              </div>
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

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'yellow',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'yellow',
      },
    },
  },
})(TextField);

const useStyles = makeStyles((theme) => ({
  root: {
    height: 180,
  },
  slider: {
    color: 'white',
  },
  chuj: {
    color: 'white',
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
