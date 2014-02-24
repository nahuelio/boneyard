/**
*	Basic Service that shows Benchmarking and Code Coverage results
**/

var connect = require('connect');
connect().use(connect.static(__dirname + '/lib'))
	.use(connect.static(__dirname + '/benchmark'))
	.listen(8080);