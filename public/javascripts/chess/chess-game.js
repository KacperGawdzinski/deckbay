var board = document.getElementById('chess-board-tbody');

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
}

createBoardTable();