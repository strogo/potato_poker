var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');

app.use(express.static(__dirname + '/'));

//Helper function to stringify message from erlang
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

//For storing names and their socket ids
var players = [];

io.on('connection', function(socket){
    var pokerServer = new net.Socket();

    //Connect to TCP
    pokerServer.connect(3547, '127.0.0.1', function() {
	var name = "";

	console.log('New player! Socket ID: ' + socket.id);

	//Pass on message from TCP server to client
	pokerServer.on('data', function(data) {
		var str = ab2str(data);
		var split = str.split('$');
		io.to(socket.id).emit('server message', split);
	});

	function chat(msg) {
		io.to(socket.id).emit('chat message', msg);
	}

	//Take a chat message - send chat message to everyone
	socket.on('chat message', function(msg){
	    if(name === "") {
			name = msg;
			players[socket.id] = msg;
			console.log('added player: ' + msg + ' players:' + players.length);
			io.emit('chat message', players[socket.id] + ' joined the game!');
			//Also tell erlang server the name
			/*TODO: Instead of letting the server know the chosen name, it should now the id defined in pokerRoom.js*/
			pokerServer.write('name$' + msg + '\r\n');
			pokerServer.write('join$The Potato Sack\r\n'); //TODO Remove if multiple tables
	    } else {
			io.emit('chat message', players[socket.id] + ': ' + msg);
			pokerServer.write(msg + '\r\n');
	    }

	    console.log(players[socket.id] + ': ' + msg);

	});

	//Take a player's poker command
	socket.on('command', function(msg) {
	    console.log('player ' + socket.id + ': ' + msg);
	    //tell everyone what happened
	    pokerServer.write('move$' + msg + '\r\n');
	    
	});

    });

});

http.listen(8080, function(){
  console.log('listening on *:8080');
});


