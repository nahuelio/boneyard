/**
*	Basic Service that shows Benchmarking and Code Coverage results
**/

var connect = require('connect');
connect().use(connect.static(__dirname + '/lib')).listen(8080);