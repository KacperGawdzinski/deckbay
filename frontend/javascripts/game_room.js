window.addEventListener('load', function() {
    var socket = io();
    socket.on('connect', () => {
        $.ajax({
            type: "POST",
            url: "/set-socket-id",
            data: {socketid: socket.id},
            success: function(data) {
                let room_name = data.substr(data.indexOf('-')+1, data.length);
                let game_type = data.substr(0, data.indexOf('-'))
                socket.emit('join-new-room', { game: game_type, room: room_name });
            }
        })
    });
})