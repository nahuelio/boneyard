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
	Sass = require('../utils/sass'),
	HTML = require('../utils/html'),
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
		this.release(_.bind(function() {
			process.nextTick(_.bind(function() { this.templates(); this.themes(); }, this));
		}, this));
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
		Logger.debug('[CONFIG] Loading Build Configuration...', { nl: true });
		try {
			this.config = require(resolve(__dirname, this.defaults.config));
		} catch(ex) {
			Logger.warn('[CONFIG] Build Config File doesn\'t exists or an error came through the syntax', { nl: true });
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
					var o = fs.readFileSync(files[0], 'utf8'); Utils.createFile(filename, this.minify(o));
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
	*	Build templates (HTML)
	*	@public
	*	@method templates
	**/
	templates: function() {
		if(!this.config.templates || _.isEmpty(this.config.templates)) return this;
		_.each(this.config.templates, function(t, name) { HTML.init(_.extend(t, { name: name })).process(); }, this);
	},

	/**
	*	Build Themes (Sass)
	*	@public
	*	@method themes
	**/
	themes: function() {
		if(!this.config.themes || _.isEmpty(this.config.themes)) return this;
		_.each(this.config.themes, function(t, name) { Sass.init(_.extend(t, { name: name })).process(); }, this);
	},

	/**
	*	Release project packages using requirejs optimizer
	*	@public
	*	@method release
	*	@param [callback] {Function} optional callback
	**/
	release: function(callback) {
		Logger.log('\n[JS-BUILD] Building...');
		try {
			Utils.createDir(resolve(this.defaults.basePath, this.config.project.dir));
			this.config.project.mainConfigFile = resolve(this.defaults.basePath, this.config.project.mainConfigFile);
			this.config.project.dir = resolve(this.defaults.basePath, this.config.project.dir);
			requirejs.optimize(this.config.project, _.bind(function() {
				this.banner();
				if(callback && _.isFunction(callback)) callback();
			}, this), function(err) {
				console.error(err);
				Logger.error(err.Error);
				process.exit();
			});
		} catch(ex) {
			Logger.error('[JS-BUILD] Error ocurred while building modules: ' + ex.message, { nl: true });
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
				Utils.createFile(m._buildPath, contents);
			}
		}, this);
		Logger.debug('[JS-BUILD] Deployment DONE', { nl: true });
	}

};

module.exports = Build;
