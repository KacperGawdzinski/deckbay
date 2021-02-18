import { useState } from 'react'
import { useHistory } from "react-router-dom";
import axios from 'axios'
import './NewRoom.css'

const NewRoom = ({ game }) => {
    const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'http://deckbay.herokuapp.com';
    const [roomName, setRoomName] = useState("")
    const [roomPassword, setRoomPassword] = useState("")
    const [roomSide, setRoomSide] = useState("")
    const [roomGameLength, setGameLength] = useState("")
    const [roomGameBonus, setGameBonus] = useState("")
    const history = useHistory()

    const Submit = (e) => {
        /*e.preventDefault()
        var targetElement = e.target
        let roomFullName = targetElement.childNodes[2].value
        let roomName = roomFullName.substring(roomFullName.indexOf("-") + 1)

        axios.post("http://localhost:3000/validate-room", {
            fullRoomName: roomFullName,
            password: targetElement.firstChild.value
        }).then(res => {
            if(res === true)
                history.push(`/${roomName}`)
            else {
                targetElement.firstChild.value = ""
                targetElement.firstChild.placeholder = res
            }
        })*/
        e.preventDefault();
        let side = 1
        //if($("#black").is(':checked'))      side = 2
        //else if($("#white").is(':checked')) side = 1 //add validation on client site
        axios.post("localhost:5000/validate-room", {
        //axios.post(`${API_ENDPOINT}/validate-room`, {
            game: game, 
            room: roomName,
            password: roomPassword,
            side: side,
            white: null,
            black: null,
            readyWhite: false,
            readyBlack: false,                    
            drawWhite: false,
            drawBlack: false,
            length: roomGameLength,
            bonus: roomGameBonus
        }).then(res => {
            if(res.data === true)
                history.push(`/chess/${roomName}`)
            else {
                //room_name_label.innerHTML = msg;
                //room_name_label.style.color = 'red';
            }
        })
    }

    return (
    <div className="new_room_div">
        <form id="new_room_form" className="new_room_form" autoComplete="off" onSubmit={Submit}>

            <label id="room_name_label">Room name</label>
            <input type="text" placeholder="Your room name..." onChange={(e) => setRoomName(e.target.value.toLowerCase())}/>

            <label>Password</label>
            <input type="password" placeholder="(optional)" onChange={(e) => setRoomPassword(e.target.value.toLowerCase())}/>
            {(game === 'chess' || game === 'checkers') &&
            <div>
                <div style={{display: "flex", justifyContent: "space-around", marginTop: "10px"}}>
                    <div className="ck-button">
                        <label>
                            <input type="checkbox" id="black" value="1" hidden/><span>Black</span>
                        </label>
                    </div>
                    <div className="ck-button">
                        <label>
                            <input type="checkbox" id="white" value="1" hidden/><span>White</span>
                        </label>
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "space-around", marginTop: "10px", marginBottom: "10px"}}>
                    <input type="number" placeholder="Game length" min="1" max="30" step="1" onChange={(e) => setGameLength(e.target.value)}/>
                    <input type="number" placeholder="Move bonus" min="1" max="30" step="1" onChange={(e) => setGameBonus(e.target.value)}/>
                </div>
            </div>}
            <input id="new_room_submit" type="submit" value="Create new room!"></input>
        </form>
    </div>
)}

export default NewRoom