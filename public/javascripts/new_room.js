const add_btn = document.getElementById("add_btn");
const rooms =  document.getElementById("rooms");

window.addEventListener('load', function() {
    var socket = io();

    add_btn.onclick = ( () => {
        console.log('creating new room...');
        socket.emit('new_room', 'chess');
        socket.emit('load_rooms');
    });

    socket.on('rooms', function(data) {
        console.log('new rooms created');
        console.log(data)
        rooms.remove();
        data.forEach(element => {
            rooms.append('<div class="list_item"> <p>{{element}}</p> </div>');
        });
    });
});
