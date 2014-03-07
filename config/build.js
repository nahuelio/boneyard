/**
*  Spinal Build Process
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
	resolve = path.resolve,
	join = path.join,
	builder = require('browserify')(),
	async = require('async'),
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
		build: {
			outfile: '../lib/spinal-<%= version %>.js',
			minify: true,
			bundle: true,
			options: {
				debug: true
			},
			banner: "//\tSpinalJS <%= version %> (c) <%= year %> <%= author %>, 3dimention.com\n \
				//\tSpinalJS may be freely distributed under the MIT license.\n \
				//\tFor all details and documentation:\n//\thttp://3dimention.github.io/spinal\n\n"
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
		Dependencies.run(this.config, _.bind(function(result) { this.release(); }, this));
	},
	
	/**
	*	Release Final Files
	**/
	release: function() {
		console.log('\nCreating Release...\n');
		Utils.log('[RELEASE] Exporting framework...'.green);
		async.series([_.bind(this.addFiles, this), _.bind(this.export, this, this.config.build)], _.bind(function(err, stream) {
			//this.banner(opts.banner);
			var target = resolve(__dirname, _.template(this.config.build.outfile, { version: this.config.version }));
			fs.writeFileSync(target, stream[1], { mode: 0777, encoding: 'utf8', flags: 'w' });
			Utils.log('[RELEASE] Build Process DONE.'.green);
			// Add Information at the end.
		}, this));
	},
	
	/**
	*	Add Framework files
	**/
	addFiles: function(cb) {
		try {
			var files = Utils.filterFiles(resolve(__dirname, this.config.source), ['libraries']);
			_.each(files, function(f) { builder.add(f); }, this);
			cb(null);
		} catch(ex) {
			Utils.log(('Error parsing files: ' + ex.message).red);	
		}
		return this;
	},
	
	/**
	*	Package files and generate a single bundle file into the target directory.
	**/
	export: function(build, cb) {
		builder.on('file', _.bind(this.onFile, this, build));
		builder.on('bundle', _.bind(this.onBundle, this, build));
		builder.bundle(build.options, cb);
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
	
	/** Handlers **/
	
	onBundle: function(opts, bundle) {
		//console.log('bundle: ');
	},
		
	onFile: function(opts, file, id, parent) {
		//console.log('File: ', file);
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