/**
*	Basic Web Service that servers content for
*	Benchmarking, API docs, high level documentation (examples) and Spinal Composer.
**/
var connect = require('connect');
connect().use(connect.static(__dirname + '/target'))
	.use(connect.static(__dirname + '/benchmark'))
	.use(connect.static(__dirname + '/docs'))
	.use(connect.static(__dirname + '/examples'))
	.listen(8080);
