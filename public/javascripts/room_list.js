const add_btn = document.getElementById("add_btn");
const rooms =  document.getElementById("rooms");
const new_room_form = document.getElementById("new_room_form");
const room_name_label = document.getElementById("room_name");
const new_room_div = document.getElementsByClassName("new_room_div")[0];
const list = document.getElementsByClassName("list_header")[0];
var game_type = document.getElementById("game_type").innerHTML;
let add_room_div_display = false;

window.addEventListener('load', function() {
    var socket = io();
    game_type = game_type.substr(0, game_type.indexOf(' ')).toLowerCase(); 
    console.log(game_type);
    socket.emit('load_rooms', game_type);

    add_btn.onclick = ( () => {                         //open new room form
        if(add_room_div_display) {
            new_room_div.style.display = 'none';
            add_btn.innerHTML = "+";
        }
        else {
            new_room_div.style.display = 'flex';
            add_btn.innerHTML = "−";
        }
        add_room_div_display = !add_room_div_display;
    });

    new_room_form.addEventListener('submit', ( event => {               //validate new room name
        event.preventDefault();
        var input = document.getElementById("room_name");
        $.ajax({
            method: "POST",
            url: '/validate-room',
            data: { game: game_type, 
                    room: input.value },
            success: function(msg) {
                if(msg === 'true')
                    window.location.href = '/' + game_type + '-list/' + input.value;
                else {
                    room_name_label.value = msg;
                    room_name_label.style.color = 'red';
                }
            }
        })
    }))

    socket.on('rooms', function(data) {             //create room list
        console.log('received room list');
        while (rooms.firstChild) {                  //remove every kid - change for only necesarry ones
            rooms.removeChild(rooms.firstChild);
        }
        data.forEach(element => {
            var content = document.createElement('div');
            let room_name = element.substr(element.indexOf('-')+1, element.length);
            content.innerHTML += '<a href="/' + game_type + '-list/' + room_name + 
                                '"><div style="background-color:'+ getRandomColor() +
                              ' " class="list_item"> <p>'+ room_name +'</p> </div></a>';
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