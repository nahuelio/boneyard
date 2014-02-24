/**
*	Benchmark UI commons
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var config = (function(window) {
	
	this.tpls = {
		container: '<div class="<%= methodName %> method"></div>',
		name: '<p class="name"></p>',
		bar: '<div class="bar"><span class="progress"></span></div>',
		timer: '<p class="timer"></p>'
	};
	
	/**
	*	Benchmark on start handler
	**/
	var onStart = _.bind(function(e) {
		var info = e.target.name.split('#'),
			module = info[0], method = info[1];
		if(module && method) {
			var $c = $(_.template(this.tpls.container, { methodName: method })).appendTo($('div.' + module)),
				$name = $(this.tpls.name).appendTo($c),
				$bar = $(this.tpls.bar).appendTo($c),
				$timer = $(this.tpls.timer).appendTo($c);
			$name.html('#' + method + '()');
			$timer.html('0 sec');
			e.target.on('setup', setup);
		}
	}, this);
	
	var setup = _.bind(function() {
		
	}, this);
	
	/**
	*	Benchmark on cycle handler
	**/
	var onCycle = _.bind(function(e) {
		
	}, this);
	
	/**
	*	Benchmark on complete handler
	**/
	var onComplete = function() {
		
	};
	
	/** Benchmark Config **/
	return {
		_events: {
			onStart: onStart,
			onCycle: onCycle,
			onComplete: onComplete
		}
	};
}(window));