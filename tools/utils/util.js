/**
*	Build Utils
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fse = require('fs-extra'),
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
		var p = (dirname) ? resolve(basePath, dirname) : basePath;
		fse.ensureDirSync(p, 0777);
		return p;
	},

	/**
	*	Create a file in the filename specified as parameter with a given content (stream).
	**/
	createFile: function(filename, stream) {
		fse.outputFileSync(filename, stream);
		return filename;
	},

	/**
	*	Copy a file specified in sourceFile parameter into the target folder
	**/
	copyFile: function(sourceFile, targetFile) {
		fse.createReadStream(sourceFile).pipe(fse.createWriteStream(targetFile));
	},

	/**
	*	Extracts the filename form a full filename path
	**/
	getFilename: function(fullFilename, noext) {
		if(!fullFilename || fullFilename === '') return '';
		var fn = fullFilename.substring((fullFilename.lastIndexOf('/') + 1), fullFilename.length);
		if(!noext) return fn;
		return (fn && fn.indexOf('/') === -1) ? fn.substring(0, fn.lastIndexOf('.')): '';
	},

	/**
	*	Filter Files inside a path.
	**/
	filterFiles: function(path, excl, onlyFilename) {
		var files = this.excludePaths(path, fse.readdirSync(path), excl);
		if(files.length == 0) return [];
		return _.flatten(_.compact(_.map(files, function(fd) {
			var p = resolve(path, fd);
			var st = fse.statSync(p);
			return (st && st.isFile()) ? ((onlyFilename) ? fd : p) : this.filterFiles(p, excl, onlyFilename);
		}, this)));
	},

	/**
	* 	Filters files only (no directories) from a list of filepaths
	**/
	noDirs: function(paths) {
		return _.compact(_.map(paths, function(p) {
			var st = fse.statSync(p);
			return (st && st.isFile()) ? p : null;
		}));
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
	}

};

module.exports = Utils;
