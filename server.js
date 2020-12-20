const http = require('http');
const fs = require('fs');
const socket = require('socket.io');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);
var io = socket(server);

app.use('/public', express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/chess-list', function(req, res) {
    res.render('chess_list.ejs', { rooms: io.sockets.adapter.rooms });
});

server.listen(process.env.PORT || 3000, () => {
    console.log( 'Server turned on' ); 
});

io.on('connection', function(socket) {
    console.log('client connected');

    socket.on('new_room', function(data) {
        console.log('new room created');
        console.log('room name ' + data);
        socket.join(data);
        console.log(socket.rooms);
    });

    socket.on('load_rooms', function(data) {
        console.log('returning new rooms...');
        var availableRooms = [];
        var rooms = io.sockets.adapter.rooms;
        for (let k of rooms.keys()) {
            if(k.startsWith('chess'))
                availableRooms.push(k);
        }
        console.log(availableRooms);
        socket.emit('rooms', availableRooms);
    });
});

/*
    <% rooms.forEach( room => { %>
        <div class="list_item">
            <p> <%= room %></p>
        </div>
    <% }); %>
    */