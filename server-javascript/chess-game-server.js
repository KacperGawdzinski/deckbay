class chessGame{

    //#region classInit

    chessBoard;
    whiteTurn;
    whitePlayerLogin;
    blackPlayerLogin;
    movesHistory;

    blackKing = {
        row : 1,
        col : 5
    }; 
    whiteKing = {
        row : 8, 
        col: 5
    };

    whoRequestedTakeback;

    pendingDrawWhite;
    pendingDrawBlack;

    playerInit(whitePlayer){
        let r = whitePlayer ? 7 : 2;
        for(let c = 1; c <= 8; c++){ this.chessBoard[r][c] = { piece : '♟', white : whitePlayer }; };

        r = whitePlayer ? 8 : 1;
        this.chessBoard[r][8] = {piece : '♜', white : whitePlayer}; 
        this.chessBoard[r][1] = {piece : '♜', white : whitePlayer}; 
        this.chessBoard[r][7] = {piece : '♞', white : whitePlayer}; 
        this.chessBoard[r][2] = {piece : '♞', white : whitePlayer}; 
        this.chessBoard[r][6] = {piece : '♝', white : whitePlayer}; 
        this.chessBoard[r][3] = {piece : '♝', white : whitePlayer}; 
        this.chessBoard[r][5] = {piece : '♚', white : whitePlayer}; 
        this.chessBoard[r][4] = {piece : '♛', white : whitePlayer}; 
    }

    constructor( creatorLogin, whitePlayerWasChosen ) {

        this.chessBoard = Array(9).fill().map( () => (Array(9).fill( { piece : '', white : false } )));
        this.chessBoard[0].fill('A');

        if( whitePlayerWasChosen ){
            this.whitePlayerLogin = creatorLogin;
            this.blackPlayerLogin = '';
        } else {
            this.blackPlayerLogin = creatorLogin;
            this.whitePlayerLogin = '';
        } 

        for(let i = 1; i <= 8; i++){ this.chessBoard[i][0] = 'A' };

        this.movesHistory = [];
        this.whoRequestedTakeback = '';
        this.playerInit(true); this.playerInit(false);
        this.whiteTurn = true;
        this.pendingDrawBlack = false; this.pendingDrawWhite = false;
    }

    //#endregion classInit

    //#region boardManagement

    pieceColor(row, col){ return this.chessBoard[row][col].white; };

    getPiece(row, col){ return this.chessBoard[row][col].piece; };

    getPieceObj(row, col){ return this.chessBoard[row][col] };

    setPieceObj(row, col, pieceObj){ this.chessBoard[row][col] = pieceObj };

    movePieceObj(sRow, sCol, eRow, eCol){
        let movedPiece = this.getPieceObj(sRow, sCol);
        
        if( movedPiece.piece === '♚' ){
            if( this.pieceColor(sRow, sCol) ){
                this.whiteKing.row = eRow; this.whiteKing.col = eCol;
            } else {
                this.blackKing.row = eRow; this.blackKing.col = eCol;
            }
        }
        this.setPieceObj( eRow, eCol, movedPiece ); 
        this.setPieceObj( sRow, sCol, {piece : '', color : ''} );
    }

    //#endregion boardManagement

    //#region pieceMoveValidation

    movesPossible(row, column){
        let guesses = [];
        if( this.getPiece(row, column) === '♟' ) guesses = this.movesPossiblePawn(row, column);
        if( this.getPiece(row, column) === '♜' ) guesses = this.movesPossibleRook(row, column);
        if( this.getPiece(row, column) === '♞' ) guesses = this.movesPossibleKnight(row, column);
        if( this.getPiece(row, column) === '♝' ) guesses = this.movesPossibleBishop(row, column);
        if( this.getPiece(row, column) === '♚' ) guesses = this.movesPossibleKing(row, column);
        if( this.getPiece(row, column) === '♛' ) guesses = this.movesPossibleQueen(row, column);
    
        return guesses.filter( index => { 
            let pRow = Math.floor(index / 9), pCol = index % 9;
            let startPiece = this.getPieceObj(row, column);
            let endPiece = this.getPieceObj(pRow, pCol);
            this.movePieceObj(row, column, pRow, pCol);
            let checked = !this.ifCheck( this.pieceColor(pRow, pCol) );
            this.movePieceObj(pRow, pCol, row, column);
            this.setPieceObj(pRow, pCol, endPiece);
            return checked;
        } );
    };

    moveRec(sRow, sCol, hRow, hCol){
        if( !(hRow >= 1 && hRow <= 8 && hCol >= 1 && hCol <= 8) ) return false;
        
        return this.getPiece(hRow, hCol) === '' || this.pieceColor(hRow, hCol) !== this.pieceColor(sRow, sCol);
    };
    
    movesPossiblePawn(row, column){
        let possibilities = [];
        let direction = this.pieceColor(row, column) ? -1 : 1;
        let startPawnRow = this.pieceColor(row, column) ? 7 : 2;
    
        if( column !== 1 )
            if( this.getPiece(row + direction, column - 1) !== '' && 
                this.pieceColor(row + direction, column - 1) !== this.pieceColor(row, column) ) 
                    possibilities.push((row + direction ) * 9 + column - 1);
    
        if( column !== 8 )
            if( this.getPiece(row + direction, column + 1) !== '' && 
                this.pieceColor(row + direction, column + 1) !== this.pieceColor(row, column) ) 
                    possibilities.push((row + direction ) * 9 + column + 1);
    
        if( this.getPiece(row + direction, column) === ''){
            possibilities.push( (row + direction) * 9 + column);
            direction *= 2;
            if( this.getPiece(row + direction, column) === '' && row === startPawnRow) 
                possibilities.push( (row + direction) * 9 + column);
        } 
    
        return possibilities;
    };
    
    moveDirection(row, col, rowDiff, colDiff){
        let direPossibilities = []
        let hRow = row + rowDiff; let hCol = col + colDiff;
    
        while( this.moveRec(row, col, hRow, hCol) ){
            direPossibilities.push(hRow * 9 + hCol);
    
            if ( this.pieceColor(hRow, hCol) !== this.pieceColor(row, col) && this.getPiece(hRow, hCol) !== '') {
                return direPossibilities;
            }
    
            hRow += rowDiff; hCol += colDiff;
        }
        return direPossibilities;
    };
    
    movesPossibleRook(row, column){
        let possibilities = [];
    
        possibilities = possibilities.concat( this.moveDirection(row, column, 0, 1) );
        possibilities = possibilities.concat( this.moveDirection(row, column, 0, -1) );
        possibilities = possibilities.concat( this.moveDirection(row, column, 1, 0) );
        possibilities = possibilities.concat( this.moveDirection(row, column, -1, 0) );
          
        return possibilities;
    };
    
    movesPossibleKnight(row, column){
        let possibilities = [];
        let directions = [-2, -1, 1, 2];
    
        directions.forEach( r => {
            directions.forEach( c => {
                if( Math.abs(c % 2) !==  Math.abs(r % 2) && this.moveRec(row, column, row + r, column + c) ) 
                    possibilities.push( (row + r) * 9 + (column + c) ); 
            }) 
        });
        
        return possibilities;
    };
    
    movesPossibleBishop(row, col){
        let possibilities = [];
    
        possibilities = possibilities.concat( this.moveDirection(row, col, -1, -1) );
        possibilities = possibilities.concat( this.moveDirection(row, col, -1, 1) );
        possibilities = possibilities.concat( this.moveDirection(row, col, 1, -1) );
        possibilities = possibilities.concat( this.moveDirection(row, col, 1, 1) );
    
        return possibilities;
    };
    
    movesPossibleKing(row, column){
        let possibilities = [];
    
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){ 
                if( this.moveRec(row, column, row + i, column + j) ) 
                    possibilities.push( (row + i) * 9 + (column + j) ); 
            };
        }
    
        return possibilities;
    };
    
    movesPossibleQueen(row, column){
        return this.movesPossibleRook(row, column).concat( this.movesPossibleBishop(row, column) );
    };

    //#endregion pieceMoveValidation

    //#region pathFinder

    shortestPath(sRow, sCol, eRow, eCol, piece){
        let pathTab;
        if(piece === '♝') pathTab = this.shortestPathBishop(sRow, sCol, eRow, eCol);
        if(piece === '♛') pathTab = this.shortestPathQueen(sRow, sCol, eRow, eCol);
        if(piece === '♜') pathTab = this.shortestPathRook(sRow, sCol, eRow, eCol);
        return pathTab;
    }

    shortestPathRook(sRow, sCol, eRow, eCol){
        if(sRow !== eRow && sCol !== eCol) return false;

        let path = [];
        if( sRow === eRow ){
            for(let c = sCol; c <= eCol; c++){
                path.push( sRow * 9 + c );
            }
        } else {
            for(let r = sRow; r <= eRow; r++)
                path.push( r * 9 + eCol );
        }
        return path;
    }

    shortestPathBishop(sRow, sCol, eRow, eCol){
        if( Math.abs(sRow - eRow) !== Math.abs(sCol - eCol) ) return false;

        let path = [];
        let rowDiff = sRow < eRow ? 1 : -1;
        let colDiff = sCol < eCol ? 1 : -1;
        sRow += rowDiff; sCol += colDiff;

        while(sRow !== eRow){
            path.push(sRow * 9 + sCol);
            sRow += rowDiff; sCol += colDiff;
        }
        return path;
    }

    shortestPathQueen(sRow, sCol, eRow, eCol){
        if(sRow === eRow || sCol === eCol) return this.shortestPathRook(sRow, sCol, eRow, eCol);
        else return this.shortestPathBishop(sRow, sCol, eRow, eCol);
    }

    //#endregion pathFinder

    //#region checkingLogic 

    pawnCheck(row, column){
        let possibilities = [];
        let direction = this.pieceColor(row, column) ? -1 : 1;
    
        if( column !== 1 )
            if( this.getPiece(row + direction, column - 1) !== '' ||
                this.pieceColor(row + direction, column - 1) !== this.pieceColor(row, column) ) 
                    possibilities.push((row + direction ) * 9 + column - 1);
    
        if( column !== 8 )
            if( this.getPiece(row + direction, column + 1) !== '' ||
                this.pieceColor(row + direction, column + 1) !== this.pieceColor(row, column) ) 
                    possibilities.push((row + direction ) * 9 + column + 1);
        return possibilities;
    };

    checkHelper(row, column){
        let guesses = [];
        if( this.getPiece(row, column) === '♜' ) guesses = this.movesPossibleRook(row, column);
        if( this.getPiece(row, column) === '♞' ) guesses = this.movesPossibleKnight(row, column);
        if( this.getPiece(row, column) === '♝' ) guesses = this.movesPossibleBishop(row, column);
        if( this.getPiece(row, column) === '♚' ) guesses = this.movesPossibleKing(row, column);
        if( this.getPiece(row, column) === '♛' ) guesses = this.movesPossibleQueen(row, column);
        return guesses;
    };
    
    pieceCheck(row, column){
        return this.getPiece(row, column) === '♟' ? this.pawnCheck(row, column) : this.checkHelper(row, column);
    };
    
    getChecking(){
        let checked = Array(81).fill().map(() => Array());
    
        for(let r = 1; r <= 8; r++){
            for(let c = 1; c <= 8; c++){
                if(this.pieceCheck(r,c).length != 0)
                this.pieceCheck(r, c).forEach( check_index => {
                        checked[check_index].push(r * 9 + c);
                    });
            }
        }
    
        return checked;
    };
    
    ifCheck(white){
        let king = white ? this.whiteKing : this.blackKing;
        let kingIndex = king.row * 9 + king.col;
        let checked = this.getChecking();
        
        return checked[kingIndex].some( index => { 
            return this.pieceColor(Math.floor(index / 9), index % 9) !== white; 
        });
    };

    //#endregion checkingLogic

    //#region checkmateLogic

    checkMate( whitePlayer ){ // input player is the one we check on
        let rescuerPawn = ( idx ) => {
            let idxRow = Math.floor( idx / 9 ); 
            let idxCol = idx % 9;
            let direction = whitePlayer ? 1 : -1;

            if( idxRow + direction <= 8 && idxRow + direction >= 1) 
                if( (this.movesPossible(idxRow + direction, idxCol)).includes(idx) ) return true; 

            if( idxRow + 2*direction <= 8 && idxRow + 2*direction >= 1) 
                if( (this.movesPossible(idxRow + 2*direction, idxCol)).includes(idx) ) return true; 
            
            return false;
        }

        let king = whitePlayer ? this.whiteKing : this.blackKing;
        let currChecking = this.getChecking();

        if( this.movesPossible(king.row, king.col).length !== 0)  return false; //king can move without check, so its fine, he's secure

        let enemyChecks = currChecking[king.row * 9 + king.col].filter( idx => {
            return this.pieceColor(Math.floor( idx / 9 ), idx % 9) !== whitePlayer;
        }); //we get the enemy pieces atacking our king

        return enemyChecks.some( atkIdx => {
            let rescued = false; 
            let atkRow = Math.floor( atkIdx / 9 ); 
            let atkCol = atkIdx % 9;

            //first of all we check if we can kill atacking piece
            currChecking[atkIdx].forEach( (a) => {
                let rowIdx = Math.floor( a / 9);
                let colIdx = a % 9;
                if( this.validateMove( rowIdx, colIdx, atkRow, atkCol ) ) 
                    rescued = true; //we can kill atacking piece
            });
            console.log( this.shortestPath(king.row, king.col, atkRow, atkCol, this.getPiece(atkRow, atkCol) ) );
            //if piece is either bishop, rook or queen mayhaps we can bedim its attacking (thus cover king)
            if( !rescued && !(this.getPiece(atkRow, atkCol) === '♟' || this.getPiece(atkRow, atkCol) === '♞') ){
                this.shortestPath(king.row, king.col, atkRow, atkCol, this.getPiece(atkRow, atkCol) ).forEach( index  => {
                    if( rescuerPawn(index) ) rescued = true; //there is a pawn we can block atacking piece with, atack stopped

                    currChecking[index].forEach( pieceToHelp => {
                        let phRow = Math.floor( pieceToHelp / 9); 
                        let phCol = pieceToHelp % 9;
                        if( this.pieceColor( phRow, phCol ) === whitePlayer &&
                            this.validateMove( phRow, phCol, Math.floor(index / 9), index % 9 ) ) rescued = true; //we can move and block atacking piece
                    });
                })
            };
        
            return !rescued; //if we rescued king, then we have to check other checkmate possibility, if there is one piece white attack
                             //we cant prevent, then there is a checkmate;
        });
    };

    //#endregion checkmateLogic

    //#region stalemateLogic

    checkStalemate()
    {
        let movePossibleWhite = false; 
        let movePossibleBlack = false;

        for( let r = 0; r < 9; r++ ){
            for( let c = 0; c < 9; c++ ){
                if( this.movesPossible(r, c).length != 0 ){
                    if( this.pieceColor(r, c) == true ) movePossibleWhite = true ;
                    else movePossibleBlack = true;
                }
                if(movePossibleBlack && movePossibleWhite) return false;
            }
        }
        return false; //there is some player who can't move at all
    }

    //#endregion stalemateLogic

    //#region gameManagement

    moveRequest(sRow, sCol, eRow, eCol, playerLogin){ //it returnes what changes are needed to game state/mates or checkmates eventually
        if( this.whitePlayerLogin == '' || this.blackPlayerLogin == '' )
            return '';

        let resMess = '';

        let reqWhitePlayer = playerLogin == this.whitePlayerLogin; //if whitePlayeris requesting move
        
        if( reqWhitePlayer != this.whiteTurn ) return ''; //it means we tried to move during another player's turn
        if( this.pieceColor( sRow, sCol ) != this.whiteTurn ) return ''; //it means we tried to move another's player piece

        if( this.validateMove(sRow, sCol, eRow, eCol) ){

            this.movesHistory.push({
                startRow : sRow,
                startCol : sCol,
                endRow : eRow,
                endCol : eCol,
                piece : this.getPieceObj( eRow, eCol ),
            });

            this.movePieceObj(sRow, sCol, eRow, eCol);
            resMess += `${sRow}${sCol}${eRow}${eCol};`;

            if( this.ifCheck( !this.whiteTurn ) ) { 

                if( this.checkMate( !this.whiteTurn ) )
                {
                    resMess += `M${ !this.whiteTurn ? 'B' : 'W' };`; //if there is a checkmate we need only to tell it
                }
                else 
                    resMess += `C${ !this.whiteTurn ? 'B' : 'W' };`;
            }
            else if( this.checkStalemate() ){
                resMess += 'P';
            }
            this.whiteTurn = !this.whiteTurn;

            return resMess;
        } else return '';
    };

    setSecondPlayer( secondPlayerLogin ){
        if( this.whitePlayerLogin == '' ) this.whitePlayerLogin = secondPlayerLogin;
        else this.blackPlayerLogin = secondPlayerLogin;
    }

    sendPlayersColors(){
        return `${this.whitePlayerLogin};${this.blackPlayerLogin}`;
    }

    validateMove(sRow, sCol, eRow, eCol){
        return this.movesPossible(sRow, sCol).includes(eRow * 9 + eCol);
    };

    changeDrawProposition( playerLogin ){
        if( playerLogin == this.whitePlayerLogin ) this.pendingDrawWhite = !this.pendingDrawWhite;
        else this.pendingDrawBlack = !this.pendingDrawBlack;

        return this.pendingDrawBlack && this.pendingDrawWhite; //if there is a draw we return true, false otherwise
    };

    handleSurrender( playerLogin ){
        return `D${ (playerLogin == this.whitePlayerLogin) ? 'B' : 'W' }`;
    };

    isReqPlayerWhite( playerLogin ){
        return playerLogin == this.whitePlayerLogin;
    }

    handleMoveReset( player, consentGranted ){ 
        if( this.movesHistory == [] || this.movesHistory.length == 0 ) return '';

        if( this.whoRequestedTakeback == '' ){
            this.whoRequestedTakeback = player;
            const playerToNotify = player == this.whitePlayerLogin ? this.blackPlayerLogin : this.whitePlayerLogin;
            return playerToNotify;
        } else { //we get response for takeback
            if( player == this.whoRequestedTakeback ) return '';
            
            if( !consentGranted ) return ''; //second player doesnt want to undo a move
        }   
        //when we're in here we're sure different player requested and responsed + consent was granted
        this.whoRequestedTakeback = '';
        this.whiteTurn = !this.whiteTurn;
        this.undoMoveOnChessboard();
        return this.movesHistory.pop();
    }

    undoMoveOnChessboard(){
        let moveObj = this.movesHistory[ this.movesHistory.length - 1 ];

        this.movePieceObj( moveObj.endRow, moveObj.endCol, moveObj.startRow, moveObj.startCol );
        this.setPieceObj( moveObj.endRow, moveObj.endCol, moveObj.piece );
    }

    //#endregion gameManagement
}

module.exports = { chessGame };