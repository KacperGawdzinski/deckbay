import React, { useState, useRef } from 'react';
import Colors from '../../colors';
import ActiveUser from '../../assets/images/user.png';
import InactiveUser from '../../assets/images/inactive-user.png';
import Lock from '../../assets/images/lock.png';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './RoomListItem.css';

const RoomListItem = ({ info, game }) => {
    const maxPlayers = new Map([
        ['chess', 2],
        ['checkers', 2],
        ['charades', 10],
    ]);
    const [color, setColor] = useState(Colors.random());
    const [expanded, setExpanded] = useState(false);
    const [setHeight, setHeightState] = useState('0px');
    const [infoLabel, setInfoLabel] = useState('Password');
    const [infoValue, setInfoValue] = useState('');
    const wrapper = useRef(null);
    const history = useHistory();
    let playerIcons = [];

    if (game === 'chess' || game === 'checkers') {
        for (let i = 1; i <= maxPlayers.get(game); i++) {
            if (i <= info.playerCount)
                playerIcons.push(<img key={i} className="user_img" src={ActiveUser} alt="activeUser" />);
            else playerIcons.push(<img key={i} className="user_img" src={InactiveUser} alt="inactiveUser" />);
        }
    }

    function Expand() {
        setExpanded(!expanded);
        if (info.password) setHeightState(expanded ? '0px' : `${wrapper.current.scrollHeight}px`);
    }

    const Submit = e => {
        e.preventDefault();
        var targetElement = e.target;
        let roomFullName = targetElement.childNodes[2].value;
        let roomName = roomFullName.substring(roomFullName.indexOf('-') + 1);

        axios
            .post('validate-room-password', {
                fullRoomName: roomFullName,
                password: targetElement.firstChild.value,
            })
            .then(res => {
                if (res.data === true) history.push(`/${roomName}`);
                else {
                    setInfoValue('');
                    setInfoLabel(res.data);
                }
            });
    };

    return (
        <div>
            <div style={{ backgroundColor: color }} className="list_item" onClick={Expand}>
                <p className="room_name">
                    {' '}
                    {info.fullRoomName.substr(info.fullRoomName.indexOf('-') + 1, info.fullRoomName.length)}{' '}
                </p>
                {(game === 'chess' || game === 'checkers') && (
                    <React.Fragment>
                        <p className="time"> {`${info.options.length} ┃ ${info.options.bonus}`} </p>
                    </React.Fragment>
                )}

                {info.password ? <img className="lock_img" src={Lock} /> : null}

                {game === 'chess' || game === 'checkers' ? (
                    <React.Fragment> {playerIcons} </React.Fragment>
                ) : (
                    <React.Fragment>
                        <p>{`${info.playerCount} / ${maxPlayers.get(game)}`}</p>
                        <img className="user_img" src={ActiveUser} />
                    </React.Fragment>
                )}
            </div>
            {info.password && (
                <div ref={wrapper} className="animation_wrapper" style={{ maxHeight: `${setHeight}` }}>
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
                                onChange={e => setInfoValue(e.target.value)}
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
            )}
        </div>
    );
};

export default RoomListItem;
