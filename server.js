const http = require('http');
const fs = require('fs');
const socket = require('socket.io');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);
var io = socket(server);

var socketRoom = new Map(); //socket.id -> room name
var socketGame = new Map(); //socket.id -> game type
var roomPasswd = new Map(); //full room name -> password    encode it

app.use(express.urlencoded({
    extended: true
}))

app.use('/public', express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/chess-list', function(req, res) {
    res.render('room_list.ejs', { game_type: 'CHESS' });
});

app.get('/chess-list/:id', function(req, res){
    res.render('chess-game', { room_name: req.query.room_name, game_type: req.query.game_type });
});

app.post('/validate-room', function(req, res) {
    let ar = availableRooms(req.body.game)
    let room = req.body.game + '-' + req.body.room;
    for(let i = 0; i < ar.length; i++) {
        if(ar[i][0] === room) {
            res.send('Room already exists!');
            return;
        }
    }

    if(req.body.room.length > 15) {
        res.send('Room name is too long!');
        return;
    }

    if(req.body.room === "") {
        res.send('Insert room name!');
        return;
    }

    if(req.body.password != "")
        roomPasswd.set(req.body.game + '-' + req.body.room, req.body.password);

    res.send('true');
});

server.listen(process.env.PORT || 3000, () => {
    console.log( 'Server turned on' ); 
});

io.on('connection', function(socket) {  
    console.log('client connected');

    socket.on('load_rooms', function(data) {
        console.log('returning room list...');
        socket.emit('rooms', availableRooms(data));
    });

    socket.on('join-new-room', function (data) {
        socket.join(data.game + '-' + data.room);
        socketGame.set(socket.id, data.game)
        socketRoom.set(socket.id, data.room)
        socket.broadcast.emit('rooms', availableRooms(data.game));
    });

    socket.on('disconnecting', () => {  //remove data from maps
        if(socketGame.get(socket.id)) {
            var full_room_name = socketGame.get(socket.id) + '-' + socketRoom.get(socket.id);
            if(io.sockets.adapter.rooms.get(full_room_name).size == 1) {
                roomPasswd.delete(full_room_name);
            }
            socketRoom.delete(socket.id);
        }
    });

    socket.on('disconnect', function () {   //emit new room list and clear last map
        socket.broadcast.emit('rooms', availableRooms(socketGame.get(socket.id)));
        socketGame.delete(socket.id);
        console.log('client disconnected');
    });
});

function availableRooms(game) {
    var availableRoomsTab = [];
    var rooms = io.sockets.adapter.rooms;
    for (let k of rooms.keys()) {
        if(k.startsWith(game)) {
            let inf;
            if(roomPasswd.get(k))
                inf = [k, rooms.get(k).size, 1];
            else
                inf = [k, rooms.get(k).size];
            availableRoomsTab.push(inf);
        }
    }
    return availableRoomsTab;
}