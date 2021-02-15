import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import NewRoom from './NewRoom/NewRoom'
import './RoomList.css'

const RoomList = ({game}) => {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState(false);
    useEffect(() => {
        const socket = io()
        socket.emit('join-room-list', game)
        socket.emit('load_rooms', game);
        
        socket.on('rooms', data => {
            console.log(data);
        })
    }, [])

    return (
    <div className="container">
        <div className="list">
            <div className="list_header">
                <button id="add_btn" className="add_btn" onClick={() => {setNewRoom(!newRoom); console.log(newRoom)}}> + </button>
                <p id="game_type">{game.toUpperCase() } ROOM LIST</p>
            </div>
            {newRoom && <NewRoom/>}
            <div id="rooms"></div>
        </div>
    </div>
)}

export default RoomList;