/**
*  Spinal Build
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
	pkg = require('./package.json'),
	jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify,
	_ = require('underscore'),
	_s = require('underscore.string'),
	modDeps = require('./src/dependencies.json'),
	cmdParams = process.argv.slice(2);

var Build = {
	
	/**
	*	Modules Path
	**/
	modulesPath: './src/com/spinal',
	
	/**
	*	Execute command based on parameters
	**/
	exec: function() {
		var action = cmdParams[0];
		if(action == 'all') this.buildAll();
		if(action == 'selective') this.buildSelective();
		if(action == 'benchmark') this.benchmark();
	},
	
	/**
	*	Build All
	*	Note: Automatically builds benchmark
	**/
	buildAll: function() {
		var allFiles = _.uniq(_.flatten(_.map(modDeps, function(p, m) {
			var files = this.filterFilesInModule(m);
			return this.sortByDependencies(m, files);
		}, this)));
		var output = this.concat(allFiles),
			output = this.minify(output);
		this.export(output);
		this.benchmark();
	},
	
	/**
	*	Build specific modules.
	**/
	buildSelective: function() {
		var modules = cmdParams.slice(1);
		var allFiles = _.flatten(_.map(modules, function(m) {
			var files = this.filterFilesInModule(m);
			return this.sortByDependencies(m, files);
		}, this));
		allFiles.unshift(path.resolve(this.modulesPath, 'core/core.js')); // include core
		var output = this.concat(allFiles);
			output = this.minify(output);
		this.export(output, true);
	},
	
	filterFilesInModule: function(m) {
		return _.compact(_.map(fs.readdirSync(path.resolve(this.modulesPath, m)), function(fd) {
			var p = path.resolve(this.modulesPath, m + '/' + fd);
			var st = fs.statSync(p);
			if(st && st.isFile()) return p;
		}, this));	
	},
	
	/**
	*	Sort by Dependency
	**/
	sortByDependencies: function(m, files) {
		var deps = modDeps[m];
		return _.sortBy(files, function(f) {
			return (_.find(deps, function(d) { return (f.indexOf(d) != -1); }, this)) ? -1 : 1;
		}, this);
	},
	
	banner: function(o) {
		var b = '//     Spinal.js <%= version %>\n\n';
		b += '//     (c) 2014 Patricio Ferreira, 3dimention.com\n' +
			'//     SpinalJS may be freely distributed under the MIT license.\n' +
			'//     For all details and documentation:\n' +
			'//     http://3dimention.github.io/spinal\n\n';
		return _s.insert(o, 0, _.template(b, { version: pkg.version }));
	},
	
	/**
	*	File Concatenation
	**/
	concat: function(files) {
		var out = '';
		files.forEach(function(f) { out += fs.readFileSync(f, 'utf8') + '\n'; });
		return _.template(out, { version: pkg.version });
	},
	
	/**
	*	Minification Process
	**/
	minify: function(o) {
		var ast = jsp.parse(o),
			ast = pro.ast_mangle(ast),
			ast = pro.ast_squeeze(ast),
			minified = pro.gen_code(ast);
		return this.banner(minified);
	},
	
	/**
	*	Export framework
	**/
	export: function(o, custom) {
		var filename = './lib/' + pkg.name + '-' + pkg.version + ((custom) ? '-custom' : '');
		filename += '-SNAPSHOT.js';
		fs.writeFileSync(filename, o, { mode: 0777, encoding: 'utf8', flags: 'w' });
	},
	
	/**
	*	Parse Modules
	**/
	parse: function() {
		return _.compact(_.map(fs.readdirSync(this.modulesPath), function(fd) {
			var st = fs.statSync(path.resolve(this.modulesPath, fd));
			if(st && st.isDirectory()) return { name: fd };
		}, this));
	},
	
	/**
	*	Build Benchmark tool based on modules available.
	**/
	benchmark: function() {
		var htmltpl = fs.readFileSync('./benchmark/templates/template.html', 'utf8');
		var filename = './benchmark/spinal-' + pkg.version + '-benchmark.html';
		fs.writeFileSync(filename, _.template(htmltpl, { version: pkg.version, modules: this.parse() }), { mode: 0777, encoding: 'utf8', flags: 'w' });
	}
	
};

Build.exec();