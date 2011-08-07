var socket = io.connect();

socket.on("connect", function(){
	console.log("I am connected!",arguments);
});
socket.on("message", function(){
	console.log("I have a message!",arguments);
});
socket.on("disconnect", function(){
	console.log("I am disconnected!",arguments);
});
