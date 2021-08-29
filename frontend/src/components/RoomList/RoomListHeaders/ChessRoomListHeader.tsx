import { Button, TextField } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { Radio } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import axios from 'axios';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LENGTH_MARKS, BONUS_MARKS } from '../../../configFiles/chessConfig';
import { useWidth } from '../../../utils/useWidth';

interface Props {
  game: string;
}

const ChessRoomListheader: React.FC<Props> = (props) => {
  const classes = useStyles();
  const width = useWidth();
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');

  const [gameSide, setGameSide] = useState('white');
  const [gameLength, setGameLength] = useState(10);
  const [gameBonus, setGameBonus] = useState(10);

  const handleCollapse = () => {
    setOpen((prev) => !prev);
  };

  const handleRoomSideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameSide(event.target.value);
  };

  const handleGameLengthInput = (event: any, value: number | number[]) => {
    setGameLength(value as number);
  };

  const handleGameBonusInput = (event: any, value: number | number[]) => {
    setGameBonus(value as number);
  };

  const handleRoomPasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomPassword(event.target.value);
  };

  const handleRoomNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleSubmitRoomOptions = async () => {
    if (roomName === '') {
      //err
    }
    console.log(roomName);
    console.log(roomPassword);
    console.log(gameSide);
    console.log(gameLength);
    console.log(gameBonus);

    try {
      await axios.post('chess', {
        roomName: roomName,
        password: roomPassword,
        side: gameSide,
        length: gameLength,
        bonus: gameBonus,
      });
      history.push(`/chess/${roomName}`);
    } catch (error: any) {}
  };

  return (
    <Collapse in={open} collapsedSize={width < 600 ? 60 : 70} style={{ width: '100%' }}>
      <Grid item className={classes.grid}>
        <div className={classes.flexbox}>
          <Typography className={clsx(classes.title, classes.text)}>
            {props.game.toUpperCase()} ROOM LIST
          </Typography>
          <IconButton
            className={clsx(classes.collapseIconWrapper, classes.text)}
            onClick={handleCollapse}>
            {open ? (
              <RemoveIcon className={classes.collapseIcon} />
            ) : (
              <AddIcon className={classes.collapseIcon} />
            )}
          </IconButton>
        </div>

        <div className={classes.flexToBlock}>
          <div className={classes.leftOptions}>
            <div>
              <RoomInput
                variant="outlined"
                autoComplete="off"
                required
                label="Room name"
                value={roomName}
                onChange={handleRoomNameInput}
                InputLabelProps={{
                  classes: {
                    root: classes.text,
                    focused: classes.text,
                  },
                }}
                InputProps={{
                  classes: {
                    root: classes.text,
                    focused: classes.text,
                    notchedOutline: classes.text,
                  },
                }}
                style={{
                  width: 'auto',
                  minWidth: '100%',
                }}></RoomInput>
            </div>
            <div className={classes.passwordWrapper}>
              <RoomInput
                variant="outlined"
                label="Password"
                type="password"
                autoComplete="off"
                value={roomPassword}
                onChange={handleRoomPasswordInput}
                InputLabelProps={{
                  classes: {
                    root: classes.text,
                    focused: classes.text,
                  },
                }}
                InputProps={{
                  classes: {
                    root: classes.text,
                    focused: classes.text,
                    notchedOutline: classes.text,
                  },
                }}
                style={{
                  width: '100%',
                  minWidth: '150px',
                }}></RoomInput>
            </div>
          </div>

          <div className={classes.middleOptions}>
            <div className={classes.text}>Game length</div>
            <TimePicker
              defaultValue={10}
              step={1}
              valueLabelDisplay="auto"
              onChange={handleGameLengthInput}
              marks={LENGTH_MARKS}
              min={1}
              max={30}
            />
            <div className={clsx(classes.text, classes.timeBonusWrapper)}>Time bonus</div>
            <TimePicker
              defaultValue={10}
              step={1}
              valueLabelDisplay="auto"
              onChange={handleGameBonusInput}
              marks={BONUS_MARKS}
              min={0}
              max={30}
            />
          </div>
          <div className={classes.rightOptions}>
            <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.text}>
                  Play as
                </FormLabel>
                <RadioGroup
                  value={gameSide}
                  onChange={handleRoomSideChange}
                  style={{ color: 'white' }}
                  row>
                  <FormControlLabel
                    value="white"
                    color="default"
                    control={<Side />}
                    label="White"
                  />
                  <FormControlLabel
                    style={{ color: 'white' }}
                    value="black"
                    control={<Side />}
                    label="Black"
                  />
                </RadioGroup>
              </FormControl>
              <Button className={classes.submitButton} onClick={handleSubmitRoomOptions}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Grid>
    </Collapse>
  );
};
export default ChessRoomListheader;

const RoomInput = withStyles({
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

const TimePicker = withStyles({
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
  },
  markLabel: {
    color: 'white',
  },
})(Slider);

const Side = withStyles({
  root: {
    color: 'blue',
  },
  checked: {
    color: '#6f8eff !important',
  },
})(Radio);

const useStyles = makeStyles((theme) => ({
  grid: {
    height: 'auto',
    width: '100%',
    backgroundColor: '#14181f',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '25px',
    paddingRight: '20px',
    borderTopLeftRadius: '25px',
    borderTopRightRadius: '25px',
  },

  title: {
    fontSize: '24px',
    paddingTop: '15px',
    width: 'auto',
    [theme.breakpoints.only('xs')]: {
      fontSize: '20px',
    },
  },

  text: {
    color: `${theme.palette.primary.contrastText} !important`,
    fontFamily: 'Roboto, sans-serif',
  },

  flexToBlock: {
    display: 'flex',
    margin: '20px 30px 0px 30px',
    [theme.breakpoints.down('md')]: {
      margin: '20px 10px 0px 10px',
    },
    [theme.breakpoints.only('xs')]: {
      display: 'block',
    },
  },

  flexbox: {
    display: 'flex',
  },

  collapseIconWrapper: {
    marginTop: '10px',
    marginLeft: 'auto',
    padding: 0,
  },

  collapseIcon: {
    width: '45px',
    height: '45px',
    [theme.breakpoints.only('xs')]: {
      width: '30px',
      height: '30px',
    },
  },

  leftOptions: {
    minWidth: '150px',
    width: '300px',
    display: 'block',
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },

  middleOptions: {
    width: '300px',
    display: 'block',
    minWidth: '150px',
    marginLeft: '40px',
    [theme.breakpoints.only('xs')]: {
      width: '90%',
      marginTop: '17px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  rightOptions: {
    margin: '3px 20px 0 70px',
    paddingBottom: '30px',
    width: '100px',
    [theme.breakpoints.down('sm')]: {
      margin: '3px 20px 0 30px',
    },
    [theme.breakpoints.only('xs')]: {
      display: 'flex',
      width: 'auto',
      marginTop: '10px',
    },
  },

  passwordWrapper: {
    marginTop: '40px',
    [theme.breakpoints.only('xs')]: {
      marginTop: '20px',
    },
  },

  timeBonusWrapper: {
    marginTop: '25px',
    [theme.breakpoints.only('xs')]: {
      marginTop: '10px',
    },
  },

  submitButton: {
    color: theme.palette.primary.contrastText,
    backgroundColor: '#6f8eff',
    marginTop: '15px',
    width: '130px',
    [theme.breakpoints.only('xs')]: {
      display: 'block',
      width: '160px',
    },
  },
}));
