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
		results: '<p class="results"></p>'
	};
	
	/** Button Handlers **/
	
	this.getBench = function(e) {
		var moduleName = $(e.currentTarget).parent().parent().attr('id'),
			methodName = $(e.currentTarget).parent().attr('id');
		var b = Bench.suite.filter(function(b) {
			if(b.name === methodName.replace('-', '#')) return b;
		});
		return b[0];
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
	
	this.$currentResults = null;
	
	this.getData = function(e) {
		var info = e.target.name.split('#'), module = info[0], method = info[1];
		return (module && method) ? { module: module, method: method } : null;
	};
	
	/**
	*	Benchmark Start handler
	**/
	var onStart = _.bind(function(e) {
		var data = this.getData(e);
		if(data) {
			this.$currentResults = $('div#' + data.module + '-' + data.method + ' .results');
		}
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
		var data = this.getData(e);
		if(data) {
			this.$currentResults.html('<span>' + e.target.toString() + '</span>');
			// console.log('Bench on: ' + data.module + '#' + data.method + ' completed');
		}
	}, this);
	
	/**
	*	Benchmarl Reset Handler
	**/
	this.onReset = _.bind(function(e) {
		var data = this.getData(e);
		if(data) {
			this.$currentResults = $('div#' + data.module + '-' + data.method + ' .results');
			this.$currentResults.html('');
			// console.log('Bench on: ' + data.module + '#' + data.method + ' reset');
		}
	}, this);
	
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
					$results = $(this.tpls.results).appendTo($c);
				$name.html('#' + method + '()');
				b.on('reset', this.onReset);
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
	// FIXME: Add options here
	return {
		suite: suite,
		_events: {
			onStart: onStart,
			onCycle: onCycle,
			onComplete: onComplete
		}
	};
	
}(window));