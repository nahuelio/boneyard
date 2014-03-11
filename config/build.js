/**
*  Spinal Build Process
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
	resolve = path.resolve,
	join = path.join,
	pkg = require('../package.json'),
	builder = require('browserify')(),
	jsp = require("uglify-js").parser,
  	pro = require("uglify-js").uglify,
	async = require('async'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	colors = require('colors'),
	Utils = require('./util');

var Build = {
	
	/**
	*	Default Configuration for Spinal Framework
	**/
	config: {
		source: '../src',
		output: '../target/',
		options: {
			minify: false,
			debug: true,
			live: false,
			banner: "//\tSpinalJS <%= version %> (c) <%= year %> <%= author %>, 3dimention.com\n" +
				"//\tSpinalJS may be freely distributed under the MIT license.\n" +
				"//\tFor all details and documentation:\n//\thttp://3dimention.github.io/spinal\n\n"
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
		this.release(); // Process Config Core
	},
	
	/**
	*	Process Custom build based on a config file (if exist).
	**/
	processCustom: function(cfgFile) {
		Utils.log('[BUILD] Parsing project configuration file...'.green);
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
	*	Release Final Files
	**/
	release: function() {
		console.log('\nCreating Release...');
		async.series([_.bind(this.processLibs, this), _.bind(this.processFiles, this), _.bind(this.export, this)], _.bind(function(err, stream) {
			if(err) {
				Utils.log(('[RELEASE] Error ocurred while building modules: ' + err).red);
				process.exit();
			}
			var target = resolve(__dirname, this.config.output, (pkg.name + '-' + pkg.version + '.js'));
			//var output = _.template(stream[2], { version: pkg.version });
			var minified = (this.config.options.minify) ? this.minify(stream[2]) : stream[2];
			var bannered = this.banner(minified);
			fs.writeFileSync(target, bannered, { mode: 0777, encoding: 'utf8', flags: 'w' });
			Utils.log('[RELEASE] Build Process DONE.'.green);
		}, this));
	},
	
	/**
	*	Export External Libraries in different
	**/
	processLibs: function(cb) {
		Utils.log('\n[RELEASE] Building Dependencies...'.green);
		Utils.createDir(this.config.output, 'lib');
		_.each(pkg.dependencies, function(version, name) {
			try {
				var filename = 'lib/' + name + '.min.js';
				var exportpath = resolve(__dirname, this.config.output, filename);
				var files = Utils.findFiles('node_modules/' + name + '/**/' + name + '.js', {});
				if(files.length > 0) {
					var o = fs.readFileSync(files[0], 'utf8');
					fs.writeFileSync(exportpath, this.minify(o), { mode: 0777, encoding: 'utf8', flags: 'w' }); // minify and save.
					builder.external(exportpath); // mark dependency as 'external' in the builder.
					Utils.log(('[RELEASE] Exported [' + name + ']').cyan);
				} else {
					Utils.log('Error while exporting library dependency. Skipping...'.yellow);
				}
			} catch(ex) {
				Utils.log(ex.message.red);
				Utils.log('Skipping...'.yellow);
			}
		}, this);
		cb(null);
	},
	
	/**
	*	Add Framework files
	**/
	processFiles: function(cb) {
		Utils.log('\n[RELEASE] Building Core Files...'.green);
		try {
			var files = Utils.filterFiles(resolve(__dirname, this.config.source));
			_.each(files, function(f) { 
				builder.add(f);
				Utils.log(('[RELEASE] Class File [' + f + '] processed.').cyan);
			}, this);
			cb(null);
		} catch(ex) {
			Utils.log(('Error parsing files: ' + ex.message).red);	
			cb(ex.message, null);
		}
	},
	
	/**
	*	Package files and generate a single bundle file into the target directory.
	**/
	export: function(cb) {
		builder.bundle({ debug: this.config.debug }, cb);
	},
	
	/**
	*	Minify Bundle File
	**/
	minify: function(stream) {
		var ast = jsp.parse(stream),
  			ast = pro.ast_mangle(ast),
  			ast = pro.ast_squeeze(ast),
  			minified = pro.gen_code(ast);
		return minified;
	},
	
	/**
	*	Banner Insertion
	**/
	banner: function(o) {
		return _s.insert(o, 0, _.template(this.config.options.banner, { version: pkg.version, year: new Date().getFullYear(), author: pkg.author }));
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