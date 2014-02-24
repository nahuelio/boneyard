/**
*	Benchmark UI commons
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var config = (function(window) {
	
	this.tpls = {
		bar: '<div class="<%= moduleName %>-<%= methodName %> bar"><span class="progress"></span></div>',
		timer: '<p class="<%= moduleName %>-<%= methodName %> timer"></p>'
	};
	
	/**
	*	Benchmark on start handler
	**/
	var onStart = _.bind(function(e) {
		var info = e.target.name.split('#'),
			module = info[0], method = info[1];
		if(module && method) {
			$('.' + module).append(_.template(this.tpls.bar, { moduleName: module, methodName: method }));
			$('.' + module).append(_.template(this.tpls.timer, { moduleName: module, methodName: method }));
			$('.' + module + ' .timer').html('0 sec');
		}
	}, this);
	
	/**
	*	Benchmark on cycle handler
	**/
	var onCycle = _.bind(function(e) {
		console.log(e.target.name);
	}, this);
	
	/**
	*	Benchmark on complete handler
	**/
	var onComplete = function() {
		
	};
	
	return {
		onStart: onStart,
		onCycle: onCycle,
		onComplete: onComplete
	}
}(window));