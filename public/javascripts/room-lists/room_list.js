const add_btn = document.getElementById("add_btn");
const rooms = document.getElementById("rooms");
const new_room_form = document.getElementById("new_room_form");
const room_name_label = document.getElementById("room_name_label");
const room_name_input = document.getElementById("room_name_input");
const room_passwd = document.getElementById("room_password");
const list = document.getElementsByClassName("list_header")[0];
var game_type = document.getElementById("game_type").innerHTML;
const max_players = new Map([
    ['chess', 2],
    ['checkers', 2],
    ['domino', 2],
]);

window.addEventListener('load', function() {
    var socket = io();
    game_type = game_type.substr(0, game_type.indexOf(' ')).toLowerCase(); 

    socket.emit('join-room-list', game_type);
    socket.emit('load_rooms', game_type);

    add_btn.addEventListener('click', () => {    //open new room form
        if($(".new_room_div").css('display') != 'none') {
            $(".new_room_div").slideUp(300)
            add_btn.innerHTML = "+";
        }
        else {
            $(".new_room_div").slideDown(300)
            add_btn.innerHTML = "−";
        }
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
                    password: room_passwd.value},
            success: function(msg) {
                if(msg === true)
                    $.redirect('/' + game_type + '-list/' + room_name_input.value, {
                        'game_type': game_type}, 'GET');
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
                                    '<div id="'+ room_name +'" style="background-color:'+ color + '; display:none" class="list_item">'+
                                    '<form class="formPwdValidator" method="POST" style="width:100%;">'+
                                    '<input name="password" style="display: inline; width: 50%; max-width: 400px; margin-left:10%; height:30px" type="password" placeholder="Password">' +                       
                                    '<input style="display: inline; width: 30%; margin-right:10%; height:30px; margin-bottom:0; padding:0" type="submit" value="Join">'+
                                    '<input type="hidden" name="room" value="' + element[0] + '" /></form></div>';
                content.addEventListener("click", expandChildren, false);
            }
            else {
                content.innerHTML += '<div style=background-color:'+ Colors.random() +
                                    ' class="list_item"> <p>'+ room_name +'</p>' + lock +
                                    insert_user_img(element[1], max_players.get(game_type)) + '</div>';
                content.addEventListener("click", getUnlockedRoom, false);       
            }
            rooms.appendChild(content);
        });
    });

    $(document).on('submit', '.formPwdValidator', function(e) {
        e.preventDefault();
        var targetElement = e.target || e.srcElement;
        let roomFullName = targetElement.childNodes[2].value
        $.ajax({
            method: "POST",
            url: '/validate-room-password',
            data: { fullRoomName: roomFullName,
                    password: targetElement.firstChild.value },                      
            success: function(msg) {
                if(msg === true)
                    $.redirect('/' + game_type + '-list/' + roomFullName.substring(roomFullName.indexOf("-") + 1), {
                        'game_type': game_type, 'room_name': targetElement.firstChild.value }, 'GET');
                else {
                    targetElement.firstChild.value = ""
                    targetElement.firstChild.placeholder = msg
                }
            }
        })
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

function expandChildren(event) {        //needs cleanup
    var targetElement = event.target || event.srcElement;
    if(targetElement.tagName == 'INPUT')
        return
    if(targetElement.tagName != 'DIV')
        targetElement = targetElement.parentElement;
    if(targetElement.firstChild.tagName != 'FORM')
        targetElement = targetElement.nextSibling;
    targetElement = targetElement.id
        console.log(targetElement.tagName);
    if ($('#'+targetElement).css('display') != "none")
        $('#'+targetElement).slideUp(250);
    else
        $('#'+targetElement).slideDown(250);
}

function getUnlockedRoom() {
    $.ajax({
        method: "POST",
        url: '/validate-room-password',
        data: { fullRoomName: roomFullName,
                password: targetElement.firstChild.value },                      
        success: function(msg) {
            if(msg === true)
                $.redirect('/' + game_type + '-list/' + roomFullName.substring(roomFullName.indexOf("-") + 1), {
                    'game_type': game_type, 'room_name': targetElement.firstChild.value }, 'GET');
            else {
                targetElement.firstChild.value = ""
                targetElement.firstChild.placeholder = msg
            }
        }
    })   
}