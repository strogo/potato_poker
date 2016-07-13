var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

io.on('connection', function(socket){
    var pokerServer = new net.Socket();

    pokerServer.connect(3547, '127.0.0.1', function() {
	console.log('New player! Socket ID: ' + socket.id);
	io.emit('chat message', 'New player! Socket ID: ' + socket.id);

	//Pass on message from server to client
	pokerServer.on('data', function(data) {
	    io.to(socket.id).emit('chat message', ab2str(data));
	});

	socket.on('chat message', function(msg){
	    console.log('player ' + socket.id + ': ' + msg);
	    io.emit('chat message', msg);
	    pokerServer.write(msg + '\r\n');
	});

    });

});

http.listen(8888, function(){
  console.log('listening on *:8888');
});
