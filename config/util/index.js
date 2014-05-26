/**
*	Build Utils
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join,
	glob = require('glob'),
	_ = require('underscore'),
	_s = require('underscore.string');

var Utils = {

	/**
	*	Verbosity activated
	**/
	verbose: false,

	/**
	*	Create Directory in the BasePath specified as parameter.
	**/
	createDir: function(basePath, dirname) {
		var p = resolve(basePath, dirname);
		if(!fs.existsSync(p)) fs.mkdirSync(p, 0777);
		return p;
	},

	/**
	*	Create a file in the filename specified as parameter with a given content (stream).
	**/
	createFile: function(filename, stream, opts) {
		fs.writeFileSync(filename, stream, opts);
		return filename;
	},

	/**
	*	Filter Files inside a path.
	**/
	filterFiles: function(path, excl, onlyFilename) {
		var files = this.excludePaths(path, fs.readdirSync(path), excl);
		if(files.length == 0) return [];
		return _.flatten(_.compact(_.map(files, function(fd) {
			var p = resolve(path, fd);
			var st = fs.statSync(p);
			return (st && st.isFile()) ? ((onlyFilename) ? fd : p) : this.filterFiles(p, excl, onlyFilename);
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

	/**
	*	Look up file/s using the matching pattern.
	**/
	findFiles: function(pattern, opts) {
		return glob.sync(pattern, opts);
	},

	/**
	*	Log messages into the console.stdout
	**/
	log: function(message) {
		if(!this.verbose) console.log(message);
	}

};

module.exports = Utils;
