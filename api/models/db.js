var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/gousto';
var shutDown;

// On production env. use mLab database
// Keep mLab URI in a protected env. variable - MONGOLAB_URI
if(process.env.NODE_ENV === 'production'){
	dbURI = process.env.MONGOLAB_URI;
	//dbURI = 'mongodb://root:test@ds123933.mlab.com:23933/gousto';
}

if(process.env.NODE_ENV === 'test') {
	dbURI = 'mongodb://localhost/gousto_test';
}

mongoose.connect(dbURI, {useMongoClient: true});

mongoose.connection.on('connected', function() {
	console.log('Mongooose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

var gracefulShutDown = function(msg, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	})
}

// 
process.once('SIGUSR2', function() {
	gracefulShutDown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	})
});

// App close
process.on('SIGINT', function() {
	gracefulShutDown('app termination', function() {
		process.exit(0);
	})
});

// SIGTERM event emitted when Heroku has stopped the process
process.on('SIGTERM', function() {
	gracefulShutdown('Heroku app shutdown', function () {
		process.exit(0);
	});
});

require('./recipes');