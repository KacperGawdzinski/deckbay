import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import NewRoom from './NewRoom/NewRoom'
import RoomListItem from '../RoomListItem/RoomListItem'
import './RoomList.css'

const RoomList = ({game}) => {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState(false);
    const [setHeight, setHeightState] = useState("0px")

    const content = useRef(null)

    useEffect(() => {
        const socket = io()
        socket.emit('join-room-list', game)
        socket.emit('load_rooms', game);
        
        socket.on('rooms', data => {
            setRooms(data)
        })
    }, [])

    return (
    <div className="container">
        <div className="list">
            <div className="list_header">
                <button id="add_btn" className="add_btn" onClick={() => {setNewRoom(!newRoom); setHeightState(newRoom? "0px" : `${content.current.scrollHeight}px`)}}> 
                    {newRoom? '−' : '+'}
                </button>
                <p id="game_type"> { game.toUpperCase() } ROOM LIST</p>
            </div>
            <div ref={content} className="animation_wrapper" style={{ maxHeight: `${setHeight}` }}>
                <NewRoom game={game}/>
            </div>
            <div id="rooms">
                {rooms.map(info => {
                    return <RoomListItem info={info} game={game}/>
                })}
            </div>
        </div>
    </div>
)}

export default RoomList;