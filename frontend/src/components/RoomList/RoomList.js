import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

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
    <div className="roomListDiv">
      <div className="list">
        <div className="list_header">
          <button
            className="add_btn"
            onClick={() => {
              setNewRoom(!newRoom);
              setHeightState(
                newRoom ? '0px' : `${content.current.scrollHeight}px`,
              );
            }}>
            {newRoom ? '−' : '+'}
          </button>
          <p> {game.toUpperCase()} ROOM LIST</p>
        </div>
        <div
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
        </div>
      </div>
    </div>
  );
};

export default RoomList;
