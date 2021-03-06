/**
*	@module com.boneyard.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.1.0
**/
define(['ioc/plugins/plugin',
	'ioc/engine/engine',
	'util/adt/collection',
	'util/object'], function(IoCPlugin, Engine, Collection, ObjectUtil) {

	/**
	*	Class HTMLPlugin
	*	@namespace com.boneyard.ioc.plugins
	*	@class com.boneyard.ioc.plugins.HTMLPlugin
	*	@extends com.boneyard.ioc.plugins.IoCPlugin
	*
	*	@requires com.boneyard.ioc.plugins.IoCPlugin
	*	@requires com.boneyard.util.adt.Collection
	*	@requires com.boneyard.util.ObjectUtil
	**/
	var HTMLPlugin = Boneyard.namespace('com.boneyard.ioc.plugins.HTMLPlugin', IoCPlugin.inherit({

		/**
		*	HTML packages Collection
		*	@public
		*	@property packages
		*	@type com.boneyard.util.adt.Collection
		**/
		packages: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.boneyard.ioc.plugins.HTMLPlugin
		**/
		initialize: function() {
			this.packages = new Collection();
			return HTMLPlugin.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Parse Metadata Strategy handler
		*	@public
		*	@override
		*	@chainable
		*	@method parse
		*	@param attrs {Object} plugin attributes
		*	@return com.boneyard.ioc.plugins.HTMLPlugin
		**/
		parse: function(attrs) {
			this.packages.set(_.map(attrs, function(package, name) {
				return _.extend(package, { name: name });
			}), { silent: true });
			return HTMLPlugin.__super__.parse.apply(this, arguments);
		},

		/**
		*	Validates list of package names to decide whether, it's suitable to be enqueued or not.
		*	Rules:
		*		- Packages needs to be defined, be an array and all the elements must not be null or undefined.
		*		- Packages should match packages names registered on the Spec.
		*		- Packages that have not been loaded and registered before.
		*	@public
		*	@method validate
		*	@param packageNames {Array} list of package names
		*	@return Boolean
		**/
		validate: function(packageNames) {
			if(!_.defined(packageNames) || !_.isArray(packageNames) ||
				(packageNames.length === 0) || !_.every(packageNames)) return false;
			var out = _.every(packageNames, function(name) {
				var package = this.getPackage(name);
				if(!_.defined(package)) return false;
				if(this.isRegistered(package)) return false;
				return true;
			}, this);
			return out;
		},

		/**
		*	Returns true if package exists given a package name, otherwise returns false
		*	@public
		*	@method getPackage
		*	@param name {String} package name
		*	@return Boolean
		**/
		getPackage: function(name) {
			return this.packages.find(function(package) { return (package.name === name); }, this);
		},

		/**
		*	Returns true if package is registered already given a package, otherwise returns false
		*	@public
		*	@method isRegistered
		*	@param package {String} package reference
		*	@return Boolean
		**/
		isRegistered: function(package) {
			return this.getFactory().isRegistered(this.getPackageFullPath(package));
		},

		/**
		*	Retrieves Packages marked as for lazy loading.
		*	Packages will be loaded automatically when plugin runs first time.
		*	@public
		*	@method getLazyPackages
		*	@return Array
		**/
		getLazyPackages: function() {
			return _.compact(this.packages.map(function(package) { return package.lazyload ? package.name : null; }));
		},

		/**
		*	Retrieves Package full path to the package module
		*	@public
		*	@method getPackageFullPath
		*	@param package {Object} package reference
		*	@return String
		**/
		getPackageFullPath: function(package) {
			return this.resolveURI(package.path);
		},

		/**
		*	Parses and build package metadata information given a package name for factory enqueuing
		*	@public
		*	@method parsePackage
		*	@param name {Object} package name
		*	@return Object
		**/
		parsePackage: function(name) {
			var package = this.getPackage(name);
			return { path: this.getPackageFullPath(package), callback: _.bind(this.onLoad, this, package) };
		},

		/**
		*	Loads lazy load on packages flagged to be loaded once the plugin runs.
		*	@public
		*	@chainable
		*	@method lazy
		*	@return com.boneyard.ioc.plugins.HTMLPlugin
		**/
		lazy: function() {
			var lazyPackages = this.getLazyPackages();
			return (lazyPackages.length > 0) ? this.load(lazyPackages, _.bind(this.done, this)) : this.done();
		},

		/**
		*	Load templates using require strategy
		*	@public
		*	@chainable
		*	@method load
		*	@param [packageNames] {Array} array of package names to load
		*	@param [callback] {Function} optional callback
		*	@return com.boneyard.io.plugins.HTMLPlugin
		**/
		load: function(packageNames, callback) {
			if(!this.validate(packageNames)) return this;
			this.getFactory().set(_.map(packageNames, this.parsePackage, this));
			this.getFactory().load(_.bind(this.onLoadComplete, this, callback, packageNames));
			return this;
		},

		/**
		*	Default individual package load handler
		*	@public
		*	@method onLoad
		*	@param package {Object} package reference
		*	@param fullpath {String} loaded package fullpath from factory
		*	@param content {Object} content loaded
		*	@return com.boneyard.ioc.plugins.HTMLPlugin
		**/
		onLoad: function(package, fullpath, content) {
			Boneyard.namespace('__html__.' + package.name, JSON.parse(content));
			return this;
		},

		/**
		*	Default Load Complete Handler
		*	@public
		*	@method onLoad
		*	@param [callback] {Function} optional callback
		*	@return com.boneyard.ioc.plugins.HTMLPlugin
		**/
		onLoadComplete: function(callback, packages) {
			this.getEngine().trigger(Engine.EVENTS.plugin, HTMLPlugin.EVENTS.load, packages);
			if(callback && _.isFunction(callback)) callback(packages);
			return this;
		},

		/**
		*	Query the list of packages using a query (dot notation) to get the template.
		*	@public
		*	@method query
		*	@param query {String} query in dot notation
		*	@return String
		**/
		query: function(query) {
			if(!query || query === '') return null;
			return ObjectUtil.search(query, Boneyard.__html__);
		},

		/**
		*	Performs a look up over all the template packages by using a given query (in dot notation format)
		*	and returns the result of projecting optional parameters into the template found.
		*	If the template is not found, this method will returns an empty string.
		*	@public
		*	@method html
		*	@param query {String} query using dot notation format for template look up
		*	@param [params] {Object} optional parameters to pass to the template
		*	@return String
		**/
		html: function(query, params) {
			params || (params = {});
			if(!(tpl = this.query(query))) return '';
			return _.template(tpl)(params).replace(/\n+/g, '').replace(/\t+/g, '');
		},

		/**
		*	Plugin main exection handler
		*	@public
		*	@chainable
		*	@method run
		*	@return com.boneyard.ioc.plugins.HTMLPlugin
		**/
		run: function() {
			this.proxifyToCore('load', 'html').lazy();
			return HTMLPlugin.__super__.run.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'HTMLPlugin',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event load
			**/
			load: 'com:boneyard:ioc:engine:plugin:html:load'
		}

	}));

	// Generic HTML Template
	Boneyard.namespace('__html__.tag', ('<<%= obj.tagName %>' +
		'<%= (obj.id) ? " id=\\"" + obj.id + "\\"" : "" %>' +
		'<%= (obj.cls) ? " class=\\"" + obj.cls + "\\"" : "" %>' +
		'<% if(obj.attrs) { for(var p in obj.attrs) { %>' +
		'<%= (" " + p + "=\\"" + obj.attrs[p] + "\\"") %><% } } %>>' +
		'<%= (obj.content) ? obj.content : "" %>' +
		'</<%= obj.tagName %>>'));

	return HTMLPlugin;

});
