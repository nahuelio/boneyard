/**
*	Build Utils
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fse = require('fs-extra'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join,
	glob = require('glob'),
	jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify,
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
	createFile: function(filename, stream, encoding) {
		var enc = (encoding) ? encoding : 'utf8';
		fse.outputFileSync(filename, stream, enc);
		return filename;
	},

	/**
	*	Copy a file specified in sourceFile parameter into the target folder
	**/
	copyFile: function(sourceFile, targetFile) {
		fse.copySync(sourceFile, targetFile);
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
	},

	/**
	*	Minifies Stream
	*	@public
	*	@method exec
	*	@param stream {String} input string to be minified
	*	@return String
	**/
	minify: function(stream) {
		var ast = jsp.parse(stream),
		ast = pro.ast_mangle(ast),
		ast = pro.ast_squeeze(ast),
		minified = pro.gen_code(ast);
		return minified;
	},

	/**
	*	Inject a banner into a File by specified the file in which the contents will be retrieved
	*	@public
	*	@method banner
	*	@param bannerFile {String} banner file path
	*	@param targetFile {String} File in which the banner content will be injected
	*	@param [data] {Object} optional data to pass to the banner template
	**/
	banner: function(bannerFile, targetFile, data) {
		var banner = fse.readFileSync(bannerFile, { encoding: 'utf8'});
		var stream = fse.readFileSync(targetFile, 'utf8');
		stream = _s.insert(stream, 0, (data) ? _.template(banner, data) : banner);
		this.createFile(targetFile, stream);
	},

	/**
	*	Error Handler
	*	@private
	*	@method _onError
	*	@param err {String} Error message
	**/
	onError: function(err) {
		console.error(err);
		process.exit();
	}

};

module.exports = Utils;
