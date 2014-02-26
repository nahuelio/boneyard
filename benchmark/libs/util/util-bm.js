/**
*	Benchmark for Spinal-Util Module
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
$(document).ready(function() {
	
	var benchs = {
		utilBrowser: new Benchmark('util#Browser', function() { }, Bench._events)	
	};
	
	Bench.suite.emit('created', benchs);
	
});