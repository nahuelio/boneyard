/**
*  Spinal Build
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
	pkg = require('./package.json'),
	ugf = require('uglify-js'),
	_ = require('underscore');

var Build = {
	
	/**
	*	Build Run
	**/
	run: function() {
		output = this.concat();
		output = this.minify(output);
		console.log(output);
		//this.export(output);
	},
	
	banner: function(filename) {
		var b = '/*** SpinalJS UI Framework (<%= version %>) ***/\n\n';
			b += fs.readFileSync('LICENSE', 'utf8') + '\n';
		return fs.writeSync(filename, _.template(b, { version: pkg.version }), 0);
	},
	
	/**
	*	File Concatenation
	**/
	concat: function() {
		var files = process.argv.slice(2), out = '';
		files.forEach(function(f) { out += fs.readFileSync(f, 'utf8') + '\n'; });
		return out;
	},
	
	/**
	*	Minification Process
	**/
	minify: function(o) {
		return o;
	},
	
	/**
	*	Export framework
	**/
	export: function(o) {
		var filename = pkg.name + '-' + pkg.version + '-SNAPSHOT.js'
		fs.writeSync(filename, o);
		this.banner(filename);
	}
	
};

Build.run();