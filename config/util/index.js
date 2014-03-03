/**
*	Build Utils
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join,
	_ = require('underscore'),
	_s = require('underscore.string');

var Utils = {
	
	/**
	*	Filter Files inside a path.
	**/
	filterFiles: function(path, excl) {
		var files = this.excludePaths(path, fs.readdirSync(path), excl);
		if(files.length == 0) return [];
		return _.flatten(_.compact(_.map(files, function(fd) {
			var p = resolve(path, fd);
			var st = fs.statSync(p);
			return (st && st.isFile()) ? (p) : this.filterFiles(p, excl);
		}, this)));	
	},
	
	/**
	*	Exclude from the list the exclu array.
	**/
	excludePaths: function(path, list, excl) {
		if(!excl) return list;
		return _.filter(list, function(fd) {
			var p = resolve(path, fd);
			var result = _.compact(_.map(excl, function(e) { return (p.indexOf(e) == -1) ? true : null; }));
			return (result.length > 0);
		});
	},
	
};

module.exports = Utils;