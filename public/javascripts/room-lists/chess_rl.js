window.addEventListener('load', function() {
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
})