const messagesBox = document.getElementById('messages');
const sendMessageButton = document.getElementById('message-submit');
const msgBox = document.getElementById('message');

sendMessageButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    socket.emit( 'message-sent-to-server', msgBox.value );
    msgBox.value = '';
});

socket.on('message-sent-to-client', (msg, user, time) => {
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('message-container');
    newMessageDiv.innerHTML = `<p class='meta'>${user} <span> ${time}</span></p>
                               <p class='msg'>${msg}</p>`;
    messagesBox.appendChild( newMessageDiv );
});
