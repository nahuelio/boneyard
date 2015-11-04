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
	*	AMD template for exporting HTML templates
	*	@public
	*	@property exportTpl
	*	@type String
	**/
	exportTpl: "define(['core/boneyard'], function(Boneyard) { " +
		"return Boneyard.namespace('templates', <%= tpls %>); });",

	/**
	*	Initialize HTML Util
	*	@public
	*	@method init
	*	@param cfg {Object} templates config
	*	@return HTML
	**/
	init: function(cfg) {
		if(!cfg || !_.isObject(cfg) || _.isEmpty(cfg)) return this;
		return this.setup(cfg);
	},

	/**
	*	Validates Template Config params
	*	@public
	*	@method validate
	*	@param tpl {Object} template params
	*	@return Boolean
	**/
	validate: function(tpl) {
		return (tpl.src && tpl.target && tpl.src !== '' && tpl.target !== '');
	},

	/**
	*	Setup Resolved Paths
	*	@public
	*	@method setup
	*	@param cfg {Object} templates Config
	**/
	setup: function(cfg) {
		_.each(cfg, function(tpl, name) {
			if(this.validate(tpl)) {
				var src = resolve(this.basePath, tpl.src), target = resolve(this.basePath, tpl.target), out = {};
				this.process({ out: out, name: name, src: src, target: target });
			}
		}, this);
		return this;
	},

	/**
	*	Get Package namespace Name
	*	@public
	*	@method getPackages
	*	@param cfg {Object} template setup
	*	@param filename {String} full path to filename
	*	@return String
	**/
	getNamespace: function(cfg, filename) {
		var paths = filename.split(cfg.src);
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
	*	@param cfg {Object} template setup
	**/
	process: function(cfg) {
		cfg.out[cfg.name] = {};
		var files = Utils.findFiles(cfg.src + '/**/*.html', {});
		if(files.length === 0) Logger.warn('[HTML-BUILD] No HTML template files found. Skipping...', { nl: true });
		_.each(files, function(f, n) {
			var ns = this.getNamespace(cfg, f), input = fs.readFileSync(f, 'utf8');
			if(ns) this.namespace(cfg.out[cfg.name], ns, input);
		}, this);
		return this.export(cfg);
	},

	/**
	*	Export HTML Templates into the target folder
	*	@public
	*	@method export
	*	@param cfg {Object} template setup
	*	@return HTML
	**/
	export: function(cfg) {
		if(!_.isEmpty(cfg.out[cfg.name])) {
			Logger.debug('[HTML-BUILD] Exporting Template [' + cfg.name + '] from [' + cfg.src + '] to [' + cfg.target + ']', { nl: true });
			var out = _.template(this.exportTpl, { tpls: JSON.stringify(cfg.out, null, '\t') });
			Utils.createDir(cfg.target, 'templates');
			Utils.createFile(resolve(cfg.target, 'templates', (cfg.name + '.js')), out);
		}
		return this;
	}

};

module.exports = HTML;
