const drawButton = document.getElementById('draw');
const surrenderButton = document.getElementById('surrender');
const sendMessageButton = document.getElementById('message-submit');
const msgBox = document.getElementById('message');

const movesBox = document.getElementById('moves');
const messagesBox = document.getElementById('messages');
const whitePlayerName = document.getElementById('white-player-name');
const blackPlayerName = document.getElementById('black-player-name');

let pendingSurrender = false;
let moveNum = 1;

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

sendMessageButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    socket.emit( 'message-sent-to-server', msgBox.value );
    msgBox.value = '';
});

socket.on('chess-send-players-colours', msg => { 
    msg = msg.split(';');
    whitePlayerName.innerHTML = msg[0];
    blackPlayerName.innerHTML = msg[1];
});

socket.on('message-sent-to-client', (msg, user, time) => {
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('message-container');
    newMessageDiv.innerHTML = `<p class='meta'>${user} <span> ${time}</span></p>
                               <p class='msg'>${msg}</p>`;
    messagesBox.appendChild( newMessageDiv );
});

socket.on('server-chess-move', msg => {
    if ( msg == "P") alert('Draw!');
    else if ( msg == "DW" || msg == "DB" )
        alert(`${ msg == 'DB' ? 'White' : 'Black' } player surrendered :c`);

    else if(msg != '' && msg != false){

        setViewUnchecked( cellMarkedChecked.row, cellMarkedChecked.col );
        let toDo = msg.split(';');
        let move = toDo[0];
        movePieceView(move[0], move[1], move[2], move[3]);
        addMoveToMoveList(move);

        if( toDo[1] && toDo[1].includes('M') ){ //we have a checkmate
            markChecking( toDo[1][1] == 'B' ? whitePiece : blackPiece );
            alert(`${ toDo[1][1] == 'B' ? 'Black' : 'White' } player has won!`)
        } else if ( toDo[1] && toDo[1].includes('C') ) 
            markChecking( toDo[1][1] == 'B' ? whitePiece : blackPiece );
    } 

    fieldClicked = false;
    unsetPossibilities();
});

function addMoveToMoveList(moveTab){
    const moveStr = `${String.fromCharCode(64 + parseInt(moveTab[1]))}${9 - moveTab[0]}➜`+
                    `${String.fromCharCode(64 + parseInt(moveTab[3]))}${9 - moveTab[2]}`;

    console.log(moveStr);
    let divToAppend = document.getElementById(`move-${moveNum}`);
    if(divToAppend != null) console.log(divToAppend.childElementCount);
    if( divToAppend == null){ //we have to create div matched to next move and put white move there
        createMoveDiv( moveStr );
    }
    
    else{ //we can only add black move
        addBlackMoveDiv( moveStr );
        moveNum += 1; //now its white's turn -> new div 
    }
}

function createMoveDiv( moveText ){
    let divToAppend = document.createElement('div');
    divToAppend.setAttribute('id', `move-${moveNum}`);
    divToAppend.classList.add('move');
    movesBox.appendChild(divToAppend);

    let moveNumDiv = document.createElement('div');
    moveNumDiv.setAttribute('id', `move-num-${moveNum}`);
    moveNumDiv.classList.add('move-num');
    moveNumDiv.innerHTML = moveNum;
    divToAppend.appendChild(moveNumDiv);

    let moveWhiteDiv = document.createElement('div');
    moveWhiteDiv.setAttribute('id', `move-white-${moveNum}`);
    moveWhiteDiv.classList.add('move-player');
    moveWhiteDiv.innerHTML = moveText;
    divToAppend.appendChild(moveWhiteDiv);

    let moveBlackDiv = document.createElement('div');
    moveBlackDiv.setAttribute('id', `move-black-${moveNum}`);
    moveBlackDiv.classList.add('move-player');
    divToAppend.appendChild(moveBlackDiv);
}

function addBlackMoveDiv(moveText){
    document.getElementById(`move-black-${moveNum}`).innerHTML = moveText;
}