var socket = io.connect();

socket.on('connect', function(){
	console.log('I am connected!',arguments);
});

socket.on('disconnect', function(){
	console.log('I am disconnected!',arguments);
});
