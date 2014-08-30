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
var Bundles = require('../utils/bundles'),
	Logger = require('../utils/logger'),
	Utils = require('../utils/util');

/**
*	Composer namespace
**/
var Composer = {

	/**
	*	Composer defaults
	*	@public
	*	@property defaults
	*	@type Object
	**/
	defaults: {
		config: '../default.json',
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
		this.loadConfig();
		//this.createTarget();
		//this.spinUpAutoWatch();
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
			'\n\tLocal Folder: ' + this.target +
			'\n\tClear on Exit: ' + ((this.defaults.clear) ? 'Activated' : 'Deactivated') +
			'\n\tVerbose: ' + ((this.defaults.verbose) ? 'Activated' : 'Deactivated'), { nl: true });
	},

	/**
	*	Load Config file (custom for specific project or the default one)
	*	@public
	*	@method loadConfig
	**/
	loadConfig: function() {
		try {
			if(!this.defaults.config) {
				Logger.warn('Path to the config file not specify', { nl: true });
				console.log(this.defaults.config);
				this.defaults.config = resolve(__dirname, this.defaults.config);
				Logger.debug('Loading Default Config file [' + this.defaults.config + ']', { nl: true });
			} else {
				Logger.log('Loading Config file [' + resolve(__dirname, this.defaults.config) + ']', { nl: true });
			}
			this.config = require(this.defaults.config);
		} catch(ex) {
			Logger.error(ex.message);
			process.exit();
		}
	},

	/**
	*	Creates the temporal target folder to launch the composer tool
	*	@public
	*	@method createTarget
	**/
	createTarget: function() {
		Logger.log('Generating Composer Environment', { nl: true });
		var baseDir = Utils.createDir(__dirname, this.target);
		try {
			var tpl = fs.readFileSync(resolve(__dirname, this.defaults.template), "utf8");
			// TODO: Need to look for an strategy to tell in which bundle you will find the module ID.
			Utils.createFile(baseDir + '/index.html', _.template(tpl, {
				project: this.config.project,
				require: JSON.stringify(_.omit(this.config.require, 'mainConfigFile', 'out'))
			}), { encoding: 'utf8' });
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
		connect().use(connect.static(resolve(__dirname, this.target)))
			.use(connect.static(resolve(__dirname, '../', 'target')))
			.listen(this.port);
		Logger.debug('Server listening on port ' + this.port + '...', { nl: true });
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
