var board = document.getElementById('chess-board-tbody');
var tab = document.getElementById('chess-board');

var socket = io();
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
                }
        }
    })
});

let blackPiece = 'rgb(65, 65, 65)'; let whitePiece = 'rgb(255, 249, 249)';

let userColor = whitePiece;
let clickedColumn = 5, clickedRow = 5;
let fieldClicked = false; let whoseTurn = whitePiece;
let movepossibilities = [];

let chessBoard = [[]];

let blackKing = {
    row : 1,
    col : 5
}; 
let whiteKing = {
    row : 8, 
    col: 5
};

let cellMarkedChecked = {
    row : 0,
    col : 0
};

function getPiece(row, column){ return chessBoard[row][column].piece; };

function getPieceObj(row, column) { return chessBoard[row][column]; };

function setPiece(row, column, inpPiece){ chessBoard[row][column].piece = inpPiece; };

function setPieceObj(row, column, pieceObj) { return chessBoard[row][column] = pieceObj; };

function setPieceView(row, column, piece) { board.rows[row].cells[column].innerHTML = piece; }

function setViewColor(row, column, icolor){ board.rows[row].cells[column].style.color = icolor } 

function setViewChecked(row, column){ board.rows[row].cells[column].style.border = '3px solid red' };

function setViewUnchecked(row, column){ board.rows[row].cells[column].style.border = '0px' };

function pieceColor(row, column){ return chessBoard[row][column].color };

function markChecking(who){
    let king = who === whitePiece ? whiteKing : blackKing;
    setViewChecked( king.row, king.col );
    cellMarkedChecked.row = king.row; cellMarkedChecked.col = king.col;
};

function unsetPossibilities(){ 
    movepossibilities.forEach(el => {
        let elRow = Math.floor( el / 9 ); let elCol = el % 9;
        board.rows[elRow].cells[elCol].style.border = '0px'; 
    });
    movepossibilities = [];
}; 

function setPossibilities(){
    movepossibilities.forEach( el => {
        let elRow = Math.floor( el / 9 ); let elCol = el % 9;
        board.rows[elRow].cells[elCol].style.border = '5px solid green';
    });
};

function movePieceView(sRow, sCol, eRow, eCol){
    let movedPiece = getPiece(sRow, sCol);

    setViewColor( eRow, eCol, pieceColor(sRow, sCol) );
    movePieceObj(sRow, sCol, eRow, eCol);
    setPieceView( eRow, eCol, movedPiece ); setPieceView( sRow, sCol, '' );

    whoseTurn = whoseTurn === whitePiece ? blackPiece : whitePiece;
};

function movePieceObj(sRow, sCol, eRow, eCol){
    let movedPiece = getPieceObj(sRow, sCol);
    
    if( movedPiece.piece === '♚' ){
        if( pieceColor(sRow, sCol) === blackPiece ){
            blackKing.row = eRow; blackKing.col = eCol;
        } else {
            whiteKing.row = eRow; whiteKing.col = eCol;
        }
    }
    setPieceObj( eRow, eCol, movedPiece ); 
    setPieceObj( sRow, sCol, { piece : '', color : '' } );
}

function movePossible(row, column){
    let guesses = [];
    if( getPiece(row, column) === '♟' ) guesses = movesPossiblePawn(row, column);
    if( getPiece(row, column) === '♜' ) guesses = movesPossibleRook(row, column);
    if( getPiece(row, column) === '♞' ) guesses = movesPossibleKnight(row, column);
    if( getPiece(row, column) === '♝' ) guesses = movesPossibleBishop(row, column);
    if( getPiece(row, column) === '♚' ) guesses = movesPossibleKing(row, column);
    if( getPiece(row, column) === '♛' ) guesses = movesPossibleQueen(row, column);

    return guesses.filter( index => { 
        let pRow = Math.floor(index / 9), pCol = index % 9;
        let startPiece = getPieceObj(row, column);
        let endPiece = getPieceObj(pRow, pCol);
        movePieceObj(row, column, pRow, pCol);
        let checked = !ifCheck( pieceColor(pRow, pCol) );
        setPieceObj(row, column, startPiece);
        setPieceObj(pRow, pCol, endPiece);
        return checked;
    } );
};

function moveRec(sRow, sCol, hRow, hCol){
    if( !(hRow >= 1 && hRow <= 8 && hCol >= 1 && hCol <= 8) ) return false;
    
    return getPiece(hRow, hCol) === '' || pieceColor(hRow, hCol) !== pieceColor(sRow, sCol);
};

