window.addEventListener('load', function() {
    new_room_form.addEventListener('submit', ( event => {
        event.preventDefault();
        let side
        if($("#black").is(':checked'))      side = 'black'
        else if($("#white").is(':checked')) side = 'white'

        $.ajax({    //add validation on client site
            method: "POST",
            url: '/validate-room',
            data: { game: game_type, 
                    room: room_name_input.value,
                    password: room_passwd.value,
                    side: side,
                    length: $('#glength').val(),
                    bonus: $('#blength').val() },
            success: function(msg) {
                if(msg === true)
                    $.redirect('/' + game_type + '-list/' + room_name_input.value, {
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