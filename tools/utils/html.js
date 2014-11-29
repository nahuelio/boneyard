/**
*	Build HTML Utils
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

var HTML = {

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
	*	AMD template for exporting HTML templates
	*	@public
	*	@property exportTpl
	*	@type String
	**/
	exportTpl: "define(['core/spinal'], function(Spinal) { " +
		"return Spinal.namespace('templates', <%= tpls %>); });",

	/**
	*	Initialize HTML Util
	*	@public
	*	@method init
	*	@param opts {Object} options
	*	@return HTML
	**/
	init: function(opts) {
		opts || (opts = {});
		this.output = {};
		if(!opts.src || !opts.target || !_.isString(opts.src) || !_.isString(opts.target))
			throw new Error('[HTML-BUILD] Build HTML util requires a \'src\' and \'target\' parameters in order to work');
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
		this.output[this.name] = {};
		return this;
	},

	/**
	*	Get Package namespace Name
	*	@public
	*	@method getPackages
	*	@param filename {String} full path to filename
	*	@return String
	**/
	getNamespace: function(filename) {
		var paths = filename.split(this.src);
		var ns = (paths.length > 1) ? paths[1].split('/') : null,
			path = (ns && ns.length > 0) ? _.compact(ns).join('.') : null;
		return (path) ? path.substring(0, path.lastIndexOf('.html')) : null;
	},

	/**
	*	Build a object structure from a String path (dot notation) and assign the content of tpl
	*	to the last object in the namespace chain
	*	@public
	*	@method namespace
	*	@param path {String} path in dot notation format
	*	@param tpl {String} template buffer to be assigned
	*	@return Object
	**/
	namespace: function(output, path, tpl) {
		var parts = path.split('.'), parent = output;
		for (var i = 0, pl = parts.length; i < pl; i++) {
			if (typeof parent[parts[i]] == 'undefined') parent[parts[i]] = {};
			if(i == (pl-1)) parent[parts[i]] = tpl;
			parent = parent[parts[i]];
		}
		return parent;
	},

	/**
	*	Process
	*	@public
	*	@method setup
	*	@param opts {Object} options
	**/
	process: function() {
		var files = Utils.findFiles(this.src + '/**/*.html', {});
		if(files.length === 0) Logger.warn('[HTML-BUILD] No HTML template files found. Skipping...', { nl: true });
		_.each(files, function(f, n) {
			var ns = this.getNamespace(f), input = fs.readFileSync(f, 'utf8');
			if(ns) this.namespace(this.output[this.name], ns, input);
		}, this);
		return this.export();
	},

	/**
	*	Export HTML Templates into the target folder
	*	@public
	*	@method export
	*	@return HTML
	**/
	export: function() {
		if(!_.isEmpty(this.output[this.name])) {
			Logger.debug('[HTML-BUILD] Exporting Template [' + this.name + '] from [' + this.src + '] to [' + this.target + ']', { nl: true });
			var out = _.template(this.exportTpl, { tpls: JSON.stringify(this.output, null, '\t') });
			Utils.createDir(this.target, 'templates');
			Utils.createFile(resolve(this.target, 'templates', (this.name + '.js')), out);
		}
		return this;
	}

};

module.exports = HTML;
