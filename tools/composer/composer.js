/**
*	Spinal Composer Tool
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var fs = require('fs'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join,
	http = require('http');

// Third-party libs
var connect = require('connect'),
	watch = require('watch'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	io = require('socket.io');

// Project specific libs
var Build = require('../spinal/build'),
	Package = require('../utils/package'),
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
	*	Live Reload Server/SocketIO
	*	@public
	*	@property live
	*	@type Object
	**/
	live: {
		server: null,
		socket: null
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
		this.spinUpServer();
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
				Logger.warn('[COMPOSER] Custom Application Config file not specified.', { nl: true });
				Logger.log('[COMPOSER] Loaded Default Application Config file.');
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
		Logger.log('[COMPOSER] Loading Config file [' + configPath + ']', { nl: true });
		this.config = require(configPath);
		if(!this.config || !_.isObject(this.config)) throw new Error('[COMPOSER] Malformed Custom Config Aapplication File.');
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
		Logger.log('[COMPOSER] Generating Composer Environment', { nl: true });
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
	spinUpServer: function() {
		Logger.log('[COMPOSER] Spinning Up Server...', { nl: true });
		// Static Serving
		connect().use(connect.static(resolve(this.basePath, this.target)))
			.use(connect.static(resolve(this.basePath, this.source)))
			.listen(this.defaults.port);
		Logger.debug('[COMPOSER] Server listening on port ' + this.defaults.port + '...', { nl: true });
		// AutoWatch
		watch.createMonitor(resolve(this.basePath, this.source), {
			ignoreDotFiles: true, ignoreUnreadableDir: true
		}, _.bind(this.onFileChange, this));
		this.spinUpAutoWatch();
	},

	spinUpAutoWatch: function() {
		this.live.server = http.createServer();
		this.live.socket = io(this.live.server);
		this.live.socket.on('connect', _.bind(function(client) {
			Logger.log('[COMPOSER] Client Binded [' + client.id + ']');
			console.log('[COMPOSER] Total clients connected', _.keys(this.live.socket.sockets.connected).length);
		}, this));
		this.live.server.listen(9494, function() {
			Logger.debug('[COMPOSER] ServeSocket listening on port 9494...', { nl: true });
		});
	},

	/**
	*	File change handler for autowatch
	*	@public
	*	@method onFileChange
	*	@param monitor {Object} monitor reference
	**/
	onFileChange: function(monitor) {
		monitor.on("created", _.bind(function(f, stat) {
			Logger.debug('File Created [' + f + ']');
			Logger.debug('[COMPOSER] Refreshing browser...');
			this.live.socket.emit('reload');
		}, this));
		monitor.on("changed", _.bind(function (f, curr, prev) {
			Logger.debug('File Modified [' + f + ']');
			Logger.debug('[COMPOSER] Refreshing browser...');
			this.live.socket.emit('reload');
		}, this));
		monitor.on("removed", _.bind(function (f, stat) {
			Logger.debug('File Removed [' + f + ']');
			Logger.debug('[COMPOSER] Refreshing browser...');
			this.live.socket.emit('reload');
		}, this));
	}

};

module.exports = Composer;
