const drawButton = document.getElementById('draw');
const surrenderButton = document.getElementById('surrender');

let confirmUndoButton = document.getElementById('undo-aye');
let declineUndoButton = document.getElementById('undo-nay');
let undoButton = document.getElementById('restart');

const movesBox = document.getElementById('moves');
const whitePlayerName = document.getElementById('white-player-name');
const blackPlayerName = document.getElementById('black-player-name');
let undoButtonsClass = document.getElementsByClassName('undo-button');

let pendingSurrender = false;
let moveNum = 1;

socket.on('connect', () => {
    $.ajax({
        type: "POST",
        url: "/set-socket-id",
        data: {socketid: socket.id},
        success: function(data) {
            if ( data === '' ) {
                window.location.href ='/';
            } else {
                let room_name = data.substr(data.indexOf('-') + 1, data.length);
                let game_type = data.substr(0, data.indexOf('-'))
                socket.emit('join-new-room', { game: game_type, room: room_name });
                socket.emit('chess-color-req');
            };
        }
    });
});

socket.on('chess-color-res', ifWhite => { userColor = ifWhite ? whitePiece : blackPiece; });

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

undoButton.addEventListener('click', () => {
    socket.emit( 'chess-undo-req' );
});

confirmUndoButton.addEventListener('click', () => {
    socket.emit( 'chess-undo-res', true );
});

declineUndoButton.addEventListener('click', () => {
    socket.emit( 'chess-undo-res', false );
});

socket.on('chess-takeback-server-response', (moveObj) => {
    if( moveObj == '' ){
        resetButtonsOutlook();
        return;
    } 
    movePieceView( moveObj.endRow, moveObj.endCol, moveObj.startRow, moveObj.startCol );
    setPieceObj( moveObj.endRow, moveObj.endCol, 
        { 
            piece : moveObj.piece.piece, 
            color : moveObj.piece.white ? whitePiece : blackPiece
        } );
    
    setPieceView( moveObj.endRow, moveObj.endCol, moveObj.piece.piece );
    setViewColor( moveObj.endRow, moveObj.endCol, ( moveObj.piece.white ? whitePiece : blackPiece ) );

    resetButtonsOutlook();
    removeLastMove();
    fieldClicked = false;
    unsetPossibilities();
});

socket.on('chess-enemy-takeback-request', () => {
    undoButton.style.display = 'none !important';
    for(let i = 0; i < 2; i++) { undoButtonsClass[i].style.display = 'block' };
});

socket.on('chess-send-players-colours', msg => { 
    msg = msg.split(';');
    whitePlayerName.innerHTML = msg[0];
    blackPlayerName.innerHTML = msg[1];
});

socket.on('server-chess-move', msg => {
    resetButtonsOutlook();

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

    let divToAppend = document.getElementById(`move-${moveNum}`);

    if( divToAppend == null){ //we have to create div matched to next move and put white move there
        createMoveDiv( moveStr );
    }
    
    else{ //we can only add black move
        addBlackMoveDiv( moveStr );
        moveNum += 1; //now its white's turn -> new div 
    }
};

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
};

function addBlackMoveDiv(moveText){
    document.getElementById(`move-black-${moveNum}`).innerHTML = moveText;
};

function removeLastMove(){
    let divToRemove = document.getElementById(`move-${moveNum}`);

    if( divToRemove.children[2].innerHTML != '' ){
        divToRemove.children[2].innerHTML == '';
    } else {
        movesBox.removeChild( divToRemove );
        moveNum--;
    }
};

function resetButtonsOutlook(){
    undoButton.style.display = 'block !important';
    for(let i = 0; i < 2; i++) { undoButtonsClass[i].style.display = 'none' };

    surrenderButton.style.color = 'white';
};