/**
*  Spinal Build Process
*  @author Patricio Ferreira <3dimentionar@gmail.com>
**/

var fs = require('fs'),
    path = require('path'),
	resolve = path.resolve,
	pkg = require('./package.json'),
	jsp = require("uglify-js").parser,
	pro = require("uglify-js").uglify,
	annotation = require('annotation'),
	_ = require('underscore'),
	_s = require('underscore.string'),
	args = process.argv;

var Build = {
	
	/**
	*	Modules Path
	**/
	modulesPath: resolve(__dirname, './src/com/spinal'),
	
	/**
	*	Src Files
	**/
	srcFiles: fs.readdirSync(resolve(__dirname, 'src')),
	
	/**
	*	RequireJS Config Template Path
	**/
	rcTpl: fs.readFileSync(resolve(__dirname, 'templates/requirejs-config.tpl'), 'utf8'),
	
	/**
	*	Execute command based on parameters
	**/
	exec: function(action, opts) {
		if(action == 'build') this.build(opts);
		if(action == 'benchmark') this.benchmark();
	},
	
	/**
	*	Export and release framework
	**/
	build: function(opts) {
		opts || (opts = {});
		var output = '';
		// Operations
		output = (opts.package) ? this.concat(files) : this.buildFiles(files);
		output = this.minify((opts.minify) ? output : files);
		output = this.banner(output);
		// FIXME
		var filename = resolve(__dirname, './lib/' + pkg.name + '-' + pkg.version + '-SNAPSHOT.js');
		fs.writeFileSync(filename, o, { mode: 0777, encoding: 'utf8', flags: 'w' });
	},
	
	/**
	*	Filter Files inside a module.
	**/
	filterFilesInModule: function(pt, m) {
		var files = fs.readdirSync(resolve(pt, m));
		if(files.length == 0) return [];
		return _.flatten(_.compact(_.map(files, function(fd) {
			var p = resolve(pt, m);
			var st = fs.statSync(p + '/' + fd);
			return (st && st.isFile()) ? (p + '/' + fd) : this.filterFilesInModule(p, fd);
		}, this)));	
	},
	
	/** Export Build functions **/
	
	/**
	*	File Concatenation
	**/
	concat: function(files) {
		var out = '';
		files.forEach(function(f) { out += fs.readFileSync(f, 'utf8') + '\n'; });
		return _.template(out, { version: pkg.version });
	},
	
	/**
	*	Banner Insertion
	**/
	banner: function(o) {
		return _s.insert(o, 0, _.template(pkg.banner, { version: pkg.version, year: new Date().getYear(), author: pkg.author }));
	},
	
	/**
	*	Minification Process
	**/
	minify: function(o) {
		var ast = jsp.parse(o),
			ast = pro.ast_mangle(ast),
			ast = pro.ast_squeeze(ast),
			minified = pro.gen_code(ast);
		return minified;
	},
	
	/***********************/
	/**	Benchmarking Code **/
	/***********************/
	
	/**
	*	Parse Modules
	**/
	parse: function() {
		return _.compact(_.map(this.srcFiles, function(fd) {
			var st = fs.statSync(this.modulesPath, fd);
			if(st && st.isDirectory()) return { name: fd };
		}, this));
	},
	
	/**
	*	Build Benchmark tool based on modules available.
	**/
	benchmark: function() {
		var htmltpl = fs.readFileSync(resolve(__dirname, './benchmark/templates/template.html'), 'utf8');
		var filename = resolve(__dirname, './benchmark/spinal-' + pkg.version + '-benchmark.html');
		fs.writeFileSync(filename, _.template(htmltpl, { version: pkg.version, modules: this.parse() }), { mode: 0777, encoding: 'utf8', flags: 'w' });
	}
	
};

module.exports = Build;