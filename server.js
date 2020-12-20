var http = require('http');
var fs = require('fs');
var socket = require('socket.io');
var express = require('express');

var app = express();
var server = http.createServer(app);
var io = socket(server);

app.use('/public', express.static('public'));
app.use('/src', express.static('src'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('home.ejs');
});

server.listen(process.env.PORT || 3000, () => {
    console.log( 'Server turned on' ); 
});

io.on('connection', function(socket) {
    console.log('client connected:' + socket.id);
    socket.on('chat message', function(data) {
    io.emit('chat message', data);
    })
});