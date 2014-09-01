/**
*	Spinal Composer Tool
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var fs = require('fs'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join;

// Third-party libs
var connect = require('connect'),
	watch = require('watch'),
	_ = require('underscore'),
	_s = require('underscore.string');

// Project specific libs
var Package = require('../utils/package'),
	Logger = require('../utils/logger'),
	Utils = require('../utils/util');

/**
*	Composer namespace
**/
var Composer = {

	/**
	*	Composer Tool base path
	*	@public
	*	@property defaults
	*	@type Object
	**/
	basePath: resolve(__dirname, '../../'),

	/**
	*	Composer defaults
	*	@public
	*	@property defaults
	*	@type Object
	**/
	defaults: {
		spinalSource: './src',
		spinalConfig: './default.json',
		template: './composer.html',
		clear: true,
		verbose: false,
		port: 9393
	},

	/**
	*	Source
	*	@public
	*	@property source
	*	@type String
	**/
	source: './src',

	/**
	*	Target Path
	*	@public
	*	@property target
	*	@type String
	**/
	target: './composer-app',

	/**
	*	Spinal Config
	*	@public
	*	@property spinalConfig
	*	@type Object
	**/
	spinalConfig: {},

	/**
	*	Config
	*	@public
	*	@property config
	*	@type Object
	**/
	config: {},

	/**
	*	Execute Composer
	*	@public
	*	@method execute
	*	@param [opts] {Object} extra options
	**/
	exec: function(opts) {
		opts || (opts = {});
		this.defaults = _.extend(opts, this.defaults);
		this.output();
		this.setup();
		this.createTarget();
		this.spinUpAutoWatch();
	},

	/**
	*	Output options selected in the command line
	*	@public
	*	@method output
	**/
	output: function() {
		Logger.log('Spinal Composer Tool', { nl: true });
		Logger.debug('Settings:', { nl: true });
		Logger.debug('\tSource Path: ' + this.source +
			'\n\tConfig File: ' + ((!this.config) ? 'Not Specified' : this.config) +
			'\n\tClear on Exit: ' + ((this.defaults.clear) ? 'Activated' : 'Deactivated') +
			'\n\tVerbose: ' + ((this.defaults.verbose) ? 'Activated' : 'Deactivated'), { nl: true });
	},

	/**
	*	Load Config files, default one and if provided custom one
	*	@public
	*	@method loadConfig
	**/
	setup: function() {
		try {
			this.setupDefault();
			if(this.defaults.config) {
				this.customConfig(this.defaults.config);
			} else {
				Logger.warn('Custom Config file not specified.', { nl: true });
				Logger.log('Loaded Default Config file.');
			}
			_.extend(this.config, this.spinalConfig);
		} catch(ex) {
			Logger.error(ex.message);
			process.exit();
		}
	},

	/**
	*	Load Custom Config and merges default config file
	*	@public
	*	@method customConfig
	*	@param configPath {String} custom config path
	**/
	customConfig: function(configPath) {
		Logger.log('Loading Config file [' + configPath + ']', { nl: true });
		this.config = require(configPath);
		if(!this.config || !_.isObject(this.config)) throw new Error('[CONFIG] Malformed custom config file.');
	},

	/**
	*	Process Default config file
	*	@public
	*	@method processDefault
	**/
	setupDefault: function() {
		var path = resolve(this.basePath, './tools/', this.defaults.spinalConfig);
		this.spinalConfig = require(path);
		this.spinalConfig.require.bundles = Package.bundles({
			basePath: resolve(this.basePath, this.defaults.spinalSource),
			paths: this.spinalConfig.require.paths
		});
		this.spinalConfig.require.paths = { libs: "libs" }; // @TryThis: Clean up paths for packages except libs
	},

	/**
	*	Generate SpinalJS Spec
	*	@public
	*	@method generateSpec
	**/
	generateSpec: function(baseDir) {
		var src = resolve(__dirname, this.config.project.mainSpec + '.js');
		var target = resolve(baseDir, this.config.project.mainSpec + '.js');
		Utils.copyFile(src, target);
	},

	/**
	*	Creates the temporal target folder to launch the composer tool
	*	@public
	*	@method createTarget
	**/
	createTarget: function() {
		Logger.log('Generating Composer Environment', { nl: true });
		try {
			var baseDir = Utils.createDir(this.basePath, this.target); // FIXME: Global Execution
			if(!this.defaults.config) this.generateSpec(baseDir);
			this.config.require = JSON.stringify(this.config.require);
			var tpl = fs.readFileSync(resolve(__dirname, this.defaults.template), "utf8");
			Utils.createFile(baseDir + '/index.html', _.template(tpl, this.config), { encoding: 'utf8' });
		} catch(ex) {
			Logger.error(ex.message);
		}
	},

	/**
	*	Spin Up the server with autowatch support to track changes in the project
	*	@public
	*	@method spinUpAutowatch
	**/
	spinUpAutoWatch: function() {
		Logger.log('Spinning Up Server...', { nl: true });
		// TODO: Watch service do later
		//watch.createMonitor(this.source, { ignoreDotFiles: true, ignoreUnreadableDir: true }, _.bind(this.onFileChange, this));
		 // FIXME: Global Execution of 'this.target';
		connect().use(connect.static(resolve(this.basePath, this.target)))
			.use(connect.static(resolve(this.basePath, './target')))
			.listen(this.defaults.port);
		Logger.debug('Server listening on port ' + this.defaults.port + '...', { nl: true });
	},

	/**
	*	File change handler for autowatch
	*	@public
	*	@method onFileChange
	*	@param monitor {Object} monitor reference
	**/
	onFileChange: function(monitor) {
		monitor.on("created", function (f, stat) {
			Logger.debug('File Created [' + f + ']', { nl: true });
			// TODO: Fire emitter to the browser to reload
		});
		monitor.on("changed", function (f, curr, prev) {
			Logger.debug('File Modified [' + f + ']', { nl: true });
			// TODO: Fire emitter to the browser to reload
		});
		monitor.on("removed", function (f, stat) {
			Logger.debug('File Removed [' + f + ']', { nl: true });
			// TODO: Fire emitter to the browser to reload
		});
	}

};

module.exports = Composer;
