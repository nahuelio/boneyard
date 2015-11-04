/**
*	Basic Web Service that servers content for API docs, high level documentation (examples).
**/
var connect = require('connect');
connect().use(connect.static(__dirname + '/dist'))
	.use(connect.static(__dirname + '/docs'))
	.use(connect.static(__dirname + '/examples'))
	.listen(8080);
