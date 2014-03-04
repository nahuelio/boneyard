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
	
	/**
	*	RequireJS Config Template Path
	**/
	rcTpl: fs.readFileSync(resolve(__dirname, './templates/config.tpl'), 'utf8'),
	
	/**
	*	Build Final RequireJS Config and export it into the lib folder.
	**/
	build: function(cfg) {
		this.libs(cfg.libraries, function(libs) {
			console.log(_.template(this.rcTpl, { mods: this.modules(cfg.source), libs: this.libs(cfg.libraries) }));
			//return this.release(_.template(rcTpl, { mods: this.modules(cfg.src), libs: this.libs(cfg.libs), author: cfg.author }), cfg);
		});
	},
	
	/**
	*	Check Which Libraries are not Installed
	**/
	checkLibrariesNotInstalled: function(libraries, cb) {
		Utils.log('[BUILD-RequireJS] Checking Installed Libraries...'.green);
		var libs = _.map(libraries.libs, function(v, n) { return { n: n, v: v }; });
		bower.config.directory = libraries.root;
		bower.commands.list({}).on('end', function(results) {
			var requireInstall = (!_.isEmpty(results.dependencies)) ? _.filter(libs, function(l) { return !_.contains(_.keys(results.dependencies), l.n); }, this) : libs;
			cb(null, requireInstall);
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
				cb(null, libList);
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
		async.map([libraries], this.checkLibrariesNotInstalled, _.bind(function(err, results) {
			var r = _.flatten(results);
			if(_.some(r)) {
				Utils.log(('[BUILD-RequireJS] Found ' + r.length + ' library/es not installed.').yellow);
				async.mapSeries(r, _.bind(this.installLibrary, this, libraries.root), function(err, results) { callback(r); });
			} else {
				callback(r);
			}
		}, this));
	},
	
	/**
	*	Format Full Libraries list
	**/
	fullLibList: function(libs, deps) {
		return _.map(libs, function(v, n) { return { path: (n + '/' + n), deps: deps }; });
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