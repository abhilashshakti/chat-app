var http = require('http');
var fs = require('fs');

var ent = require('ent');

var server = http.createServer(function (req, res) {
    fs.readFile('./index.html', 'utf-8', function (error, content) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(content);
    });
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, username) {

    // User username callback is received. Send out the client message and broadcast
    socket.on('client_registration', function (username) {
        socket.username = username;
        console.log('client_registration username: ' + username);
        socket.emit('server_message', socket.username + ': You are connected!');
        socket.broadcast.emit('server_message', socket.username + ' has joined the chat!');
    });

    socket.on('client_message', function (message) {
        //        message = ent.encode(message);
        console.log(message);
        socket.emit('server_message', message);
        socket.broadcast.emit('server_message', message);
    });
});

server.listen(8080);
console.log('Waiting for client requests on localhost:8080 ...');
