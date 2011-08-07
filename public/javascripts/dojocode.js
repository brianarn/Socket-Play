dojo.require("dojox.socket");

dojo.ready(function(){
	var sessionId,
		url = typeof WebSocket != "undefined" ? "/socket.io/1/websocket/" : " /socket.io/1/xhr-polling/",
		args = {
			url: url,
			headers:{
				"Content-Type":"application/x-www-urlencoded"
			},
			transport: function(args, message){
				console.log('transport:',args,message);
				args.content = message; // use URL-encoding to send the message instead of a raw body
				var xhr = dojo.xhrPost(args);
				if (!sessionId) {
					xhr.then(function(data){
						// Parse out our ID
						sessionId = split(data)[0];
						args.url += '';
						args.content = {};
						dojo.xhrGet(args);
					});
				}
				return xhr;
			}
			/*
			transport: function(args, message) {
				console.log('transport:',args,message);
				if (!sessionId) {
				} else {
				}
			}
			*/
		}; // args

	var socket = dojox.socket(args);

	socket.on("open", function(){
		console.log("I am connected!",arguments);
	});
	socket.on("message", function(){
		console.log("I have a message!",arguments);
	});
	socket.on("close", function(){
		console.log('I am disconnected!',arguments);
	});
});
