const http = require('http');
const socket = require('socket.io');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt');
const faker = require('faker');
const Checkers  = require('./server-javascript/checkers-server');
const { loggingInfo, authorize } = require('./auth-logic');
const { chessGame } = require('./server-javascript/chess-game-server');

const saltRounds = 10;

var app = express();
var server = http.createServer(app);
var io = socket(server);

let loggingControl = new loggingInfo();

var socketLogin = new Map();    //socket.id -> login
var loginRoom = new Map();      //player login -> full room name
var roomPasswd = new Map();     //full room name -> hashed password
var roomOptions = new Map();    //full room name -> options
var roomPlayers = {};           //full room name -> [players allowed to play (logins)]  //merge maps into one
var roomBoard = {};             //full room name -> gameboard
var roomTurn = new Map();       //full room name -> turn
var roomLastMove = {};

let roomChesslogic = new Map(); //full room name -> it's game in class representation

app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser('awdbui3gt197234rnoiwnf0138hr0inr1r1038fh103'));   //HIDE
app.use('/public', express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', authorize, (req, res) => {
    res.render('index.ejs', { user_login : req.login } );
});

app.post("/login", authorize, (req, res) => {
    let password = req.body.passwd,
        login = req.body.login;

    if ( !loggingControl.userLoginLookup(login) ) {
        res.render("index.ejs", { error_message: "User with such login doesn't exist" });
    } else if ( !loggingControl.userValidateByLogin(login, password) ) {
        res.render("index.ejs", { error_message: "Password is incorrect" });
    } else {
        res.cookie("login", login, { signed: true });
        res.redirect( req.body.reqUrl );
    }
});

app.post('/register', (req, res) => {
    let password = req.body.password,
        login = req.body.login,
        mail = req.body.email;

    if (loggingControl.userLookup(login, mail) || loggingControl.insertMailToVerify(login, mail, password) === false) {
        res.render( 'index', { error_message: 'This mail/login is already taken!' } );
    } else {
        res.redirect( req.body.reqUrl );
    }
});

app.post('/logout', (req, res) => {
    res.cookie("login", "", { maxAge : -1 } );
    res.redirect( req.body.reqUrl );
}); 

app.get('/verify/:id', (req, res) => {
    let ID = req.params.id,
        gotLogin = loggingControl.checkID(ID);

    if( gotLogin !== false){
        res.cookie('login', gotLogin, { signed : true } );
    } 
    res.redirect('/');
})

app.post('/set-socket-id', (req, res) => {
    socketLogin.set(req.body.socketid, req.signedCookies.login);
    if (roomOptions.get(loginRoom.get(req.signedCookies.login))) {
        res.send(loginRoom.get(req.signedCookies.login));
    }else{
        res.send("");
    }
})

app.get('/chess-list', authorize, (req, res) => {   //set random nick
    if(!req.signedCookies.login)
        res.cookie("login",  faker.name.findName(), { signed: true });
    res.render('room_list.ejs', { game_type: 'CHESS', user_login : req.login }
)});


app.post('/chess-list/:id', authorize, (req, res) => {  //if two players have the same nick may be problem - remove spaces
    if(req.body.game_type != 'chess') {
        res.status(403);
        res.send("You don't have permission to enter this room!");
        return;
    }
    let fullRoomName = req.body.game_type + "-" + req.params.id
    if(roomPasswd.get(fullRoomName)) {
        let temp = roomPlayers[fullRoomName]
        if(!temp.includes(req.signedCookies.login)) {
            res.status(403);
            res.send("You don't have permission to enter this room!");
            return;
        }
    }
    loginRoom.set(req.signedCookies.login, fullRoomName);
    res.render('game_chess_page', { room_name: req.params.id, game_type: req.body.game_type, user_login: req.signedCookies.login });
});

app.get('/checkers-list', authorize, (req, res) => {   //set random nick
    if(!req.signedCookies.login)
        res.cookie("login",  faker.name.findName(), { signed: true });
    res.render('room_list.ejs', { game_type: 'CHECKERS', user_login : req.login }
)});

app.post('/checkers-list/:id', authorize, (req, res) => {  //if two players have the same nick may be problem - remove spaces
    if(req.body.game_type != 'checkers') {
        res.status(403);
        res.send("You don't have permission to enter this room!");
        return;
    }
    let fullRoomName = req.body.game_type + "-" + req.params.id
    if(roomPasswd.get(fullRoomName)) {
        let temp = roomPlayers[fullRoomName]
        if(!temp.includes(req.signedCookies.login)) {
            res.status(403);
            res.send("You don't have permission to enter this room!");
            return;
        }
    }
    loginRoom.set(req.signedCookies.login, fullRoomName);
    if (roomBoard.hasOwnProperty(fullRoomName)) {
        
    }else{
        var check = new Checkers(1);
        roomBoard[fullRoomName] = check.boarad;
        roomTurn.set(fullRoomName,1);
    }
    res.render('checkers.ejs', { room_name: req.params.id, game_type: req.body.game_type, user_login : req.login });
});

