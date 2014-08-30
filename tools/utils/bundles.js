/**
*	Bundle Tool to generate JSON structure suitable to be pass to the requirejs config (Default/Custom).
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var fs = require('fs'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join,
	_ = require('underscore'),
	_s = require('underscore.string');

/**
	Output:

	"bundles": {
		"libs": ["libs"],
		"spinal-core": ["core/spinal"],
		"spinal-aop": ["spinal-aop"],
		"spinal-ioc": ["spinal-ioc"],
		"spinal-mvc": ["spinal-mvc"],
		"spinal-ui": ["spinal-ui"],
		"spinal-util": ["spinal-util"]
	},
**/

var Bundle = {

	/**
	*	Default source path
	*	@public
	*	@property source
	*	@type String
	**/
	source: null,

	/**
	*	Parse and returns a JSON structure with the bundles entries suitable for requirejs.
	*	@public
	*	@method create
	*	@param opts {Object} optional parameters
	*	@return Object
	**/
	create: function(opts) {
		opts || (opts = {});
		if(!opts.source) throw new Error('Source parameter should be specified.');
		this.source = opts.source;
		return this.build();
	},

	/**
	*	Build JSON structure
	*	@public
	*	@method build
	*	@return Object
	**/
	build: function() {
		return {};
	},

	/**
	*	Add a new bundle
	*	@public
	*	@method add
	*	@param id {String} bundle id
	*	@param modules {Array} array of modules ids/paths
	*	@return Object
	**/
	add: function(id, modules) {
		return {};
	},

	/**
	*	Remove existing bundle
	*	@public
	*	@method remove
	*	@param id {String} bundle id
	*	@return Object
	**/
	remove: function(id) {
		return {};
	},

	/**
	*	Find existing bundle by id, otherwise returns null
	*	@public
	*	@method find
	*	@param id {String} bundle id
	*	@return Object
	**/
	find: function(id) {
		return {};
	}

};

module.exports = Bundle;
