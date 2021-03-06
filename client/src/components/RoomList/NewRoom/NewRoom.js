import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import HorizontalScroll from '../HorizontalScroll/HorizontalScroll';
import './NewRoom.css';

const NewRoom = ({ game }) => {
    //change to useReducer()
    const [roomName, setRoomName] = useState('');
    const [infoLabel, setInfoLabel] = useState('Room name');
    const [roomPassword, setRoomPassword] = useState('');
    const [roomSide, setRoomSide] = useState('');
    const [roomGameLength, setGameLength] = useState('');
    const [roomGameBonus, setGameBonus] = useState('');
    const [infoLabelColor, setInfoLabelColor] = useState('white');

    const history = useHistory();

    const Submit = async e => {
        e.preventDefault();
        if (game === 'chess' || game === 'checkers') {
            const res = await axios.post(`/${game}/validate-room`, {
                game: game,
                room: roomName,
                password: roomPassword,
                side: roomSide,
                white: null,
                black: null,
                readyWhite: false,
                readyBlack: false,
                drawWhite: false,
                drawBlack: false,
                length: roomGameLength,
                bonus: roomGameBonus,
            });
        } else if (game === 'charades') {
            const res = await axios.post(`/${game}/validate-room`, {
                game: game,
                room: roomName,
                password: roomPassword,
            });
            if (res.data != 'OK') {
                setInfoLabel(res.data.err);
                setInfoLabelColor('red');
            } else {
                history.push(`/${game}/${roomName}`);
            }
        }
    };

    return (
        <div className="new_room_div">
            <form className="new_room_form" autoComplete="off" onSubmit={Submit}>
                <label style={{ color: infoLabelColor }}> {infoLabel} </label>
                <input
                    type="text"
                    placeholder="Your room name..."
                    onChange={e => {
                        setRoomName(e.target.value.toLowerCase());
                        setInfoLabel('Room name');
                        setInfoLabelColor('white');
                    }}
                />

                <label>Password</label>
                <input
                    type="password"
                    placeholder="(optional)"
                    onChange={e => setRoomPassword(e.target.value.toLowerCase())}
                />

                {(game === 'chess' || game === 'checkers') && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                            <div className="ck-button">
                                <label>
                                    <input type="checkbox" value="1" hidden onClick={() => setRoomSide(2)} />
                                    <span>Black</span>
                                </label>
                            </div>
                            <div className="ck-button">
                                <label>
                                    <input type="checkbox" value="1" hidden onClick={() => setRoomSide(1)} />
                                    <span>White</span>
                                </label>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                marginTop: '10px',
                                marginBottom: '10px',
                            }}
                        >
                            <input
                                type="number"
                                placeholder="Game length"
                                min="1"
                                max="30"
                                step="1"
                                onChange={e => setGameLength(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Move bonus"
                                min="1"
                                max="30"
                                step="1"
                                onChange={e => setGameBonus(e.target.value)}
                            />
                        </div>
                    </div>
                )}
                {game === 'charades' && (
                    <React.Fragment>
                        <label>Category</label>
                        <HorizontalScroll />
                    </React.Fragment>
                )}
                <input type="submit" value="Create new room!"></input>
            </form>
        </div>
    );
};

export default NewRoom;
