const http = require('http');   //TODO: tolowercase in links & roomPasswd authorization fix
const socket = require('socket.io');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt');
const faker = require('faker');
const Checkers  = require('./public/javascripts/checkers/checkers-server');
const { loggingInfo, authorize } = require('./auth-logic');

const saltRounds = 10;

var app = express();
var server = http.createServer(app);
var io = socket(server);

let loggingControl = new loggingInfo();

var socketLogin = new Map();    //socket.id -> login
var loginRoom = new Map();      //player login -> full room name
var roomPasswd = new Map();     //full room name -> hashed password
var roomOptions = new Map();    //full room name -> options
var roomPlayers = {}            //full room name -> [players allowed to play (logins)]
var roomBoard = {};             //full room name -> gameboard
var roomTurn = new Map();       //full room name -> turn

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
    socketLogin.set(req.body.socketid, req.signedCookies.login)
    console.log(loginRoom.get(req.signedCookies.login));
    res.send(loginRoom.get(req.signedCookies.login));
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
    res.render('chess-game', { room_name: req.params.id, game_type: req.body.game_type });
});

app.get('/checkers-list', authorize, (req, res) => {   //set random nick
    if(!req.signedCookies.login)
        res.cookie("login",  faker.name.findName(), { signed: true });
    res.render('room_list.ejs', { game_type: 'CHECKERS', user_login : req.login }
)});


app.post('/checkers-list/:id', authorize, (req, res) => {  //if two players have the same nick may be problem - remove spaces
    if(!req.body.game_type) {
        res.status(403);
        res.send("You don't have permission to enter this room!");
        return;
    }
    let fullRoomName = req.body.game_type + "-" + req.params.id
    if(roomPasswd[fullRoomName]) {
        let temp = roomPlayers[fullRoomName]
        if(!temp.includes(req.signedCookies.login)) {
            res.status(403);
            res.send("You don't have permission to enter this room!");
            return;
        }
    }
    var check = new Checkers(1);
    roomBoard[fullRoomName] = check.boarad;
    roomTurn[fullRoomName] = 1;
    res.render('checkers.ejs', { room_name: req.params.id });
});

app.get('/chess-test', (req, res) => {
    res.render('game_chess_page');
})

app.get('/checkers-test', authorize, (req, res) => {
    res.render('checkers.ejs')
});

app.post('/validate-room', async function(req, res) {              //maybe some default parameters? + change for other games
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
        socket.join('game-' + data)
    })

    socket.on('load_rooms', data => {
        console.log('returning room list...');
        console.log(data);
        io.to('game-' + data).emit('rooms', availableRooms(data));
    });

    socket.on('join-new-room', data => {
        socket.join(data.game + "-" + data.room);
        io.to('game-' + data.game).emit('rooms', availableRooms(data.game));
    });

    socket.on('disconnecting', () => {
        if(socketLogin.get(socket.id)) {
            var full_room_name = socketLogin.get(socket.id)
            if(io.sockets.adapter.rooms.get(full_room_name).size == 1) {
                socket.leave(loginRoom.get(socketLogin.get(socket.id)));
                roomPlayers[full_room_name].forEach(element => {
                    loginRoom.delete(element)
                });
                delete roomPlayers[full_room_name];
                roomOptions.delete(full_room_name);
                roomPasswd.delete(full_room_name);
            }
        }
        io.to('game-' + socketGame.get(socket.id)).emit('rooms', availableRooms(socketGame.get(socket.id)));
        console.log('client disconnected');
    });

    socket.on('check-move', tab => {   //checking if move is allowed
        console.log("ssss");
        if (tab[2] == roomTurn[socketRoom.get(socket.id)]) {
            var check = new Checkers(tab[2]);
            var id = socket.id;
            check.updateBoard(roomBoard[socketRoom.get(id)]);   
            check.checed=tab[0];
            var move1 = check.convertId(check.checed);
            check.checkMoves(move1[0],move1[1]);
            if(check.inMoves(tab[1])){
                socket.to("checkers-" + socketRoom.get(id)).emit('move', tab);
                var move2 = check.convertId(tab[1]);
                check.makeMove(move2[0],move2[1]);
                roomBoard[socketRoom.get(id)]=check.boarad;
            }
            if (roomTurn[socketRoom.get(socket.id)] == 1) {
                roomTurn[socketRoom.get(socket.id)] = 2;
            }else{
                roomTurn[socketRoom.get(socket.id)] = 1;
            }
        }
    });

    socket.on('ask-options-checkers', () =>{
        var opt = roomOptions.get("checkers-" + socketRoom.get(socket.id));
        if (opt["white"] === '' && opt["black"] === '') {
            if (opt["side"] == 1) {
                opt["white"] = socket.id;
                io.to("checkers-" + socketRoom.get(socket.id)).emit("send-options-checkers",[1]);
            } else {
                opt["black"] = socket.id;
                io.to("checkers-" + socketRoom.get(socket.id)).emit("send-options-checkers",[2]);
            }
        }else{
            if (opt["white"] == '') {
                opt["white"] = socket.id;
                io.to("checkers-" + socketRoom.get(socket.id)).emit("send-options-checkers",[1]);
            } else {
                if (opt["black"] == '') {
                    opt["black"] = socket.id;
                    io.to("checkers-" + socketRoom.get(socket.id)).emit("send-options-checkers",[2]);
                } else {
                    if (roomOptions.get("checkers-" + socketRoom.get(socket.id))["white"] == socket.id) {
                        io.to("checkers-" + socketRoom.get(socket.id)).emit("send-options-checkers",[1,roomBoard["checkers-" + socketRoom.get(socket.id)]]);
                    } else {
                        if (roomOptions.get("checkers-" + socketRoom.get(socket.id))["black"] == socket.id) {
                            io.to("checkers-" + socketRoom.get(socket.id)).emit("send-options-checkers",[2,roomBoard["checkers-" + socketRoom.get(socket.id)]]);
                        } else {
                            io.to("checkers-" + socketRoom.get(socket.id)).emit("send-options-checkers",[-1,roomBoard["checkers-" + socketRoom.get(socket.id)]]);
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