/**
*	Spinal Build Tool
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
var fs = require('fs'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join;

// Third-party libs
var	requirejs = require('requirejs'),
	_ = require('underscore'),
	_s = require('underscore.string');

// Project specific libs
var Package = require('../utils/package'),
	Sass = require('../utils/sass'),
	HTML = require('../utils/html'),
	Logger = require('../utils/logger'),
	Utils = require('../utils/util');

// Project Configs
var pkg = require('../../package.json');

// command-line arguments
var args = Array.prototype.slice.call(process.argv, 2);

/**
*	Build namespace
**/
var Build = {

	/**
	*	Base Path
	*	@public
	*	@property basePath
	*	@type String
	**/
	basePath: resolve(__dirname, '../../'),

	/**
	*	Config File Path
	*	@public
	*	@property configPath
	*	@type String
	**/
	configPath: resolve(__dirname, '../default-build-config.json'),

	/**
	*	Config Object
	*	@public
	*	@property config
	*	@type Object
	**/
	config: null,

	/**
	*	Execute Build
	*	@public
	*	@method exec
	**/
	exec: function() {
		this.output(pkg);
		this.loadConfig();
		this.release(_.bind(this._onRelease, this));
	},

	/**
	*	Output Initial Message
	*	@public
	*	@method output
	*	@param pkg {Object} package.json reference
	**/
	output: function(pkg) {
		Logger.log('| ' + _s.capitalize(pkg.name) + ' Build v' + pkg.version + ' |', { nl: true });
	},

	/**
	*	Load Default Config
	*	@public
	*	@method loadDefaultConfig
	*	@return Build
	**/
	loadConfig: function() {
		Logger.debug('[CONFIG] Loading Build Configuration...', { nl: true });
		this.config = require(this.configPath);
		return this;
	},

	/**
	*	Execute Build
	*	@public
	*	@method exec
	**/
	libs: function() {
		Logger.log('[DEPENDENCIES] Installing/Updating Dependencies...', { nl: true });
		this.bowerpkg = require(resolve(this.basePath, './bower.json'));
		var libPath = Utils.createDir(resolve(this.basePath, './src/libs')),
			bowerDepPath = resolve(this.basePath, './bower_components');
		_.each(this.bowerpkg.dependencies, function(version, name) {
			var filename = libPath + '/' + name + '.js',
				files = Utils.findFiles((bowerDepPath + '/**/' + name + '.js'), {});
			if(files.length > 0) {
				var o = fs.readFileSync(files[0], 'utf8');
				Utils.createFile(filename, Utils.minify(o));
			}
			Logger.debug((o) ?
				('[DEPENDENCIES] Installed [' + name + ']') : ('[DEPENDENCIES] Dependency [' + name + '] not found.'));
		}, this);
	},

	/**
	*	Release project packages using requirejs optimizer
	*	@public
	*	@method release
	*	@param [callback] {Function} optional callback
	**/
	release: function(callback) {
		Logger.log('\n[JS-BUILD] Building...');
		try {
			Utils.createDir(resolve(this.basePath, this.config.project.dir));
			this.config.project.mainConfigFile = resolve(this.basePath, this.config.project.mainConfigFile);
			this.config.project.dir = resolve(this.basePath, this.config.project.dir);
			requirejs.optimize(_.extend({}, { onModuleBundleComplete: _.bind(this._bundles, this) },
				this.config.project), _.bind(callback, this), Utils.onError);
		} catch(ex) {
			this._onError('[JS-BUILD] Error ocurred while building modules: ' + ex.message);
		}
	},

	/**
	*	Injects Bundles inside the Spinal Libs Package to
	*	resolve cross-package dependencies in production-ready distribution
	*	@public
	*	@method _bundles
	*	@param data {Object} bundle data
	**/
	_bundles: function(data) {
		if(data.name === 'libs') {
			var paths = _.omit(this.config.project.paths, 'templates'),
				bundles = Package.bundles({ path: resolve(this.basePath, './src'), paths: paths }),
				bundlePath = resolve(this.basePath, this.config.project.dir, data.path),
				file = fs.readFileSync(bundlePath),
				output = _s.insert(file, file.length, Package._tplBundles({ bundles: JSON.stringify(bundles) }));
			fs.writeFileSync(bundlePath, output);
		}
	},

	/**
	*	Release Complete Handler
	*	@private
	*	@method _onRelease
	**/
	_onRelease: function() {
		Logger.debug('[JS-BUILD] DONE', { nl: true });
		process.nextTick(_.bind(function() {
			this.banner();
			HTML.init(this.config.templates);
			Sass.init(this.config.themes);
			Logger.debug('[BUILD] Deployment DONE', { nl: true });
		}, this));
	},

	/**
	*	Banner inclusion
	*	@public
	*	@method banner
	**/
	banner: function() {
		var bannerFile = resolve(__dirname, '../', (this.config.banner) ? this.config.banner : '');
		_.each(this.config.project.modules, function(m) {
			if(m.name !== 'spinal-libs') {
				if(m.name === 'spinal-core') this.versioning(m);
				if(this.config.banner) {
					var data = {
						module: _s.capitalize(_s.strRightBack(m.name, '-')),
						version: pkg.version, year: new Date().getFullYear(), author: pkg.author
					};
					Utils.banner(bannerFile, m._buildPath, data);
				}
			}
		}, this);
	},

	/**
	*	Injects Version into spinal core package
	*	@public
	*	@method versioning
	*	@param {Object} package module
	**/
	versioning: function(module) {
		var mStream = fs.readFileSync(module._buildPath, { encoding: 'utf8'});
		mStream = _.template(mStream, { __VERSION__: pkg.version });
		Utils.createFile(module._buildPath, mStream);
	}

};

// Improve this later
(_.contains(args, '-m') && args.length === 2) ? Build[args[1]]() : Build.exec();

module.exports = Build;
