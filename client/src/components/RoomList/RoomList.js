import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import NewRoom from './NewRoom/NewRoom';
import RoomListItem from '../RoomListItem/RoomListItem';
import './RoomList.css';

const RoomList = ({ game }) => {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState(false);
    const [setHeight, setHeightState] = useState('0px');

    const content = useRef(null);
    let a = [
        {
            fullRoomName: 'asdadad',
            playerCount: 1,
            options: {
                length: 1,
                bonus: 2,
            },
            password: true,
        },
    ];

    useEffect(() => {
        const socket = io();
        socket.emit('join-room-list', game);
        socket.emit('load_rooms', game);

        socket.on('rooms', data => {
            setRooms(data);
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div className="roomListDiv">
            <div className="list">
                <div className="list_header">
                    <button
                        className="add_btn"
                        onClick={() => {
                            setNewRoom(!newRoom);
                            setHeightState(newRoom ? '0px' : `${content.current.scrollHeight}px`);
                        }}
                    >
                        {newRoom ? '−' : '+'}
                    </button>
                    <p> {game.toUpperCase()} ROOM LIST</p>
                </div>
                <div ref={content} className="animation_wrapper" style={{ maxHeight: `${setHeight}` }}>
                    <NewRoom game={game} />
                </div>
                <div>
                    {a.map(info => {
                        return <RoomListItem key={info.fullRoomName} info={info} game={game} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoomList;
