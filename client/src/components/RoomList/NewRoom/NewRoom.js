import './NewRoom.css'

const NewRoom = () => {
    return (
    <div className="new_room_div">
        <form id="new_room_form" className="new_room_form" autoComplete="off">

            <label id="room_name_label">Room name</label>
            <input type="text" id="room_name_input" placeholder="Your room name..."/>

            <label>Password</label>
            <input type="password" id="room_password" placeholder="(optional)"/>

        </form>
    </div>
)}

export default NewRoom