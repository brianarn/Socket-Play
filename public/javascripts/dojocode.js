dojo.require("dojox.socket");

dojo.ready(function(){
	var session = {},
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
				/*
				 *if (!sessionId) {
				 *    xhr.then(function(data){
				 *        // Parse out our ID
				 *        sessionId = data.split(':')[0];
				 *        console.log('Session ID:',sessionId);
				 *        args.url += sessionId;
				 *        dojo.xhrGet(args);
				 *    });
				 *}
				 */
				//return xhr;
			}
		}; // args

	dojo.xhrGet({
		url: '/socket.io/1/?t=' + new Date()
	}).then(function(data){
		// Parse session data
		var sessData = data.split(':');
		session.id = sessData[0];
		session.heartbeat = sessData[1];
		session.timeout = sessData[2];

		// Set up the necessary pieces for our connection
		args.url += session.id;
		var socket = dojox.socket(args);

		socket.on("open", function(){
			console.log("I am connected!",arguments);
		});
		socket.on("message", function(e){
			console.log('onmessage:',arguments);
			var msg = e.data.split(':');
			switch(msg[0]) {
				case "0": // disconnected
					console.log('Received disconnect message');
					break;
				case "1": // connected
					console.log('Received connection message');
					break;
				case "2": // heartbeat
					// Send a heartbeat back
					socket.send('2::');
					break;
				case "3": //  message
					break;
				case "4": // JSON-encoded message
					break;
				case "5": // event
					break;
				case "6": // ack
					break;
				case "7": // error
					break;
				case "8": // no-op
					break;
				default:
					console.error('Unknown message data:', e.data);
					return;
			} // switch(msg[0])
		});
		socket.on("close", function(){
			console.log('I am disconnected!',arguments);
		});
	});
/*
	var socket = dojox.socket(args);

	socket.on("open", function(){
		console.log("I am connected!",arguments);
		socket.send('~m~49~m~Hello');
	});
	socket.on("message", function(e){
		console.log("I have a message!",arguments);
		var msg = e.data;
		if (!sessionId) {
			sessionId = msg;
			args.url += '/' + msg;
		} else {
			console.log('msg:',msg);
		}
	});
	socket.on("close", function(){
		console.log('I am disconnected!',arguments);
	});
*/
});
