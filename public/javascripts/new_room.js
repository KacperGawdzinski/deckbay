const add_btn = document.getElementById("add_btn");
const rooms =  document.getElementById("rooms");

window.addEventListener('load', function() {
    var socket = io();

    socket.emit('load_rooms', 'chess');

    add_btn.onclick = ( () => {     //add new room to list
        socket.emit('new_room', { game: 'chess', room_name: 'table' });
    });

    socket.on('rooms', function(data) { //create room list

        while (rooms.firstChild) {  //remove every kid - change for only necesarry ones
            rooms.removeChild(rooms.firstChild);
        }
        data.forEach(element => {
            var content = document.createElement('div');
            content.innerHTML += '<a href="#"><div style="background-color:'+ getRandomColor() +
                              ' " class="list_item"> <p>'+ element +'</p> </div></a>';
            rooms.appendChild(content);
        });
    });
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}