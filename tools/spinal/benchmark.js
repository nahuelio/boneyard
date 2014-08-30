/**
*  Spinal Build Process
*  @author Patricio Ferreira <3dimentionar@gmail.com>
*   FIXME: Need to refactor!!
**/

var fs = require('fs'),
    path = require('path'),
	resolve = path.resolve,
	join = path.join,
	_ = require('underscore'),
	_s = require('underscore.string'),
	colors = require('colors');

var Benchmark = {

	/**
	*	Build Benchmark tool based on modules available.
	**/
	exec: function() {
		Utils.log('[BUILD-Benchmark] Generating Benchmark tool for SpinalJS Framework'.green);
		var htmltpl = fs.readFileSync(resolve(__dirname, '../benchmark/templates/template.html'), 'utf8');
		var filename = resolve(__dirname, '../benchmark/spinal-' + pkg.version + '-benchmark.html');
		fs.writeFileSync(filename, _.template(htmltpl, { version: pkg.version, modules: this.parse() }), { mode: 0777, encoding: 'utf8', flags: 'w' });
	},

	/**
	*	Parse Modules
	**/
	parse: function() {
		return _.compact(_.map(fs.readdirSync(resolve(__dirname, '../src/com/spinal')), function(fd) {
			var st = fs.statSync(resolve(__dirname, '../src/com/spinal/' + fd));
			if(st && st.isDirectory()) return { name: fd };
		}, this));
	}

};

module.exports = Benchmark;
