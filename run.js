/**
*	Basic Web Service that shows Benchmarking and Code Coverage results
**/

var connect = require('connect');
connect().use(connect.static(__dirname + '/target'))
	.use(connect.static(__dirname + '/benchmark'))
	.use(connect.static(__dirname + '/docs'))
	.use(connect.static(__dirname + '/examples'))
	.listen(8080);