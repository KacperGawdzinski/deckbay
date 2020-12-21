const room_name = document.getElementById("room_name").textContent

window.addEventListener('load', function() {
    var socket = io();
    socket.join(room_name);
})