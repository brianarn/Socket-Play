dojo.require("dojox.socket");

dojo.ready(function(){
	var socket,
		url = typeof WebSocket != "undefined" ? "/socket.io/1/websocket/" : " /socket.io/1/xhr-polling/",
		args = {
			url: url,
			headers:{
				"Content-Type":"application/x-www-urlencoded"
			},
			transport: function(args, message){
				console.log('transport:',args,message);
				args.content = message; // use URL-encoding to send the message instead of a raw body
				dojo.xhrPost(args);
			}
		}; // args

	// Perform the initial handshake
	dojo.xhrPost({
		url: '/socket.io/1/?t=' + new Date()
	}).then(function(data){
		// Parse session data
		var session;

		// Build up a session object
		data = data.split(':');
		session = {
			id: data[0],
			heartbeat: data[1],
			timeout: data[2]
		};

		// Set up the necessary pieces for our connection
		args.url += session.id;
		session.socket = socket = dojox.socket(args);

		// Set up some simple event handling 
		socket.on("open", function(){
			console.log("I am connected!",arguments);
		});
		socket.on("close", function(){
			console.log('I am disconnected!',arguments);
		});

		// The large handler: Everything comes through message here
		socket.on("message", function(e){
			// Originally I was splitting on colons but that falls apart when receiving JSON
			// This regex with its non-greedy .*? pieces seems to do the trick nicely
			var msg, msgData = /^(\d+):(.*?):(.*?):?(.*)/.exec(e.data);
			console.log('Message Data:',msgData);

			// Determine what actions to take
			switch(msgData[1]) {
				case "0": // disconnected
					console.log('Received disconnect message');
					break;
				case "1": // connected
					console.log('Received connection message');
					break;
				case "2": // heartbeat
					// Send a heartbeat back
					console.log('Heartbeat');
					socket.send('2::');
					break;
				case "3": //  message
					// These don't seem to happen, but I want to see *something* in this case
					dojo.create('li', {
						innerHTML: JSON.stringify(e.data)
					}, 'messages');
					break;
				case "4": // JSON-encoded message
					// Also, these don't seem to happen, but still
					dojo.create('li', {
						innerHTML: JSON.stringify(e.data)
					}, 'messages');
					break;
				case "5": // event
					// Even when doing simple message sends from the server,
					// these seem to be what I get.
					msg = JSON.parse(msgData[4]).args[0];
					console.log('Message received: ', msg);
					dojo.create('li', {
						innerHTML: 'Message received: ' + msg
					}, 'messages');
					break;
				case "6": // ack
					// TODO: Determine a good action here
					break;
				case "7": // error
					console.error('Error received:', e.data);
					break;
				case "8": // no-op
					// Intentionally blank, but here to indicate that
					// I *could* receive one of these
					break;
				default:
					console.error('Unknown message data:', e.data);
					return;
			} // switch(msgData[0])
		}); // socket.on("message", ...);
	}); // Handshake .then

	// Some very simple mechanisms to send data
	dojo.connect(dojo.byId('send'), 'onclick', function(){
		var msg = dojo.byId('msgbody').value;
		socket.send('5:::' + JSON.stringify({
			name: 'message',
			args: [msg]
		}));
	});
}); // dojo.ready