app.get('/checkers-test', authorize, (req, res) => {
    res.render('checkers.ejs')
});

app.post('/validate-room', async function(req, res) {        //maybe some default parameters? + change for other games
    let ar = availableRooms(req.body.game)
    let fullRoomName = (req.body.game + '-' + req.body.room).toLowerCase();
    for (let i = 0; i < ar.length; i++) {
        if (ar[i][fullRoomName] === fullRoomName) {
            res.send('Room already exists!');
            return;
        }
    }

    if (req.body.room.length > 15) {
        res.send('Room name is too long!'); return;
    }

    if (req.body.room === "") {
        res.send('Insert room name!'); return;
    }

    if(!req.body.side) {
        res.send('Choose side!'); return
    }

    if(!req.body.length) {
        res.send('Choose game length!'); return
    }

    if(req.body.length > 30 || req.body.length < 1) {
        res.send('Game length should be between 1-30min!'); return
    }

    if(!req.body.bonus) {
        res.send('Choose bonus time length!'); return
    }

    if(req.body.bonus > 30 || req.body.bonus < 1) {
        res.send('Bonus time should be between 1-30s!'); return
    }

    if(req.body.password) {
        const hashed = await bcrypt.hash(req.body.password, saltRounds);
        roomPasswd.set(fullRoomName, hashed)
        roomPlayers[fullRoomName] = [req.signedCookies.login]
    }

    roomOptions.set(fullRoomName, {
        side: req.body.side,
        white: req.body.white,
        black: req.body.black,
        readyWhite: req.body.readyWhite,
        readyBlack: req.body.readyBlack,
        drawWhite: req.body.drawWhite,
        drawBlack: req.body.drawBlack,
        length: Math.floor(req.body.length),
        bonus: Math.floor(req.body.bonus)
    })
    res.send(true);
});

