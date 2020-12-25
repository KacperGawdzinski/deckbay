const room_name = document.getElementById("room_name").textContent

window.addEventListener('load', function() {
    var socket = io();
    
    socket.emit('join-new-room', { game: game_type, room: room_name} );
})