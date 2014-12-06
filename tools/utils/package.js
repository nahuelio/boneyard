/**
*	Package Tool to generate JSON structure suitable to be pass to the requirejs config (Default/Custom).
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var fs = require('fs'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join,
	_ = require('underscore'),
	_s = require('underscore.string'),
	Utils = require('./util');

/**
*	Package namespace
**/
var Package = {

	/**
	*	Prefix package name
	*	@public
	*	@property prefix
	*	@type String
	**/
	prefix: 'spinal-',

	/**
	*	Base Path to perform package lookup
	*	@public
	*	@property basePath
	*	@type String
	**/
	basePath: null,

	/**
	*	Default paths object declaration
	*	@public
	*	@property paths
	*	@type Object
	**/
	paths: null,

	/**
	*	Output bundles structure
	*	@public
	*	@property output
	*	@type Object
	**/
	output: {},

	/**
	*	Creates Paths JSON structure for requirejs
	*	@public
	*	@method build
	*	@return Object
	**/
	paths: function(opts) {
		this._parse(opts);
		_.each(this.paths, this.add, this);
		return this.output;
	},

	/**
	*	Creates Bundle JSON structure for requirejs
	*	@public
	*	@method bundles
	*	@return Object
	**/
	bundles: function(opts) {
		this._parse(opts);
		_.each(this.paths, this.add, this);
		return this.output;
	},

	/**
	*	Parse and returns a JSON structure with the bundles entries suitable for requirejs.
	*	@private
	*	@method _parse
	*	@param paths {Object} optional parameters
	*	@return Object
	**/
	_parse: function(opts) {
		opts || (opts = {});
		if(!opts.paths) throw new Error('Parameter \'paths\' is required.');
		if(!opts.path) throw new Error('Parameter \'path\' is required.');
		this.paths = opts.paths;
		this.basePath = opts.path;
		this.output = {};
	},

	/**
	*	Returns an array of paths that point to javascript modules files inside package folder passed as parameter
	*	@public
	*	@method walk
	*	@param pkgId {String} package id
	*	@param pkgPath {String} package folder
	*	@return Array
	**/
	walk: function(pkgId, pkgPath) {
		var path = resolve(this.basePath, pkgPath);
		var paths = Utils.findFiles(path + '/**/*.js', {});
		return this.format(paths, pkgId);
	},

	/**
	*	Format paths suitable for requirejs bundles configuration
	*	This will exclude the absolute path gathered from 'walk' on every path file and his extension.
	*	@public
	*	@method format
	*	@param paths {Array} original paths array
	*	@return Array
	**/
	format: function(paths, id) {
		return _.map(paths, function(p) {
			var subpath = (id + '/');
			return subpath + _s.strLeft(_s.strRight(p, subpath), '.js');
		}, this);
	},

	/**
	*	Add a new bundle
	*	@public
	*	@method add
	*	@param path {String} path to package
	*	@param id {String} package module id
	*	@return Object
	**/
	add: function(path, id) {
		if(this.find(id)) return;
		var key = (id === 'libs') ? id : (this.prefix + id);
		this.output[key] = this.walk(id, path);
	},

	/**
	*	Remove existing bundle
	*	@public
	*	@method remove
	*	@param id {String} bundle id
	*	@return Object
	**/
	remove: function(id) {
		if(!this.find(id)) return;
		for(var mId in this.output) {
			if(mId === id) { delete this.output[id]; break; }
		}
	},

	/**
	*	Find existing bundle by id, otherwise returns null
	*	@public
	*	@method find
	*	@param id {String} bundle id
	*	@return Object
	**/
	find: function(id) {
		return _.find(this.output, function(mId, path) { return (mId === id); });
	}

};

module.exports = Package;
