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
	*	Initialize HTML Util
	*	@public
	*	@method init
	*	@param cfg {Object} Themes Config
	*	@return Sass
	**/
	init: function(cfg) {
		if(!cfg || !_.isObject(cfg) || _.isEmpty(cfg)) return this;
		return this.setup(cfg);
	},

	/**
	*	Validates Theme Config params
	*	@public
	*	@method validate
	*	@param theme {Object} theme params
	*	@return Boolean
	**/
	validate: function(theme) {
		return (theme.src && theme.target && theme.src !== '' && theme.target !== '');
	},

	/**
	*	Setup Resolved Paths
	*	@public
	*	@method setup
	*	@param opts {Object} options
	**/
	setup: function(cfg) {
		_.each(cfg, function(theme, name) {
			if(this.validate(theme)) {
				var src = resolve(this.basePath, theme.src), target = resolve(this.basePath, theme.target);
				this.process({ name: name, src: src, target: target });
			}
		}, this);
		return this;
	},

	/**
	*	Process
	*	@public
	*	@method setup
	*	@param cfg {Object} theme setup
	**/
	process: function(cfg) {
		var files = Utils.noDirs(Utils.findFiles(resolve(this.basePath, cfg.src) + '/**/!(*.js)', {}));
		if(files.length > 0) {
			var targetPath = Utils.createDir(resolve(this.basePath, cfg.target), ('themes/' + cfg.name));
			_.each(files, function(f, name) { this.export(cfg, f, targetPath); }, this);
			Logger.debug('[THEMES-BUILD] Exporting Template [' + cfg.name + '] from [' + cfg.src + '] to [' + cfg.target + ']', { nl: true });
		}
		return this;
	},

	/**
	*	Export files
	*	@public
	*	@method export
	*	@param cfg {Object} theme setup
	*	@param file {String} input file path
	*	@param targetPath {Object} target path
	**/
	export: function(cfg, file, targetPath) {
		var filePath = (file.indexOf(cfg.src) !== -1) ?
			file.substring((cfg.src.length + 1), file.length) : Utils.getFilename(file),
			output = resolve(targetPath, filePath);
		Utils.createFile(output, fs.readFileSync(file, 'utf8'));
	}

};

module.exports = Sass;
