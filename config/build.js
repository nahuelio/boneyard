/**
*  Spinal Build Process
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
	resolve = path.resolve,
	join = path.join,
	builder = require('browserify')(),
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
		options: {
			minify: true,
			bundle: true,
			banner: "//\tSpinalJS <%= version %> (c) <%= year %> <%= author %>, 3dimention.com\n \
				//\tSpinalJS may be freely distributed under the MIT license.\n \
				//\tFor all details and documentation:\n//\thttp://3dimention.github.io/spinal\n\n";
		}
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
		this.processCore(); // Process Config Core
	},
	
	/**
	*	Process Custom build based on a config file (if exist).
	**/
	processCustom: function(cfgFile) {
		var custom = this.loadConfig(cfgFile);
		if(!custom) return;
		// Validate Config file options
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
	processCore: function() {
		Dependencies.run(this.config, _.bind(function(result) { this.release(this.config.options); }, this));
	},
	
	/**
	*	Release Final Files
	**/
	release: function(opts) {
		console.log('\nCreating Release...\n');
		Utils.log('[RELEASE] Exporting framework...'.green);
		this.addFiles();
		if(opts.bundle) this.bundle();
		if(opts.minify) this.minify();
		//this.banner(opts.banner);
		Utils.log('[RELEASE] Build Process DONE.'.green);
		// Add Information at the end.
	},
	
	/**
	*	Add Framework files
	**/
	addFiles: function() {
		
	},
	
	/**
	*	Package files and generate a single bundle file into the target directory.
	**/
	bundle: function() {
		
	},
	
	/**
	*	Minify Bundle File
	**/
	minify: function() {
		
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