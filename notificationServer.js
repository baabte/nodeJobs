var http = require('http');
// var uuid = require('node-uuid'); 

var app = http.createServer(function (request, response) {
        response.writeHead(200, {'Content-Type': 'text/plain'}); // responding to the connection request with status code 200 (success)
        response.write("connected "); // giving a response to conected client
        response.end();
    
}).listen(1555); // setting the port to which this application have to listen

var io = require('socket.io').listen(app); // creating a socket server
    // io.sockets.on('disconnect', function(arg) {
    //     console.log(arg);
    // });
    io.sockets.on('connection', function(socket) {

        socket.on('join',function(data){
            var uid = uuid.v1();
            var myData={name:data.name};
                io.sockets.emit("welcome",{msg:'hai'});
        });

    });

