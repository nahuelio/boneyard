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
var requirejs = require('requirejs'),
	connect = require('connect'),
	compression = require('compression'),
	watch = require('watch'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	io = require('socket.io');

// Project specific libs
var Package = require('../utils/package'),
	Logger = require('../utils/logger'),
	Utils = require('../utils/util');

var pkg = require('../../package.json');

/**
*	Composer namespace
**/
var Composer = {

	/**
	*	Composer Tool base path
	*	@public
	*	@property bPath
	*	@type String
	**/
	bPath: resolve(__dirname, '../../'),

	/**
	*	User Base Path
	*	@public
	*	@property uPath
	*	@type String
	**/
	uPath: null,

	/**
	*	Composer defaults
	*	@public
	*	@property defaults
	*	@type Object
	**/
	defaults: {
		configPath: './tools/default.json',
		config: null,
		template: './tools/composer/composer.html',
		requireMain: 'main.js',
		clear: false,
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
	source: null,

	/**
	*	Target Path
	*	@public
	*	@property target
	*	@type String
	**/
	target: null,

	/**
	*	Config
	*	@public
	*	@property config
	*	@type Object
	**/
	config: null,

	/**
	*	Require Config Template
	*	@public
	*	@property requireTpl
	*	@type String
	**/
	requireTpl: 'requirejs.config(<%= cfg %>);',

	/**
	*	Execute Composer
	*	@public
	*	@method execute
	*	@param cfg {Object} Main Config input
	**/
	exec: function(cfg) {
		cfg || (cfg = {});
		Logger.log('Spinal Composer Tool', { nl: true });
		this.loadConfig().loadCustomConfig(cfg);
		this.setup(cfg).export().output(cfg);
		this.spinUpServer();
	},

	/**
	*	Load Default Config
	*	@public
	*	@method loadConfig
	*	@return Composer
	**/
	loadConfig: function() {
		this.defaults.config = require(resolve(this.bPath, this.defaults.configPath));
		return this;
	},

	/**
	*	Load Default Config
	*	@public
	*	@method loadCustomConfig
	*	@param cfg {Object} composer config file
	*	@return Composer
	**/
	loadCustomConfig: function(cfg) {
		if(!cfg.uPath) { Logger.log('[COMPOSER] Loaded Default Application Config file.', { nl: true }); return this; }
		try {
			var configPath = resolve(cfg.uPath, cfg.config);
			this.uPath = cfg.uPath;
			this.config = require(configPath);
			Logger.log('[COMPOSER] Loading Config file [' + configPath + ']', { nl: true });
		} catch(ex) { Utils.onError(ex.message); }
		return this;
	},

	/**
	*	Output options selected in the command line
	*	@public
	*	@method output
	*	@param cfg {Object} composer config file
	**/
	output: function(cfg) {
		Logger.debug('Configured Settings:', { nl: true });
		Logger.debug('\tSource Path: ' + this.source +
			'\n\tConfig File: ' + ((!cfg.config) ? 'Using Default (Custom not specified)' : cfg.config) +
			'\n\tClear on Exit: ' + ((this.defaults.clear) ? 'Activated' : 'Deactivated') +
			'\n\tListening on: http://' + this.host + ':' + this.defaults.port + '/');
	},

	/**
	*	Load Config files, default one and if provided custom one
	*	@public
	*	@method loadConfig
	*	@param cfg {Object} composer config file
	*	@return Composer
	**/
	setup: function(cfg) {
		if(this.config && !_.isObject(this.config)) Utils.onError('[COMPOSER] Malformed Custom Config Aapplication File.');
		_.extend(this, _.omit(this.defaults.config, 'require'), (this.config) ? _.omit(this.config, 'mainSpec', 'require') : {});
		if(!_.isUndefined(cfg.clear)) this.defaults.clear = cfg.clear;
		if(!_.isUndefined(cfg.port)) this.defaults.port = cfg.port;
		if(!_.isUndefined(cfg.host)) this.host = cfg.host;
		this.source = resolve((this.uPath) ? this.uPath : this.bPath, this.source);
		this.target = resolve((this.uPath) ? this.uPath : this.bPath, this.target);
		this.defaults.template = resolve(this.bPath, this.defaults.template);
		return this.createTarget().copyAssets();
	},

	/**
	*	Create Target Folder
	*	@private
	*	@method createTarget
	*	@return Composer
	**/
	createTarget: function() {
		Utils.createDir(this.target);
		return this;
	},

	/**
	*	Copy Assets and Main file used relative to the source path to be deployed in the target
	*	@public
	*	@method copyAssets
	*	@return Composer
	**/
	copyAssets: function() {
		this.main = (this.config && this.config.requireMain) ? this.config.requireMain : this.defaults.requireMain;
		Utils.copyFile(resolve(this.source, this.main), resolve(this.target, this.main));
		return this;
	},

	/**
	*	Creates the temporal target folder to launch the composer tool
	*	By copying the an index.html, the require main file in use and a initial spec (if specified).
	*	@public
	*	@method createTarget
	*	@return Composer
	**/
	export: function() {
		var tpl = fs.readFileSync(this.defaults.template, "utf8"),
			output = _.template(tpl, {
				name: this.name, version: pkg.version, host: this.host,
				requireMain: Utils.getFilename(this.main, true),
				mainSpec: (this.uPath) ? this.config.mainSpec : this.defaults.config.mainSpec,
				spinalCore: this.spinalCore
			});
		Utils.createFile(resolve(this.target, './index.html'), output);
		Logger.warn('[COMPOSER] Composer Environment [Ready]');
		return this;
	},

	/**
	*	Spin Up the server with autowatch support to track changes in the project
	*	@public
	*	@method spinUpAutowatch
	**/
	spinUpServer: function() {
		var server = connect()
			.use(connect.favicon(resolve(__dirname, './favicon.ico'), { maxAge: 1 }))
			.use(compression({ threshold: 0 }))
			.use(connect.static(this.target))
			.use(connect.static(this.source));
		if(!this.config) server.use(connect.static(resolve(this.bPath, './dist')));
		server.listen(this.defaults.port);
		this.spinUpAutoWatch();
		watch.createMonitor(this.source, { ignoreDotFiles: true, ignoreUnreadableDir: true }, _.bind(this.onFileChange, this));
		Logger.log('[COMPOSER] Server listening on port ' + this.defaults.port + '...', { nl: true });
	},

	/**
	*	Spins Up AutoWatch service on source path
	*	@public
	*	@method spinUpAutoWatch
	**/
	spinUpAutoWatch: function() {
		this.live.server = http.createServer();
		this.live.socket = io(this.live.server);
		this.live.socket.on('connect', _.bind(function(client) {
			Logger.debug('[COMPOSER] Client Binded [' + client.id + '] - Total Connected [' +
				_.keys(this.live.socket.sockets.connected).length + ']');
		}, this));
		this.live.server.listen(9494, function() {
			Logger.log('[COMPOSER] AutoWatch Socket Service listening on port 9494...');
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
			Logger.debug('[COMPOSER] File Created [' + f + '] Refreshing browser...');
			this.live.socket.emit('reload');
		}, this));
		monitor.on("changed", _.bind(function (f, curr, prev) {
			Logger.debug('[COMPOSER] File Modified [' + f + '] Refreshing browser...');
			this.live.socket.emit('reload');
		}, this));
		monitor.on("removed", _.bind(function (f, stat) {
			Logger.debug('[COMPOSER] File Removed [' + f + '] Refreshing browser...');
			this.live.socket.emit('reload');
		}, this));
	}

};

module.exports = Composer;
