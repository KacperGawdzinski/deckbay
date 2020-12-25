const http = require('http');
const socket = require('socket.io');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { loggingInfo, authorize } = require('./auth-logic');

var app = express();
var server = http.createServer(app);
var io = socket(server);

let loggingControl = new loggingInfo();

var socketRoom = new Map();
var RoomPasswd = new Map(); //encode it

app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser('awdbui3gt197234rnoiwnf0138hr0inr1r1038fh103'));
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
        res.render( 'index' );
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
    
app.get('/chess-list/:id', (req, res) => {
    res.render('chess-game', {
        id: req.params.id
    });
});

app.post('/validate-room', (req, res) => {
    let ar = availableRooms(req.body.game)
    let room = req.body.game + '-' + req.body.room;
    for (let i = 0; i < ar.length; i++) {
        if (ar[i][0] === room) {
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

    if (req.body.password != "")
        RoomPasswd.set(req.body.game + '-' + req.body.room, req.body.password);
    res.send('true');
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server turned on');
});

io.on('connection', function (socket) {
    console.log('client connected');

    socket.on('load_rooms', function (data) {
        console.log('returning room list...');
        socket.emit('rooms', availableRooms(data));
    });

    socket.on('join-new-room', function (data) {
        socket.join(data.game + '-' + data.room);
        socket.broadcast.emit('rooms', availableRooms(data.game));
    });

    socket.on('disconnecting', () => { //or just socket.leave and then broadcast - seems better practise
        for (let el of socket.rooms) {
            if (el.startsWith('chess') || el.startsWith('checkers') || el.startsWith('domino')) {
                socketRoom.set(socket.id, el.substr(0, el.indexOf('-')));
                break;
            }
        }
    });

    socket.on('disconnect', function () { //remove from roompaswd if room is being deleted
        if (socketRoom.get(socket.id)) {
            socket.broadcast.emit('rooms', availableRooms(socketRoom.get(socket.id)));
            socketRoom.delete(socket.id);
        }
    });
});

function availableRooms(game) {
    var availableRoomsTab = [];
    var rooms = io.sockets.adapter.rooms;
    for (let k of rooms.keys()) {
        if (k.startsWith(game)) {
            let inf;
            if (RoomPasswd.get(k))
                inf = [k, rooms.get(k).size, 1];
            else
                inf = [k, rooms.get(k).size];
            availableRoomsTab.push(inf);
        }
    }
    return availableRoomsTab;
}