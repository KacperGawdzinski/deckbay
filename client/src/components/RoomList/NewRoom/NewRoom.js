import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './NewRoom.css';

const NewRoom = ({ game }) => {
    //const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'http://deckbay.herokuapp.com';
    //change to useReducer()
    const [roomName, setRoomName] = useState('');
    const [infoLabel, setInfoLabel] = useState('Room name');
    const [roomPassword, setRoomPassword] = useState('');
    const [roomSide, setRoomSide] = useState('');
    const [roomGameLength, setGameLength] = useState('');
    const [roomGameBonus, setGameBonus] = useState('');
    const [infoLabelColor, setInfoLabelColor] = useState('white');
    const history = useHistory();

    const Submit = e => {
        e.preventDefault();
        axios
            .post('validate-room', {
                //axios.post(`${API_ENDPOINT}/validate-room`, {
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
            })
            .then(res => {
                if (res.data === true) history.push(`/${game}/${roomName}`);
                else {
                    setInfoLabel(res.data);
                    setInfoLabelColor('red');
                }
            });
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

                <label> Password </label>
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
                <input type="submit" value="Create new room!"></input>
            </form>
        </div>
    );
};

export default NewRoom;
