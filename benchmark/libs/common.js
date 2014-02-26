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
		sample: '<div class="sample"></div>',
		results: '<div class="results"></div>'
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
	var onCycle = _.bind(function(e) { }, this);
	
	/**
	*	Benchmark Complete handler
	**/
	var onComplete = _.bind(function(e) {
		var data = this.getData(e);
		if(data) {
			var output = '<p class="header">Results</p><p class="data"><span>Statistical: ' + e.target.toString() + '</span>';
			output += '<span>Total Time: ' + e.target.times.elapsed + ' secs</span>',
			output += '<span>Last Sample took: ' + e.target.times.cycle + ' secs</span>';
            this.$currentResults.append(output);
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
	var onCreate = _.bind(function(e, benchmarks) {
		_.each(benchmarks, function(b) {
			var info = b.name.split('#'),
				module = info[0], method = info[1];
			if(module && method) {
				var $c = $(_.template(this.tpls.container, { moduleName: module, methodName: method })).appendTo($('div.' + module)),
					$clear = $(_.template(this.tpls.button, { methodName: method, id: 'clear', label: 'Clear' })).appendTo($c).on('click', this.onButtonClearClick),
					$run = $(_.template(this.tpls.button, { methodName: method, id: 'run', label: 'Run' })).appendTo($c).on('click', this.onButtonRunClick),
					$name = $(this.tpls.name).appendTo($c),
					$sample = $(this.tpls.sample).appendTo($c),
					$results = $(this.tpls.results).appendTo($c);
				$name.html('#' + method + '()');
				var funcString = _.str.strRightBack(_.str.strLeftBack(b.fn.toString(), '}'), 'function () {');
				$sample.html('<p class="header">Sample Code to Benchmark</p><code class="prettyprint">' + this.convertStrToHTML(funcString) + '</code>');
				b.on('reset', this.onReset);
				Bench.suite.push(b);
			}
		}, this);
	}, this);
	
	this.convertStrToHTML = function(str) {
		return str.replace(/\n/g, '<br/>').replace(/\t/g, '&nbsp;&nbsp;');
	}
	
	/** Create Suite and Event setup **/
	
	var suite = Benchmark.Suite('spinaljs');
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
			onComplete: onComplete
		}
	};
	
}(window));