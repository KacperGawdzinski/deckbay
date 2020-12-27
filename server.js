const http = require('http');
const socket = require('socket.io');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt');
const { loggingInfo, authorize } = require('./auth-logic');

const saltRounds = 12;

var app = express();
var server = http.createServer(app);
var io = socket(server);

let loggingControl = new loggingInfo();

var socketRoom = new Map(); //socket.id -> room name
var socketGame = new Map(); //socket.id -> game type
var roomPasswd = new Map(); //full room name -> hashed password

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

app.get('/chess-list', authorize, (req, res) => {
    res.render('room_list.ejs', { game_type: 'CHESS', user_login : req.login }
)});
    
app.get('/chess-list/:id', authorize, (req, res) => {
    console.log(req.query.game_type + '-' + req.params.id);
    if(!req.signedCookies.room || req.signedCookies.room != req.query.game_type + '-' + req.params.id)
        return res.status(403).send("You don't have permission to join this room!");
    res.cookie('room', "", {maxAge: -1});
    res.render('chess-game', { room_name: req.params.id, game_type: req.query.game_type });
});

app.get('/chess-test', (req, res) => {
    res.render('game_chess_page');
})

app.post('/validate-room', (req, res) => {
    let ar = availableRooms(req.body.game)
    let fullRoomName = req.body.game + '-' + req.body.room;
    for (let i = 0; i < ar.length; i++) {
        if (ar[i][0] === fullRoomName) {
            res.send('Room already exists!');
            return;
        }
    }

    if (req.body.room.length > 15) {
        res.send('Room name is too long!');
        return;
    }

    if (req.body.room === "") {
        res.send('Insert room name!');
        return;
    }

    if(req.body.password != "") {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                roomPasswd.set(fullRoomName, hash);
            });
        });
    }

    res.cookie('room', fullRoomName, { signed: true })
    res.send(true);
});

app.post('/validate-room-password', (req, res) => {
    bcrypt.compare(req.body.password, roomPasswd.get(req.body.fullRoomName), (err, result) => {
        if (result) {
            res.cookie('room', req.body.fullRoomName, {signed: true})
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

    socket.on('load_rooms', data => {
        console.log('returning room list...');
        socket.emit('rooms', availableRooms(data));
    });

    socket.on('join-new-room', data => {
        socket.join(data.game + '-' + data.room);
        socketGame.set(socket.id, data.game)
        socketRoom.set(socket.id, data.room)
        socket.broadcast.emit('rooms', availableRooms(data.game));
    });

    socket.on('disconnecting', () => {  //remove data from maps and leave rooms
        if(socketGame.get(socket.id)) {
            var full_room_name = socketGame.get(socket.id) + '-' + socketRoom.get(socket.id);
            if(io.sockets.adapter.rooms.get(full_room_name).size == 1) {
                roomPasswd.delete(full_room_name);
            }
            socketRoom.delete(socket.id);
        }
    });

    socket.on('disconnect', () => {   //emit new room list and clear last map
        socket.broadcast.emit('rooms', availableRooms(socketGame.get(socket.id)));
        socketGame.delete(socket.id);
        console.log('client disconnected');
    });
});

function availableRooms(game) {
    var availableRoomsTab = [];
    var rooms = io.sockets.adapter.rooms;
    for (let k of rooms.keys()) {
        if (k.startsWith(game)) {
            let inf;
            if(roomPasswd.get(k))
                inf = [k, rooms.get(k).size, 1]; //change to object 
            else
                inf = [k, rooms.get(k).size,];
            availableRoomsTab.push(inf);
        }
    }
    return availableRoomsTab;
}