app.post('/validate-room-password', (req, res) => {
    bcrypt.compare(req.body.password, roomPasswd.get(req.body.fullRoomName), (err, result) => {
        if (result) {
            if(!roomPlayers[req.body.fullRoomName].includes(req.signedCookies.login)) {
                let temp = roomPlayers[req.body.fullRoomName]
                temp.push(req.signedCookies.login)
                roomPlayers[req.body.fullRoomName] = temp
            }
            res.send(true);
        } else {
            res.send("Invalid password!");
        }
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server turned on');
});

io.on('connection', socket => {
    console.log('client connected');

    socket.on('join-room-list', data => {
        console.log('joining game-' + data);
        socket.join('game-' + data);
    })

    socket.on('load_rooms', data => {
        console.log('returning room list...');
        console.log(data);
        io.to('game-' + data).emit('rooms', availableRooms(data));
    });

    socket.on('join-new-room', data => {
        let login = socketLogin.get(socket.id);
        let roomName = data.game + "-" + data.room;

        socket.join( roomName );
        loginRoom.set(login , roomName );
        io.to( 'game-' + data.game ).emit( 'rooms', availableRooms(data.game) );
        let logic;

        if(data.game == 'chess'){
            if( !roomChesslogic.get( data.room) ){
                const opts = roomOptions.get(loginRoom.get(socketLogin.get(socket.id)));
                logic = new chessGame( login, opts.side == 'white' );
                roomChesslogic.set( data.room, logic );
            }
            else{
                logic = roomChesslogic.get( data.room );
                logic.setSecondPlayer(login);
                console.log(data.room);
            } 
            io.to( roomName ).emit( 'chess-send-players-colours', logic.sendPlayersColors() );
        };
    });

    socket.on('disconnecting', () => {
        if(socketLogin.get(socket.id)) {
            let full_room_name = loginRoom.get(socketLogin.get(socket.id))
            let game = full_room_name.substr(0, full_room_name.indexOf('-'))
            if(io.sockets.adapter.rooms.get(full_room_name).size == 1) {
                socket.leave(loginRoom.get(socketLogin.get(socket.id)));
                if (roomPasswd.get(full_room_name)) {
                    roomPlayers[full_room_name].forEach(element => {
                        loginRoom.delete(element)
                    });
                    delete roomPlayers[full_room_name];
                    roomPasswd.delete(full_room_name);
                }
                roomOptions.delete(full_room_name);
                roomTurn.delete(full_room_name);
                delete roomLastMove[full_room_name];
                delete roomBoard[full_room_name];
                if( full_room_name.indexOf('chess') == 0 ) 
                    delete roomChesslogic[full_room_name];
            }
            socketLogin.delete(socket.id)
            io.to('game-' + game).emit('rooms', availableRooms(game));
        }
        console.log('client disconnected');
    });

    socket.on('chess-color-req', () => {
        let reqLogin =  socketLogin.get(socket.id);
        let reqRoom = loginRoom.get(reqLogin);

        let message = roomChesslogic.get( reqRoom.split('-')[1] ).isReqPlayerWhite( reqLogin );
        io.to(socket.id).emit( 'chess-color-res', message ); 
    });

    socket.on('check-move-chess', (sRow, sCol, eRow, eCol) => {
        let reqLogin =  socketLogin.get(socket.id);
        let reqRoom = loginRoom.get(reqLogin);

        let message = roomChesslogic.get( reqRoom.split('-')[1] ).moveRequest(sRow, sCol, eRow, eCol, reqLogin);
        io.to(reqRoom).emit('server-chess-move', message);
    });

    socket.on('chess-undo-req', () => {
        let reqLogin =  socketLogin.get( socket.id );
        let reqRoom = loginRoom.get( reqLogin );

        let logicRes = roomChesslogic.get( reqRoom.split('-')[1] ).handleMoveReset( reqLogin );
        let help1 = Array.from( socketLogin.keys() );
        let playerToNotify = help1.find( key => socketLogin.get( key ) === logicRes );
        io.to( playerToNotify ).emit('chess-enemy-takeback-request');
    });

    socket.on('chess-undo-res', ( consentGranted ) => {
        let reqLogin =  socketLogin.get(socket.id);
        let reqRoom = loginRoom.get(reqLogin);

        let move = roomChesslogic.get( reqRoom.split('-')[1] ).handleMoveReset( reqLogin, consentGranted );
        io.to( reqRoom ).emit('chess-takeback-server-response', move);
    });

    socket.on('chess-surrender', () => {
        let reqLogin =  socketLogin.get(socket.id);
        let reqRoom = loginRoom.get(reqLogin);

        let message = roomChesslogic.get( reqRoom.split('-')[1] ).handleSurrender( reqLogin );
        io.to(reqRoom).emit('server-chess-move', message);
    });

    socket.on('draw-chess', () => {
        let reqLogin =  socketLogin.get(socket.id);
        let reqRoom = loginRoom.get(reqLogin);

        let logicRes = roomChesslogic.get( reqRoom.split('-')[1] ).changeDrawProposition( reqLogin );
        if( logicRes )
            io.to(reqRoom).emit('server-chess-move', 'P');
    });

    socket.on('message-sent-to-server', msg => {
        if(msg == '') return;
        const serverDate = new Date();

        let reqLogin =  socketLogin.get(socket.id);
        let reqRoom = loginRoom.get(reqLogin);
        const minutes = serverDate.getMinutes().toString().length == 1 ? `0${serverDate.getMinutes()}` : serverDate.getMinutes();
        const hours = serverDate.getHours().toString().length == 1 ? `0${serverDate.getHours()}` : serverDate.getHours();

        const sendTime = `${hours}:${minutes}`;

        io.to(reqRoom).emit('message-sent-to-client', msg, reqLogin, sendTime);
    });

    socket.on('check-move-checkers', tab => {   //checking if move is allowed
        if (tab[2] == roomTurn.get(loginRoom.get(socketLogin.get(socket.id)))) {
            var check = new Checkers(tab[2]);
            check.updateBoard(roomBoard[loginRoom.get(socketLogin.get(socket.id))]);
            roomLastMove[loginRoom.get(socketLogin.get(socket.id))]= [...check.boarad];
            check.checed=tab[0];
            var move1 = check.convertId(check.checed);
            check.checkMoves(move1[0],move1[1]);
            if(check.inMoves(tab[1])){
                io.to(loginRoom.get(socketLogin.get(socket.id))).emit('move', tab);
                var move2 = check.convertId(tab[1]);
                check.makeMove(move2[0],move2[1]);
                check.checkQueens();
                check.deletingBeated();
                roomBoard[loginRoom.get(socketLogin.get(socket.id))]=[...check.boarad];
                if (roomTurn.get(loginRoom.get(socketLogin.get(socket.id))) == 1) {
                    roomTurn.set(loginRoom.get(socketLogin.get(socket.id)),0);
                }else{
                    roomTurn.set(loginRoom.get(socketLogin.get(socket.id)),1);
                }
            }
        }
    });

    socket.on('surrender-checkers',() =>{
        io.to(loginRoom.get(socketLogin.get(socket.id))).emit('surrender');
    })

    socket.on('undo-checkers',() =>{
        roomBoard[loginRoom.get(socketLogin.get(socket.id))] = roomLastMove[loginRoom.get(socketLogin.get(socket.id))];
        if (roomTurn.get(loginRoom.get(socketLogin.get(socket.id))) == 1) {
            roomTurn.set(loginRoom.get(socketLogin.get(socket.id)), 0);
        }else{
            roomTurn.set(loginRoom.get(socketLogin.get(socket.id)), 1);
        }
        io.to(loginRoom.get(socketLogin.get(socket.id))).emit('undo-server',roomLastMove[loginRoom.get(socketLogin.get(socket.id))]);
    })

    socket.on('draw-checkers',() =>{
        var opt = roomOptions.get(loginRoom.get(socketLogin.get(socket.id)));
        if (opt["white"]==socketLogin.get(socket.id)) {
            if (opt['drawWhite']==true) {
                opt['drawWhite']=false;
            }else{
                opt['drawWhite']=true;
            }
            io.to(loginRoom.get(socketLogin.get(socket.id))).emit("change-draw",0);
        }
        if (opt["black"]==socketLogin.get(socket.id)) {
            if (opt['drawBlack']==true) {
                opt['drawBlack']=false;
            }else{
                opt['drawBlack']=true;
            }
            io.to(loginRoom.get(socketLogin.get(socket.id))).emit("change-draw",0);
        }
        if (opt['drawBlack'] == true && opt['drawWhite'] == true) {
            io.to(loginRoom.get(socketLogin.get(socket.id))).emit("players-draw",1);
        }
    })

    socket.on('ready', () => {
        var opt = roomOptions.get(loginRoom.get(socketLogin.get(socket.id)));
        if (opt["white"]==socketLogin.get(socket.id)) {
            if (opt['readyWhite']==true) {
                opt['readyWhite']=false;
            }else{
                opt['readyWhite']=true;
            }
            io.to(loginRoom.get(socketLogin.get(socket.id))).emit("change-ready",1);
        }
        if (opt["black"]==socketLogin.get(socket.id)) {
            if (opt['readyBlack']==true) {
                opt['readyBlack']=false;
            }else{
                opt['readyBlack']=true;
            }
            io.to(loginRoom.get(socketLogin.get(socket.id))).emit("change-ready",0);
        }
        if (opt['readyBlack'] == true && opt['readyWhite'] == true) {
            io.to(loginRoom.get(socketLogin.get(socket.id))).emit("players-ready",1);
        }
    });

    socket.on('ready-check', () => {
        var opt = roomOptions.get(loginRoom.get(socketLogin.get(socket.id)));
         if (opt['readyBlack'] == true && opt['readyWhite'] == true) {
            io.to(loginRoom.get(socketLogin.get(socket.id))).emit("players-ready",roomTurn.get(loginRoom.get(socketLogin.get(socket.id))));
        }
    });

    socket.on('ask-options-checkers', () =>{
        var roomId = loginRoom.get(socketLogin.get(socket.id));
        var opt = roomOptions.get(loginRoom.get(socketLogin.get(socket.id)));
        if (opt["white"] === '' && opt["black"] === '') {
            if (opt["side"] == 1) {
                opt["white"] = socketLogin.get(socket.id);
                io.to(roomId).emit("send-options-checkers",[1,1]);
            } else {
                opt["black"] = socketLogin.get(socket.id);
                io.to(roomId).emit("send-options-checkers",[2,1]);
            }
        }else{
            if (opt["white"] == '') {
                opt["white"] = socketLogin.get(socket.id);
                io.to(roomId).emit("send-options-checkers",[1,1]);
            } else {
                if (opt["black"] == '') {
                    opt["black"] = socketLogin.get(socket.id);
                    io.to(roomId).emit("send-options-checkers",[2,1]);
                } else {
                    if (roomOptions.get(roomId)["white"] == socketLogin.get(socket.id)) {
                        io.to(roomId).emit("send-options-checkers",[1,roomTurn.get(roomId),roomBoard[roomId]]);
                    } else {
                        if (roomOptions.get(loginRoom.get(socketLogin.get(socket.id)))["black"] == socketLogin.get(socket.id)) {
                            io.to(roomId).emit("send-options-checkers",[2,roomTurn.get(roomId),roomBoard[roomId]]);
                        } else {
                            io.to(roomId).emit("send-options-checkers",[-1,roomTurn.get(roomId),roomBoard[roomId]]);
                        }
                    }
                }
            }
        }
    })
});

function availableRooms(game) {
    var availableRoomsTab = [];
    var rooms = io.sockets.adapter.rooms;
    for (let k of rooms.keys()) {
        if (k.startsWith(game)) {
            let inf = {
                fullRoomName: k,
                playerCount: rooms.get(k).size,
                options: roomOptions.get(k)
            }
            if(roomPasswd.get(k))
                inf['password'] = true;
            else
                inf['password'] = false;
            availableRoomsTab.push(inf);
        }
    }
    return availableRoomsTab;
}