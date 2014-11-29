/**
*	Build Sass Utils
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	Important Note:
*		General purpose of this module was to integrate lib-sass to allow compilation of built-in themes
*		provided by this framework as well as a setup to allow developers to build their own themes or css bundles based
*		on bootstrap. In our next release, we will be offering this feature, so this module will be executing node-sass.
*		For now, this module will only copy the assets from bootstrap (css and fonts) into the target directory.
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
			throw new Error('[THEMES-BUILD] Build Themes util requires a \'src\' and \'target\' parameters in order to work');
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
		var files = Utils.noDirs(Utils.findFiles(resolve(this.basePath, this.src) + '/**/!(*.js)', {}));
		if(files.length > 0) {
			var targetPath = Utils.createDir(resolve(this.basePath, this.target), ('themes/' + this.name));
			_.each(files, function(f, name) { this.export(f, targetPath); }, this);
			Logger.debug('[THEMES-BUILD] Exporting Template [' + this.name + '] from [' + this.src + '] to [' + this.target + ']', { nl: true });
		}
		return this;
	},

	/**
	*	Export files
	**/
	export: function(file, targetPath) {
		var filePath = (file.indexOf(this.src) !== -1) ?
			file.substring((this.src.length + 1), file.length) : Utils.getFilename(file),
			output = resolve(targetPath, filePath);
		Utils.createFile(output, fs.readFileSync(file, 'utf8'));
	}

};

module.exports = Sass;
