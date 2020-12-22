const http = require('http');
const fs = require('fs');
const socket = require('socket.io');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);
var io = socket(server);

var i = 1;
var socketRoom = {};
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
    res.render('chess-game', { id: req.params.id });
});

app.post('/validate-room', function(req, res) {     //TODO: fix false response
    let ar = availableRooms(req.body.game_type)
    if(ar.includes(req.body.room))
        res.send('false');
    res.send('true');
});

server.listen(process.env.PORT || 3000, () => {
    console.log( 'Server turned on' ); 
});

io.on('connection', function(socket) {  
    console.log('client connected');

    socket.on('load_rooms', function(data) {
        console.log('returning room list...');
        io.emit('rooms', availableRooms(data));
    });

    socket.on('join-new-room', function (data) {
        socket.join(data.game + '-' + data.room);
        socket.broadcast.emit('rooms', availableRooms(data.game));
    });

    socket.on('disconnecting', () => {  //or just socket.leave and then broadcast - seems better practise
        for(let el of socket.rooms) {
            if(el.startsWith('chess') || el.startsWith('checkers') || el.startsWith('domino')) {
                socketRoom[socket.id] = el.substr(0, el.indexOf('-'));
                break;
            }
        }
    });

    socket.on('disconnect', function () {
        if(socketRoom[socket.id])
            socket.broadcast.emit('rooms', availableRooms(socketRoom[socket.id]));
    });
});

function availableRooms(game) {
    var availableRoomsTab = [];
    var rooms = io.sockets.adapter.rooms;
    for (let k of rooms.keys()) {
        if(k.startsWith(game))
            availableRoomsTab.push(k);
    }
    return availableRoomsTab;
}