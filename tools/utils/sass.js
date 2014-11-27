/**
*	Build Sass Utils
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var fs = require('fs'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join;

// Project specific libs
var Logger = require('./logger'),
	Utils = require('./util');

// Third-party libs
var _ = require('underscore');

var Sass = {

	/**
	*	Base Path
	*	@public
	*	@property basePath
	*	@type String
	**/
	basePath: resolve(__dirname, '../../'),

	/**
	*	Source Path
	*	@public
	*	@property src
	*	@type String
	**/
	src: null,

	/**
	*	Target Path
	*	@public
	*	@property target
	*	@type String
	**/
	target: null,

	/**
	*	Template package name
	*	@public
	*	@property name
	*	@type String
	**/
	name: 'default',

	/**
	*	Output Object to be wrapped in a AMD module.
	*	@public
	*	@property output
	*	@type Object
	**/
	output: null,

	/**
	*	Initialize HTML Util
	*	@public
	*	@method init
	*	@param opts {Object} options
	*	@return HTML
	**/
	init: function(opts) {
		opts || (opts = {});
		if(!opts.src || !opts.target || !_.isString(opts.src) || !_.isString(opts.target))
			throw new Error('[THEMES] Build Themes util requires a \'src\' and \'target\' parameters in order to work');
		return this.setup(opts);
	},

	/**
	*	Setup Resolved Paths
	*	@public
	*	@method setup
	*	@param opts {Object} options
	**/
	setup: function(opts) {
		if(opts.name) this.name = opts.name;
		this.src = resolve(this.basePath, opts.src);
		this.target = resolve(this.basePath, opts.target);
		return this;
	},

	/**
	*	Process
	*	@public
	*	@method setup
	*	@param opts {Object} options
	**/
	process: function() {
		// TODO: Implement
		Logger.debug('[THEMES] Exporting Template [' + this.name + '] from [' + this.src + '] to [' + this.target + ']', { nl: true });
		return this.export();
	},

	/**
	*	Export HTML Templates into the target folder
	*	@public
	*	@method export
	*	@return HTML
	**/
	export: function() {
		// TODO: Implement
		return this;
	}

};

module.exports = Sass;
