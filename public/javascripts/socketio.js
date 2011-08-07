var socket = io.connect();

socket.on("connect", function(){
	console.log("I am connected!",arguments);
});
socket.on("disconnect", function(){
	console.log("I am disconnected!",arguments);
});

socket.on("message", function(msg){
	console.log('Message received:', msg);
	var li = document.createElement('li');
	li.innerHTML = 'Message received: ' + msg;
	document.getElementById('messages').appendChild(li);
});

// A very simple setup to send data
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('send').addEventListener('click', function(e){
		var msg = document.getElementById('msgbody').value;
		socket.send(msg);
	}, false);
}, false);
