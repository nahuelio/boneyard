/**
*	Spinal Build Tool
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var fs = require('fs'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join;

// Third-party libs
var	requirejs = require('requirejs'),
	jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify,
	async = require('async'),
	_ = require('underscore'),
	_s = require('underscore.string');

// Project specific libs
var Package = require('../utils/package'),
	Logger = require('../utils/logger'),
	Utils = require('../utils/util');

// Project Configs
var pkg = require('../../package.json'),
	bowerpkg = require('../../bower.json');

/**
*	Build namespace
**/
var Build = {

	/**
	*	Defaults
	*	@public
	*	@property defaults
	*	@type Object
	**/
	defaults: {
		basePath: resolve(__dirname, '../../'),
		config: '../default-build-config.json'
	},

	/**
	*	Build config
	*	@public
	*	@property config
	*	@type Object
	**/
	config: null,

	/**
	*	Execute Build
	*	@public
	*	@method exec
	*	@param [opts] {Object} extra options
	**/
	exec: function(opts) {
		opts || (opts = {});
		this.defaults = _.extend(opts, this.defaults);
		this.output();
		this.loadConfig();
		this.libs();
		this.release();
	},

	/**
	*	Output Initial Message
	*	@public
	*	@method output
	**/
	output: function() {
		Logger.log('----------------------', { nl: true });
		Logger.log('| Spinal Build v' + pkg.version + ' |');
		Logger.log('----------------------');
	},

	/**
	*	Loads config
	*	@public
	*	@method loadConfig
	**/
	loadConfig: function() {
		Logger.debug('[CONFIG] Loading Configuration...', { nl: true });
		try {
			this.config = require(resolve(__dirname, this.defaults.config));
		} catch(ex) {
			Logger.warn('[CONFIG] Config File doesn\'t exists or an error came through the syntax', { nl: true });
			Logger.error(ex.message, { nl: true });
		}
	},

	/**
	*	Execute Build
	*	@public
	*	@method exec
	**/
	libs: function() {
		Logger.log('[PREBUILD] Building Dependencies...', { nl: true });
		var libPath = Utils.createDir(resolve(this.defaults.basePath, './src/libs'));
		_.each(bowerpkg.dependencies, function(version, name) {
			try {
				var filename = libPath + '/' + name + '.js';
				var files = Utils.findFiles(resolve(resolve(this.defaults.basePath, './bower_components')) + '/**/' + name + '.js', {});
				if(files.length > 0) {
					var o = fs.readFileSync(files[0], 'utf8');
					Utils.createFile(filename, this.minify(o), { mode: 0777, encoding: 'utf8', flags: 'w' });
					Logger.debug('[PREBUILD] Exported [' + name + ']');
				} else {
					Logger.debug('[PREBUILD] Error while exporting library dependency. Skipping...', { nl: true });
				}
			} catch(ex) {
				Logger.error(ex.message + '. Skipping...', { nl: true });
			}
		}, this);
	},

	/**
	*	Releaase project packages using requirejs optimizer
	*	@public
	*	@method release
	**/
	release: function() {
		Logger.log('[RELEASE] Creating Release...', { nl: true });
		try {
			Utils.createDir(resolve(this.defaults.basePath, this.config.project.dir));
			this.config.project.mainConfigFile = resolve(this.defaults.basePath, this.config.project.mainConfigFile);
			this.config.project.dir = resolve(this.defaults.basePath, this.config.project.dir);
			requirejs.optimize(this.config.project, _.bind(this.banner, this), function(err) {
				Logger.error(err.Error);
				process.exit();
			});
		} catch(ex) {
			Logger.error('[RELEASE] Error ocurred while building modules: ' + ex.message, { nl: true });
			process.exit();
		}
	},


	/**
	*	Minify Stream (Candidate to move into utils)
	*	@public
	*	@method exec
	*	@param [opts] {Object} extra options
	**/
	minify: function(stream) {
		var ast = jsp.parse(stream),
		ast = pro.ast_mangle(ast),
		ast = pro.ast_squeeze(ast),
		minified = pro.gen_code(ast);
		return minified;
	},

	/**
	*	Banner inclusion
	*	@public
	*	@method exec
	*	@param [opts] {Object} extra options
	**/
	banner: function(result) {
		var banner = fs.readFileSync(resolve(__dirname, '../', this.config.options.banner), { encoding: 'utf8'});
		_.each(this.config.project.modules, function(m) {
			if(m.name !== 'spinal-libs') {
				var moduleName = _s.capitalize(_s.strRightBack(m.name, '-')),
				data = { module: moduleName, version: pkg.version, year: new Date().getFullYear(), author: pkg.author },
				contents = fs.readFileSync(m._buildPath, 'utf8');
				contents = _s.insert(contents, 0, _.template(banner, data));
				if(m.name === 'spinal-core') contents = _.template(contents, { __VERSION__: pkg.version });
				Utils.createFile(m._buildPath, contents, { mode: 0777, encoding: 'utf8', flags: 'w' });
			}
		}, this);
		Logger.log('[RELEASE] Build Process DONE.');
	}

};

module.exports = Build;
