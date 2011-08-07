var socket = io.connect('http://localhost:3000');

socket.on('message', function(msg){
	console.log('Message received: ', msg);
});
