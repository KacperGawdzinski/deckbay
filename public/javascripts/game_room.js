const room_name = document.getElementById("room_name").textContent

window.addEventListener('load', function() {
    var socket = io();
    
    let game_type = window.location.href.split('/')             //prolly needs editing
    game_type = game_type[3].substr(0, game_type[3].indexOf('-')); 

    socket.emit('join-new-room', { game: game_type, room: room_name} );
})