/**
*	Benchmark for Spinal-Util Module
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
$(document).ready(function() {
	
	var benchs = {
		utilCollection: new Benchmark('util#adt.Collection', function() { }, Bench._events),
		utilIterator: new Benchmark('util#adt.Iterator', function() { }, Bench._events),
		utilQueue: new Benchmark('util#adt.Queue', function() { }, Bench._events)
	};
	
	Bench.suite.emit('created', benchs);
	
});