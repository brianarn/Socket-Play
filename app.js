
/**
 * Module dependencies.
 */

var express = require('express'),
	io = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Socket.IO Play'
  });
});

// Socket.IO

io = io.listen(app);

io.sockets.on('connection', function(socket){
	console.log('Connection!',socket.id);
	setTimeout(function(){
		socket.disconnect();
	}, 1000);
});

// Starting it all up

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
