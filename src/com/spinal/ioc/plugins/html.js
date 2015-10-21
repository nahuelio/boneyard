/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.1.0
**/
define(['ioc/plugins/plugin',
	'ioc/engine/engine',
	'util/adt/collection',
	'util/object'], function(IoCPlugin, Engine, Collection, ObjectUtil) {

	/**
	*	Class HTMLPlugin
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.HTMLPlugin
	*	@extends com.spinal.ioc.plugins.IoCPlugin
	*
	*	@requires com.spinal.ioc.plugins.IoCPlugin
	*	@requires com.spinal.util.adt.Collection
	*	@requires com.spinal.util.ObjectUtil
	**/
	var HTMLPlugin = Spinal.namespace('com.spinal.ioc.plugins.HTMLPlugin', IoCPlugin.inherit({

		/**
		*	HTML packages Collection
		*	@public
		*	@property packages
		*	@type com.spinal.util.adt.Collection
		**/
		packages: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.plugins.HTMLPlugin
		**/
		initialize: function() {
			this.packages = new Collection();
			return HTMLPlugin.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Parse Metadata Strategy handler
		*	@public
		*	@override
		*	@method parse
		*	@param attrs {Object} plugin attributes
		*	@return com.spinal.ioc.plugins.HTMLPlugin
		**/
		parse: function(attrs) {
			this.packages.set(ObjectUtil.objToArr(attrs), { silent: true });
			return HTMLPlugin.__super__.parse.apply(this, arguments);
		},

		/**
		*	Validates list paths to decide whether, it's suitable to be enqueued or not.
		*	Rules:
		*		- Paths needs to be defined, be an array and all the elements must not be null or undefined.
		*		- Paths should match packages registered on the Spec.
		*		- Paths packages have not been loaded and registered before.
		*	@public
		*	@method validate
		*	@param packages {Array} list of packages
		*	@return Boolean
		**/
		validate: function(paths) {
			if(!_.defined(paths) || !_.isArray(paths) || !_.every(paths)) return false;
			return _.every(paths, function(path) {
				return (_.defined(this.packages.findWhere({ path: path })) &&
					!this.getFactory().isRegistered(this.getConfig().basePath + path));
			}, this);
		},

		/**
		*	Retrieves Packages marked as for lazy loading.
		*	Packages will be loaded automatically when plugin runs first time.
		*	@public
		*	@method getLazyPackages
		*	@return Array
		**/
		getLazyPackages: function() {
			return this.packages.filter(function(package) {
				return (_.defined(package.lazyload) && package.lazyload);
			});
		},

		/**
		*	Retrieves Package full path to the package module
		*	@public
		*	@method getPackageFullPath
		*	@param package {Object} package reference
		*	@return String
		**/
		getPackageFullPath: function(package) {
			return this.getConfig().basePath + package.path;
		},

		/**
		*	Parses and build package metadata information given a path for factory enqueuing
		*	@public
		*	@method parsePath
		*	@param path {Object} package path
		*	@return Object
		**/
		parsePath: function(path) {
			var package = this.packages.findWhere({ path: path });
			return { path: this.getPackageFullPath(path), callback: _.bind(this.onLoad, this, package) };
		},

		/**
		*	Loads lazy load on packages flagged to be loaded once the plugin runs.
		*	@public
		*	@method lazy
		*	@return com.spinal.ioc.plugins.HTMLPlugin
		**/
		lazy: function() {
			return this.load(_.pluck(this.getLazyPackages(), 'path'));
		},

		/**
		*	Load templates using require strategy
		*	@public
		*	@method load
		*	@param [paths] {Array} array of packages to load
		*	@param [callback] optional callback
		*	@return com.spinal.io.plugins.HTMLPlugin
		**/
		load: function(paths, callback) {
			if(!this.validate(paths)) return this;
			this.getFactory().set(_.map(paths, this.parsePath)).load(_.bind(this.onLoadComplete, this, callback));
			return this;
		},

		/**
		*	Default individual package load handler
		*	@public
		*	@method onLoad
		*	@param package {Object} package reference
		*	@param fullpath {String} loaded package fullpath from factory
		*	@param content {Object} content loaded
		*	@return com.spinal.ioc.plugins.HTMLPlugin
		**/
		onLoad: function(package, fullpath, content) {
			var ns = package.path.replace('/', '.');
			return Spinal.namespace('html.' + ns, this.resolve(content));
		},

		/**
		*	Default Content resolve strategy will evaluate content type to be registered accordingly.
		*	@public
		*	@method resolve
		*	@param content {Object} content loaded
		*	@return Object
		**/
		resolve: function(content) {
			// TODO: Figure out template pre-compilation content
		},

		/**
		*	Default Load Complete Handler
		*	@public
		*	@method onLoad
		*	@param [callback] {Function} optional callback
		*	@return com.spinal.ioc.plugins.HTMLPlugin
		**/
		onLoadComplete: function(callback) {
			var packages = _.toArray(arguments).slice(1);
			if(callback && _.isFunction(callback)) callback(packages);
			this.getEngine().trigger(Engine.EVENTS.pluginAction, HTMLPlugin.EVENTS.load, packages);
			return this;
		},

		/**
		*	Query the list of packages using a query (dot notation) to get the template.
		*	@public
		*	@method query
		*	@param query {String} query in dot notation
		*	@param params {Object} optional parameters to pass to the template
		*	@return String
		**/
		query: function(query, params) {
			if(!query || query === '') return '';
			return ObjectUtil.search(query, Spinal.html);
		},

		/**
		*	Proxified Template function that performs a look up over all the template packages
		*	using the route passed as parameter (in dot notation format) and pass the additional params
		*	to the existing compiled template function. If the template function is not found
		*	returns an empty string
		*	@public
		*	@method html
		*	@param route {String} route using dot notation format to the template
		*	@param [params] {Object} optional parameters to pass to the template
		*	@return String
		**/
		html: function(route, params) {
			params || (params = {});
			return this.query(route, params).replace(/\n+/g, '').replace(/\t+/g, '');
		},

		/**
		*	Plugin main exection handler
		*	@public
		*	@chainable
		*	@method execute
		*	@return com.spinal.ioc.plugins.HTMLPlugin
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
			load: 'com:spinal:ioc:engine:plugin:html:load'
		}

	}));

	// Generic HTML Template
	Spinal.namespace('html.tag', ('<<%= obj.tagName %>' +
		'<%= (obj.id) ? " id=\\"" + obj.id + "\\"" : "" %>' +
		'<%= (obj.cls) ? " class=\\"" + obj.cls + "\\"" : "" %>' +
		'<% if(obj.attrs) { for(var p in obj.attrs) { %>' +
		'<%= (" " + p + "=\\"" + obj.attrs[p] + "\\"") %><% } } %>>' +
		'<%= (obj.content) ? obj.content : "" %>' +
		'</<%= obj.tagName %>>'));

	return HTMLPlugin;

});
