import './NewRoom.css'

const NewRoom = ({ game }) => {
    return (
    <div className="new_room_div">
        <form id="new_room_form" className="new_room_form" autoComplete="off">

            <label id="room_name_label">Room name</label>
            <input type="text" id="room_name_input" placeholder="Your room name..."/>

            <label>Password</label>
            <input type="password" id="room_password" placeholder="(optional)"/>
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
                    <input id="glength" type="number" placeholder="Game length" min="1" max="30" step="1"/>
                    <input id="blength" type="number" placeholder="Move bonus" min="1" max="30" step="1"/>
                </div>
            </div>}
            <input id="new_room_submit" type="submit" value="Create new room!"></input>
        </form>
    </div>
)}

export default NewRoom