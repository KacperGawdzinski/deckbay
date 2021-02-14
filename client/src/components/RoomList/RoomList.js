import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import './RoomList.css'

const RoomList = ({game}) => {
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        const socket = io()
        socket.emit('join-room-list', game)
        socket.emit('load_rooms', game);
        
        socket.on('rooms', data => {
            console.log(data);
        })
    }, [])

    return (
    <div class="container">
        <div class="list">
            <div class="list_header">
                <button id="add_btn" class="add_btn">+</button>
                <p id="game_type">{game.toUpperCase() } ROOM LIST</p>
            </div>
            <div id="rooms"></div>
        </div>
    </div>
)}

export default RoomList;