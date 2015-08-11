var http = require('http');
// var uuid = require('node-uuid'); 

var app = http.createServer(function (request, response) {
        response.writeHead(200, {'Content-Type': 'text/plain'}); // responding to the connection request with status code 200 (success)
        response.write("connected "); // giving a response to conected client
        response.end();
    
}).listen(1555); // setting the port to which this application have to listen

var io = require('socket.io').listen(app); // creating a socket server

    io.sockets.on('connection', function(socket) {
    // here we are using io.sockets for broadcasting the message to all.
        socket.on('new_notification',function(data){
              socket.broadcast.emit("notification"+data.loginId,{notification:data.data});
              socket.emit("notification"+data.loginId,{notification:data.data});
        });

    });

