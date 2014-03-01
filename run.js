/**
*	Basic Web Service that shows Benchmarking and Code Coverage results
**/

var connect = require('connect');
connect().use(connect.static(__dirname + '/lib'))
	.use(connect.static(__dirname + '/benchmark'))
	.use(connect.static(__dirname + '/docs'))
	.listen(8080);