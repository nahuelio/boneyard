/**
*  Spinal Build Process
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
	resolve = path.resolve,
	join = path.join,
	browserify = require('browserify'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	colors = require('colors');

var pkg = require('../package.json'),
	bowerPkg = require('../bower.json'),
	Dependencies = require('./dependencies'),
	Utils = require('./util');

var Build = {
	
	/**
	*	Default Configuration for Spinal Framework
	**/
	config: {
		name: pkg.name,
		version: pkg.version,
		author: pkg.author,
		source: '../src',
		libraries: {
			root: '../src/libraries',
			libs: bowerPkg.dependencies
		},
		options: { }
	},
	
	/**
	*	Execute command based on parameters
	**/
	exec: function(action, opts) {
		if(action == 'build') this.build(opts);
		if(action == 'benchmark') this.benchmark();
	},
	
	/**
	*	Export and release framework
	**/
	build: function(opts) {
		opts || (opts = {});
		this.processCustom(opts.c); // lets skip it for now.
		this.processCore(opts); // Process Config Core
	},
	
	/**
	*	Process Custom build based on a config file (if exist).
	**/
	processCustom: function(cfgFile) {
		var custom = this.loadConfig(cfgFile);
		if(!custom) return;
		// add 'src' and 'libs' to the config. And resolve 'dest' if custom config file is provided.
	},
	
	/**
	*	Load Config File.
	**/
	loadConfig: function(cfgFile) {
		try { // try the one provided by the user
			return require(resolve(__dirname, cfgFile));
		} catch(ex) { // Try default one
			try {
				return require(resolve(__dirname, '../spinal.json'));
			} catch(ex) {
				Utils.log('[BUILD] Config File doesn\'t exists, Using default settings instead.'.yellow);	
			}
		}
	},
	
	/**
	*	Processing Modules
	**/
	processCore: function(opts) {
		Dependencies.run(this.config, _.bind(function(result) {
			this.release(result, opts); // Release Everything
		}, this));
	},
	
	/**
	*	Release Final Files
	**/
	release: function(opts) {
		console.log('\nCreating Release...\n');
		Utils.log('[RELEASE] Exporting framework...'.green);
		console.log(browserify);
		/**output = this.banner(output);
		// FIXME
		var filename = resolve(__dirname, './lib/' + pkg.name + '-' + pkg.version + '-SNAPSHOT.js');
		fs.writeFileSync(filename, o, { mode: 0777, encoding: 'utf8', flags: 'w' }); **/
	},
	
	/**
	*	Banner Insertion
	**/
	banner: function(o) {
		return _s.insert(o, 0, _.template(pkg.banner, { version: pkg.version, year: new Date().getYear(), author: pkg.author }));
	},
	
	/***********************/
	/**	Benchmarking Code **/
	/***********************/
	
	/**
	*	Parse Modules
	**/
	parse: function() {
		return _.compact(_.map(fs.readdirSync(resolve(__dirname, '../src')), function(fd) {
			var st = fs.statSync(resolve(__dirname, '../src/' + fd));
			if(st && st.isDirectory()) return { name: fd };
		}, this));
	},
	
	/**
	*	Build Benchmark tool based on modules available.
	**/
	benchmark: function() {
		Utils.log('[BUILD-Benchmark] Generating Benchmark tool for SpinalJS Framework'.green);
		var htmltpl = fs.readFileSync(resolve(__dirname, '../benchmark/templates/template.html'), 'utf8');
		var filename = resolve(__dirname, '../benchmark/spinal-' + pkg.version + '-benchmark.html');
		fs.writeFileSync(filename, _.template(htmltpl, { version: pkg.version, modules: this.parse() }), { mode: 0777, encoding: 'utf8', flags: 'w' });
	}
	
};

module.exports = Build;