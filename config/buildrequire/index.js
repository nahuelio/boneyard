/**
*	Build RequireJS Configuration
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
	path = require('path'),
	resolve = path.resolve,
	join = path.join,
	async = require('async'),
	bower = require('bower'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	Utils = require('../util');

var RequireJS = {
	
	dependencies: [],
	
	/**
	*	RequireJS Config Template Path
	**/
	rcTpl: fs.readFileSync(resolve(__dirname, './templates/config.tpl'), 'utf8'),
	
	/**
	*	Build Final RequireJS Config and export it into the lib folder.
	**/
	build: function(cfg) {
		this.libs(cfg.libraries, _.bind(function(libs) {
			console.log(_.template(this.rcTpl, { mods: _.flatten(this.modules(cfg.source)), libs: libs, author: cfg.author }));
			//return this.release(_.template(rcTpl, { mods: this.modules(cfg.src), libs: this.libs(cfg.libs), author: cfg.author }), cfg);
		}, this));
	},
	
	/**
	*	Check Which Libraries are not Installed
	**/
	checkLibrariesNotInstalled: function(silent, libraries, cb) {
		if(!silent) Utils.log('[BUILD-RequireJS] Checking Installed Libraries...'.green);
		var libs = _.map(libraries.libs, function(v, n) { return { n: n, v: v }; });
		bower.config.directory = libraries.root;
		bower.commands.list({}).on('end', function(results) {
			var requireInstall = (!_.isEmpty(results.dependencies)) ? _.filter(libs, function(l) { return !_.contains(_.keys(results.dependencies), l.n); }, this) : libs;
			cb(null, { toInstall: requireInstall, libs: results.dependencies });
		});
	},
	
	/**
	*	Install Library dependencies using bower.
	**/
	installLibrary: function(where, l, cb) {
		var qlibrary = l.n + '#' + l.v;
		console.log(('[BUILD-RequireJS] Installing Library [' + qlibrary + ' into "' + where + '"]...').green);
		try {
			bower.config.directory = where;
			bower.commands.install([qlibrary], {}).on('end', function(libs) {
				var libList = [];
				if(!_.isEmpty(libs)) {
					libList = (!_.isEmpty(libs[l.n].dependencies)) ?
						[{ name: l.n, version: l.v, deps: _.map(libs[l.n].dependencies, function(v, p) { return { name: p, version: v }; }) }] :
						[{ name: l.n, version: l.v, deps: [] }];
				}
				cb(null, libs);
			});
		} catch(ex) {
			Utils.log('[BUILD-RequireJS] Error ocurred while installing Dependency [' + qlibrary + ']'.red);
		}
	},
	
	/**
	*	Parse and Build Modules
	**/
	modules: function(source) {
		try {
			var mods = _.compact(_.map(source.modules, function(m) {
				var scpath = _s.strRightBack(m, '/');
				return [{ path: scpath, target: m }]
			}, this));
			return mods;
		} catch(ex) {
			Utils.log('[BUILD-RequireJS] Error proccesing modules'.red);
			return [];
		}
	},
	
	/**
	*	Parse and Build Libs
	**/
	libs: function(libraries, callback) {
		async.map([libraries], _.bind(this.checkLibrariesNotInstalled, this, false), _.bind(function(err, checked) {
			var r = _.flatten(checked[0].toInstall);
			if(_.some(r)) {
				Utils.log(('[BUILD-RequireJS] Found ' + r.length + ' library/es not installed.').yellow);
				async.map(r, _.bind(this.installLibrary, this, libraries.root), _.bind(function(err, results) { 
					async.map([libraries], _.bind(this.checkLibrariesNotInstalled, this, true), _.bind(function(err, checked) {
						callback(this.format(checked[0].libs));
					}, this));
				}, this));
			} else {
				callback(this.format(checked[0].libs));
			}
		}, this));
	},
	
	/**
	*	Format Full Libraries list
	**/
	format: function(lbs) {
		var base = 'lib/';
		 _.each(lbs, function(v) {
			var obj = { path: base + (v.endpoint.name + '/' + v.endpoint.name), deps: [] };
			this.dependencies.push(obj);
			if(!_.isEmpty(v.dependencies)) {
				obj.deps = this.formatDeps(base, v.dependencies);
				this.format(v.dependencies);
			}
		}, this);
		return this.dependencies;
	},
	
	/**
	*	Format Dependencies field
	**/
	formatDeps: function(base, deps) {
		return _.map(_.keys(deps), function(d) { return _s.surround(base + (d + '/' + d), "'"); }, this).join(',');
	},
	
	/**
	*	Release RequireJS Config into the target folder
	**/
	release: function(output, cfg) {
		var dest = (cfg.dest) ? cfg.dest : (cfg.name + '/bin');
		var filename = resolve(__dirname, dest, cfg.name + '-' + cfg.version + '.js');
		fs.writeFileSync(filename, output, { mode: 0777, encoding: 'utf8', flags: 'w' });
		return filename;
	}
	
};

module.exports = RequireJS;