function movesPossiblePawn(row, column){
    let possibilities = [];
    let direction = pieceColor(row, column) === whitePiece ? -1 : 1;
    let startPawnRow = pieceColor(row, column) === whitePiece ? 7 : 2;

    if( column !== 1 )
        if( getPiece(row + direction, column - 1) !== '' && 
            pieceColor(row + direction, column - 1) !== pieceColor(row, column) ) 
                possibilities.push((row + direction ) * 9 + column - 1);

    if( column !== 8 )
        if( getPiece(row + direction, column + 1) !== '' && 
            pieceColor(row + direction, column + 1) !== pieceColor(row, column) ) 
                possibilities.push((row + direction ) * 9 + column + 1);

    if( getPiece(row + direction, column) === ''){
        possibilities.push( (row + direction) * 9 + column);
        direction *= 2;
        if( getPiece(row + direction, column) === '' && row === startPawnRow) possibilities.push( (row + direction) * 9 + column);
    } 

    return possibilities;
};

function moveDirection(row, col, rowDiff, colDiff){
    let direPossibilities = []
    let hRow = row + rowDiff; let hCol = col + colDiff;

    while( moveRec(row, col, hRow, hCol) ){
        direPossibilities.push(hRow * 9 + hCol);

        if ( pieceColor(hRow, hCol) !== pieceColor(row, col) && getPiece(hRow, hCol) !== '') {
            return direPossibilities;
        }

        hRow += rowDiff; hCol += colDiff;
    }
    return direPossibilities;
};

function movesPossibleRook(row, column){
    let possibilities = [];

    possibilities = possibilities.concat( moveDirection(row, column, 0, 1) );
    possibilities = possibilities.concat( moveDirection(row, column, 0, -1) );
    possibilities = possibilities.concat( moveDirection(row, column, 1, 0) );
    possibilities = possibilities.concat( moveDirection(row, column, -1, 0) );
      
    return possibilities;
};

function movesPossibleKnight(row, column){
    let possibilities = [];
    let directions = [-2, -1, 1, 2];

    directions.forEach( r => {
        directions.forEach( c => {
            if( Math.abs(c % 2) !==  Math.abs(r % 2) && moveRec(row, column, row + r, column + c) ) 
                possibilities.push( (row + r) * 9 + (column + c) ); 
        }) 
    });
    
    return possibilities;
};

function movesPossibleBishop(row, col){
    let possibilities = [];

    possibilities = possibilities.concat( moveDirection(row, col, -1, -1) );
    possibilities = possibilities.concat( moveDirection(row, col, -1, 1) );
    possibilities = possibilities.concat( moveDirection(row, col, 1, -1) );
    possibilities = possibilities.concat( moveDirection(row, col, 1, 1) );

    return possibilities;
};

function movesPossibleKing(row, column){
    let possibilities = [];

    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){ 
            if( moveRec(row, column, row + i, column + j) ) possibilities.push( (row + i) * 9 + (column + j) ); 
        };
    }

    return possibilities;
};

function movesPossibleQueen(row, column){
    return movesPossibleRook(row, column).concat( movesPossibleBishop(row, column) );
};

function checkHelper(row, column){
    let guesses = [];
    if( getPiece(row, column) === '♜' ) guesses = movesPossibleRook(row, column);
    if( getPiece(row, column) === '♞' ) guesses = movesPossibleKnight(row, column);
    if( getPiece(row, column) === '♝' ) guesses = movesPossibleBishop(row, column);
    if( getPiece(row, column) === '♚' ) guesses = movesPossibleKing(row, column);
    if( getPiece(row, column) === '♛' ) guesses = movesPossibleQueen(row, column);
    return guesses;
};

function pawnCheck(row, column){
    let possibilities = [];
    let direction = pieceColor(row, column) === whitePiece ? -1 : 1;

    if( column !== 1 )
        if( getPiece(row + direction, column - 1) !== '' ||
            pieceColor(row + direction, column - 1) !== pieceColor(row, column) ) 
                possibilities.push((row + direction ) * 9 + column - 1);

    if( column !== 8 )
        if( getPiece(row + direction, column + 1) !== '' ||
            pieceColor(row + direction, column + 1) !== pieceColor(row, column) ) 
                possibilities.push((row + direction ) * 9 + column + 1);
    return possibilities;
};

function pieceCheck(row, column){
    return getPiece(row, column) === '♟' ? pawnCheck(row, column) : checkHelper(row, column);
};

function getChecking(){
    let checked = Array(81).fill().map(() => Array());

    for(let r = 1; r <= 8; r++){
        for(let c = 1; c <= 8; c++){
            if(pieceCheck(r,c).length != 0)
                pieceCheck(r, c).forEach( check_index => {
                    checked[check_index].push(r * 9 + c);
                });
        }
    }

    return checked;
};

function ifCheck(who){
    let king = who === whitePiece ? whiteKing : blackKing;
    let kingIndex = king.row * 9 + king.col;
    let checked = getChecking();
    let enemyChecks = false;
    checked[kingIndex].forEach( index => { if( pieceColor(Math.floor(index / 9), index % 9) !== who) enemyChecks = true; } );

    return enemyChecks;
};

