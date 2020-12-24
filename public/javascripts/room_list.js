const add_btn = document.getElementById("add_btn");
const rooms = document.getElementById("rooms");
const new_room_form = document.getElementById("new_room_form");
const room_name_label = document.getElementById("room_name_label");
const room_name_input = document.getElementById("room_name_input");
const room_passwd = document.getElementById("room_password");
const new_room_div = document.getElementsByClassName("new_room_div")[0];
const list = document.getElementsByClassName("list_header")[0];
var game_type = document.getElementById("game_type").innerHTML;
let add_room_div_display = false;
const max_players = new Map([
    ['chess', 2],
    ['checkers', 2],
    ['domino', 2],
]);

window.addEventListener('load', function() {
    var socket = io();
    game_type = game_type.substr(0, game_type.indexOf(' ')).toLowerCase(); 
    socket.emit('load_rooms', game_type );

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

    room_name_input.addEventListener('input', function () {
        room_name_label.innerHTML = 'Room name';
        room_name_label.style.color = 'white';
    })

    new_room_form.addEventListener('submit', ( event => {               //validate new room name
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: '/validate-room',
            data: { game: game_type, 
                    room: room_name_input.value,
                    password: room_passwd.value},                             //encode in future
            success: function(msg) {
                if(msg === 'true')
                    $.redirect('/' + game_type + '-list/' + room_name_input.value, {
                        'game_type': game_type, 'room_name': room_name_input.value }, 'GET');
                else {
                    room_name_label.innerHTML = msg;
                    room_name_label.style.color = 'red';
                }
            }
        })
    }))

    socket.on('rooms', function(data) {             //create room list
        console.log('received room list');
        console.log(data);
        while (rooms.firstChild) {
            rooms.removeChild(rooms.firstChild);
        }
        data.forEach(element => {
            var content = document.createElement('div');
            let room_name = element[0].substr(element[0].indexOf('-')+1, element[0].length);
            let lock = insert_lock_img(element[2]);
            if(lock != '') {
                let color = Colors.random()
                content.innerHTML +='<div style=background-color:'+ color +
                                    ' class="list_item"> <p>'+ room_name +'</p>' + lock +
                                    insert_user_img(element[1], max_players.get(game_type)) + '</div>' +
                                    '<div style="background-color:'+ color + '; display:none" class="list_item">'+
                                    '<input style="display: inline; width: 50%; max-width: 400px; margin-left:10%; height:30px" type="password" placeholder="Password">' +                       
                                    '<input style="display: inline; width: 30%; margin-right:10%; height:30px; margin-bottom:0; padding:0" type="submit" value="Join"></div>';
                content.addEventListener("click", expandChildren, false);
            }
            else {
                content.innerHTML += '<a style="text-decoration: none;" href="/' + game_type + '-list/' + room_name + 
                                    '"><div style=background-color:'+ Colors.random() +
                                    ' class="list_item"> <p>'+ room_name +'</p>' + lock +
                                    insert_user_img(element[1], max_players.get(game_type)) + '</div></a>';
            }
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

function insert_user_img(count, max) {
    var res = "";
    for(let i = 1; i <= max; i++) {
        if(i <= count)
            res += '<img class="user_img" src="/public/images/user.png">';
        else
            res += '<img class="user_img" src="/public/images/inactive-user.png">';
    }
    return res;
}

function insert_lock_img(check) {
    if(check)
        return '<img class="lock_img" src="/public/images/lock.png">';
    return '';
}

function expandChildren(event) {
    var targetElement = event.target || event.srcElement;
    if(targetElement.tagName != 'DIV')
        targetElement = targetElement.parentElement;
    targetElement = targetElement.nextSibling;

    if (targetElement.style.display === "none")
        targetElement.style.display = "inline-block";
    else
        targetElement.style.display = "none";
}