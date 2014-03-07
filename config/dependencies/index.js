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

var Dependencies = {
	
	/**
	*	Dependencies
	**/
	dependencies: [],
	
	/**
	*	Build Final RequireJS Config and export it into the lib folder.
	**/
	run: function(cfg, callback) {
		async.map([cfg.libraries], _.bind(this.checkLibrariesNotInstalled, this), _.bind(function(err, checked) {
			var r = _.flatten(checked[0].toInstall);
			if(_.some(r)) {
				Utils.log(('[DEPENDENCIES] Found ' + r.length + ' library/es not installed.').yellow);
				async.map(r, _.bind(this.installLibrary, this, cfg.libraries.root), _.bind(function(err, results) { callback(checked[0].libs); }, this));
			} else {
				Utils.log('[DEPENDENCIES] Everything Installed!'.cyan);
				callback(checked[0].libs);
			}
		}, this));
	},
	
	/**
	*	Check Which Libraries are not Installed
	**/
	checkLibrariesNotInstalled: function(libraries, cb) {
		Utils.log('[DEPENDENCIES] Checking Installed Libraries...'.green);
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
		console.log(('[DEPENDENCIES] Installing Library [' + qlibrary + ' into "' + where + '"]...').green);
		try {
			bower.config.directory = where;
			bower.commands.install([qlibrary], {}).on('end', function(libs) { cb(null, libs); });
		} catch(ex) {
			Utils.log('[DEPENDENCIES] Error ocurred while installing Dependency [' + qlibrary + ']'.red);
		}
	}
	
};

module.exports = Dependencies;