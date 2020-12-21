const room_name = document.getElementById("room_name").textContent

window.addEventListener('load', function() {
    var socket = io();
    console.log('XD')
    let game_type = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1, 
        window.location.href.lastIndexOf("-")
    );
    socket.emit('join-new-room', { game: game_type, room: room_name} );
})