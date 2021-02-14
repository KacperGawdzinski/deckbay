window.addEventListener('load', function() {
    new_room_form.addEventListener('submit', ( event => {
        event.preventDefault();
        let side
        if($("#black").is(':checked'))      side = 2
        else if($("#white").is(':checked')) side = 1
        $.ajax({    //add validation on client site
            method: "POST",
            url: '/validate-room',
            data: { game: game_type, 
                    room: room_name_input.value,
                    password: room_passwd.value,
                    side: side,
                    white: null,
                    black: null,
                    readyWhite: false,
                    readyBlack: false,                    
                    drawWhite: false,
                    drawBlack: false,
                    length: $('#glength').val(),
                    bonus: $('#blength').val() },
            success: function(msg) {
                if(msg === true)
                    $.redirect('/' + game_type + '/' + room_name_input.value.toLowerCase(), {
                        'game_type': game_type}, 'POST');
                else {
                    room_name_label.innerHTML = msg;
                    room_name_label.style.color = 'red';
                }
            }
        })
    }))

    $('#black').on('change', function() {
        $('#white').prop( "checked", false );
    })

    $('#white').on('change', function() {
        $('#black').prop( "checked", false );
    })
})