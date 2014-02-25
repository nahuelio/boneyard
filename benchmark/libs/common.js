/**
*	Benchmark UI commons
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var Bench = (function(window) {
	
	/**
	*	UI templates
	**/
	this.tpls = {
		container: '<div id="<%= moduleName %>-<%= methodName %>" class="<%= methodName %> method"></div>',
		name: '<p class="name"></p>',
		button: '<button class="<%= id %> <%= methodName %>"><%= label %></button>',
		bar: '<div class="bar"><span class="progress"></span></div>',
		timer: '<p class="timer"></p>'
	};
	
	/** Button Handlers **/
	
	this.getBench = function(e) {
		var moduleName = $(e.currentTarget).parent().parent().attr('id'),
			methodName = $(e.currentTarget).parent().attr('id');
		var b = Bench.suite.filter(function(b) {
			if(b.name === methodName.replace('-', '#')) return b;
		});
		return b;
	};
	
	/**
	*	RuRunnAll Button handler: Trigger benchmarking on specific test case inside a module
	**/
	this.onButtonRunClick = _.bind(function(e) {
		var bench = this.getBench(e);
		if(bench) bench.run();
		e.preventDefault();
	}, this);
	
	/**
	*	Clear Button handler: Clear Results.
	**/
	this.onButtonClearClick = _.bind(function(e) {
		var bench = this.getBench(e);
		if(bench) bench.reset();
		e.preventDefault();
	}, this);
	
	/**
	*	RunAll Button handler: Trigger all benchmarks test cases inside a module.
	**/
	this.onButtonRunAllClick = _.bind(function(e) {
		Bench.Suite.run();
		e.preventDefault();
	}, this);
	
	/**********************/
	/** Benchmark Events **/
	/**********************/
	
	/**
	*	Benchmark Start handler
	**/
	var onStart = _.bind(function(e) {
		var info = e.target.name.split('#'), module = info[0], method = info[1];
		if(module && method) {
			$('div#' + module + '-' + method + ' .timer').append('<span>Start: ' + e.target.times.elapsed + ' sec</span>');
		}
		console.log('Bench on: ' + module + '#' + method + ' started');
	}, this);
	
	/**
	*	Benchmark Cycle handler
	**/
	var onCycle = _.bind(function(e) {
	
	}, this);
	
	/**
	*	Benchmark Complete handler
	**/
	var onComplete = _.bind(function(e) {
		var info = e.target.name.split('#'), module = info[0], method = info[1];
		if(module && method) {
			$('div#' + module + '-' + method + ' .timer').append('<span>End: ' + e.target.times.elapsed + ' sec</span>');
		}
		console.log('Bench on: ' + module + '#' + method + ' completed');
	}, this);
	
	/**
	*	Benchmarl Reset Handler
	**/
	var onReset = _.bind(function(e) { }, this);
	
	/******************/
	/** Suite Events **/
	/******************/
	
	/**
	*	Suite Start handler
	**/
	var onSuiteStart = _.bind(function(e) { }, this);
	
	/**
	*	Suite Cycle handler
	**/
	var onSuiteCycle = _.bind(function(e) { }, this);
	
	/**
	*	Suite Complete handler
	**/
	var onSuiteComplete = _.bind(function(e) { }, this);
	
	/**
	*	Suite Benches were Created into the suite.
	**/
	var onCreate = _.bind(function(e) {
		_.each(e.target, function(b) {
			var info = b.name.split('#'),
				module = info[0], method = info[1];
			if(module && method) {
				var $c = $(_.template(this.tpls.container, { moduleName: module, methodName: method })).appendTo($('div.' + module)),
					$clear = $(_.template(this.tpls.button, { methodName: method, id: 'clear', label: 'Clear' })).appendTo($c).on('click', this.onButtonClearClick),
					$run = $(_.template(this.tpls.button, { methodName: method, id: 'run', label: 'Run' })).appendTo($c).on('click', this.onButtonRunClick),
					$name = $(this.tpls.name).appendTo($c),
					$bar = $(this.tpls.bar).appendTo($c),
					$timer = $(this.tpls.timer).appendTo($c);
				$name.html('#' + method + '()');
			}
		}, this);
	}, this);
	
	/** Create Suite and Event setup **/
	
	var suite = Benchmark.Suite();
	suite.on('start', onSuiteStart);
	suite.on('cycle', onSuiteCycle);
	suite.on('complete', onSuiteComplete);
	suite.on('created', onCreate);
	
	/** Benchmark Config **/
	
	return {
		suite: suite,
		_events: {
			onStart: onStart,
			onCycle: onCycle,
			onComplete: onComplete,
			onReset: onReset
		}
	};
	
}(window));