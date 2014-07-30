/**
*  Spinal Build Process
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
	resolve = path.resolve,
	join = path.join,
	pkg = require('../package.json'),
	bowerpkg = require('../bower.json'),
	requirejs = require('requirejs'),
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
        project: {
            mainConfigFile: 'src/main.js',
            modules: [
                { name: 'libs' },
                { name: 'spinal-core', exclude: ['libs'] },
                { name: 'spinal-util', exclude: ['libs', 'spinal-core'] },
                { name: 'spinal-ioc', exclude: ['libs', 'spinal-core', 'spinal-util'] },
                { name: 'spinal-aop', exclude: ['libs', 'spinal-core', 'spinal-util'] },
                { name: 'spinal-mvc', exclude: ['libs', 'spinal-core', 'spinal-util'] },
                { name: 'spinal-ui', exclude: ['libs', 'spinal-core', 'spinal-util'] }
            ],
            findNestedDependencies: true,
            removeCombined: true,
            optimize: 'uglify2',
            uglify: {
                toplevel: false,
                ascii_only: true,
                beautify: false,
                max_line_length: 1000,
                no_mangle: true
            },
            dir: 'target'
        },
        libs: {
            minify: true,
            banner: "//\tModule <%= module %> | SpinalJS <%= version %> (c) <%= year %> <%= author %>, 3dimention.com\n" +
                "//\tSpinalJS may be freely distributed under the MIT license.\n" +
                "//\tFor all details and documentation:\n//\thttp://3dimention.github.io/spinal\n\n"
        },
        debug: true,
        live: false
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
		//this.processCustom(opts.c); // lets skip it for now.
        this.processLibs();
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
		Utils.log('\nCreating Release...\n');
		try {
			Utils.createDir(resolve(__dirname, '../'), this.config.project.dir);
			requirejs.optimize(this.config.project, _.bind(this.banner, this), function(err) { console.log(err); });
		} catch(ex) {
			Utils.log(('[RELEASE] Error ocurred while building modules: ' + ex.message).red);
			process.exit();
		}
	},

	/**
	*	Export External Libraries in different
	**/
	processLibs: function() {
		Utils.log('\n[RELEASE] Building Dependencies...'.green);
		var libPath = Utils.createDir(resolve(__dirname, '../src'), 'libs');
		_.each(bowerpkg.dependencies, function(version, name) {
			try {
				var filename = libPath + '/' + name + '.js';
                var files = Utils.findFiles('bower_components/**/' + name + '.js', {});
				if(files.length > 0) {
					var o = fs.readFileSync(files[0], 'utf8');
				    Utils.createFile(filename, this.minify(o), { mode: 0777, encoding: 'utf8', flags: 'w' }); // minify and save.
					Utils.log(('[RELEASE] Exported [' + name + ']').cyan);
				} else {
					Utils.log('Error while exporting library dependency. Skipping...'.yellow);
				}
			} catch(ex) {
				Utils.log(ex.message.red);
				Utils.log('Skipping...'.yellow);
			}
		}, this);
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
	banner: function(result) {
        _.each(this.config.project.modules, function(m) {
            if(m.name !== 'libs') {
                var contents = fs.readFileSync(m._buildPath, 'utf8');
                contents = _s.insert(contents, 0, _.template(this.config.libs.banner, { module: m.name, version: pkg.version, year: new Date().getFullYear(), author: pkg.author }));
                Utils.createFile(m._buildPath, contents, { mode: 0777, encoding: 'utf8', flags: 'w' }); // minify and save.
            }
        }, this);
        Utils.log('[RELEASE] Build Process DONE.'.green);
	},

	/***********************/
	/** Benchmarking Code **/
	/***********************/

	/**
	*	Parse Modules
	**/
	parse: function() {
		return _.compact(_.map(fs.readdirSync(resolve(__dirname, '../src/com/spinal')), function(fd) {
			var st = fs.statSync(resolve(__dirname, '../src/com/spinal/' + fd));
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
