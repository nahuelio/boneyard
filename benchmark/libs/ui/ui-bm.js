/**
*	Benchmark for Spinal-UI Module
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
$(document).ready(function() {
	
	var benchs = {
		uiContainer: new Benchmark('ui#Container', function() { }, Bench._events)
	};
	
	Bench.suite.emit('created', benchs);
	
});