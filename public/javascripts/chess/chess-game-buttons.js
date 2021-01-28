const drawButton = document.getElementById("draw");
const surrenderButton = document.getElementById("surrender");

let pendingSurrender = false;

drawButton.addEventListener('click', () => {
    socket.emit('draw-chess');
});

surrenderButton.addEventListener('click', () => {
    if( !pendingSurrender )
    {
        pendingSurrender = true;
        surrenderButton.style.color = 'red';
    }
    else
        socket.emit('chess-surrender');
        
});