function createBoardTable(){
    let colorWhite = true; 

    let firstRow = board.insertRow();
    firstRow.appendChild(document.createElement('th'));
    for(let i = 0; i < 8; i++){
        let th = document.createElement('th');
        th.appendChild( document.createTextNode( String.fromCharCode(65 + i) ) );
        firstRow.appendChild( th );
    }
    board.appendChild(firstRow);

    for(let i = 0; i < 8; i++){
        let row = board.insertRow();

        let th = document.createElement('th');
        th.appendChild( document.createTextNode(8 - i) );
        row.appendChild(th);
        th.className = 'board_label';

        for(let j = 0; j < 8; j++){
            let td = row.insertCell();
            td.className = 'board_label';
            td.style.backgroundColor = colorWhite ? '#F7D2AC' : '#CE9154';
            if(j !== 7) colorWhite = !colorWhite;
        }
    }
};

function setPlayers(color){ //0 stands for black, 1 for white
    let row = color == 0 ? 2 : 7;
    let collored = color === 0 ? blackPiece : whitePiece; 

    for (let i = 1; i < 9; i++) {
        board.rows[row].cells[i].innerHTML = '♟';
        board.rows[row].cells[i].style.color = collored;
    }
    row = color == 0 ? 1 : 8;

    board.rows[row].cells[1].innerHTML = '♜';
    board.rows[row].cells[1].style.color = collored;
    board.rows[row].cells[8].innerHTML = '♜';
    board.rows[row].cells[8].style.color = collored;
    board.rows[row].cells[2].innerHTML = '♞';
    board.rows[row].cells[2].style.color = collored;
    board.rows[row].cells[7].innerHTML = '♞';
    board.rows[row].cells[7].style.color = collored;
    board.rows[row].cells[3].innerHTML = '♝';
    board.rows[row].cells[3].style.color = collored;
    board.rows[row].cells[6].innerHTML = '♝';
    board.rows[row].cells[6].style.color = collored;
    board.rows[row].cells[5].innerHTML = '♚';
    board.rows[row].cells[5].style.color = collored;
    board.rows[row].cells[4].innerHTML = '♛';
    board.rows[row].cells[4].style.color = collored;
};

function logicSetup(){
    for(let i = 1; i <= 8; i++){
        let pom = [];
        pom.push('');
        for(let j = 1; j <= 8; j++){
            pom.push( { piece : board.rows[i].cells[j].innerHTML,
                        color : board.rows[i].cells[j].style.color } );
        }
        chessBoard.push(pom);
    }
};

function boarderSetup(){
    createBoardTable();
    setPlayers(0);
    setPlayers(1);
    addListeners();
    logicSetup();
};

function addListeners(){
    board.addEventListener('click', (e) => {

        let firstFieldRow = clickedRow, firstFieldCol = clickedColumn;

        clickedColumn = e.target.cellIndex;
        clickedRow = e.target.parentNode.rowIndex;

        if(clickedColumn === 0 || clickedRow === 0) { //someone clicked on 12345678 or ABCDEFGH 
            unsetPossibilities(); return; 
        }

        if( !fieldClicked ){

            if( getPiece(clickedRow, clickedColumn) === '' || pieceColor(clickedRow, clickedColumn) !== whoseTurn ) {
                unsetPossibilities(); 
                return; 
            }
            //player clicked on its piece and its his turn
            movepossibilities = movePossible( clickedRow, clickedColumn );
            setPossibilities();

            fieldClicked = true;

        } else { //we've marked some piece
            clickedColumn = e.target.cellIndex;
            clickedRow = e.target.parentNode.rowIndex;

            if( movepossibilities.includes( clickedRow * 9 + clickedColumn ) )
                socket.emit( 'check-move-chess', firstFieldRow, firstFieldCol, clickedRow, clickedColumn );
            else
            {
                unsetPossibilities();
                fieldClicked = false;
            } 
        }
    });
};

window.addEventListener('load', boarderSetup);

socket.on('server-chess-move', msg => {
    if(msg != '' && msg != false){
        setViewUnchecked( cellMarkedChecked.row, cellMarkedChecked.col );
        let toDo = msg.split(';');
        let move = toDo[0];
        movePieceView(move[0], move[1], move[2], move[3]);
        if( toDo[1] && toDo[1].includes('M') ){ //we have a checkmate
            markChecking( toDo[1][1] == 'B' ? whitePiece : blackPiece );
            alert(`${ toDo[1][1] == 'B' ? 'Black' : 'White' } player has won!`)
        } else if ( toDo[1] && toDo[1].includes('C') ) {
            markChecking( toDo[1][1] == 'B' ? whitePiece : blackPiece );
        }
    } 

    fieldClicked = false;
    unsetPossibilities();
}); 