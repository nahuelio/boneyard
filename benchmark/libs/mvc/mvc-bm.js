/**
*	Benchmark for Spinal-MVC Module
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
$(document).ready(function() {
	
	var benchs = {
		mvcModel: new Benchmark('mvc#Model', function() { }, Bench._events),
		mvcController: new Benchmark('mvc#Controller', function() { }, Bench._events),
		mvcService: new Benchmark('mvc#Service', function() { }, Bench._events)
	};
	
	Bench.suite.emit('created', benchs);
	
});