/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['core/spinal',
		'ioc/engine/engine',
		'util/string'], function(Spinal, Engine, StringUtils) {

	/**
	*	HTML IoC Plugin
	*	Initial Implementation to manage templates loaded at runtime.
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.HTMLPlugin
	*	@extends com.spinal.core.Spinal.SpinalClass
	*
	*	@requires com.spianl.ioc.engine.Engine
	*	@requires com.spinal.util.StringUtils
	**/
	var HTMLPlugin = Spinal.namespace('com.spinal.ioc.plugins.HTMLPlugin', Spinal.SpinalClass.inherit({

		/**
		*	Engine reference
		*	@public
		*	@property _engine
		*	@type {com.spinal.ioc.Engine}
		**/
		_engine: null,

		/**
		*	Templates Config
		*	@private
		*	@property _config
		*	@type Object
		**/
		_config: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param config {Object} templates config referece
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		initialize: function(config, engine) {
			this._engine = engine;
			this._config = (!_.isEmpty(config)) ? config : {};
			return HTMLPlugin.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Query the list of packages using a query (dot notation) to get the template.
		*	@private
		*	@method _query
		*	@param query {String} query in dot notation
		*	@return String
		**/
		_query: function(query) {
			return StringUtils.search(query, Spinal.html);
		},

		/**
		*	Perform a lazy loading once the IoC Context is initialized for those template packages
		*	flagged with the 'lazyloading' property set to true and for those that were not loaded.
		*	@private
		*	@method _lazy
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		_lazy: function() {
			return this._load(_.pick(this._config, function(v) { return (v.lazyLoading && !v._loaded); }));
		},

		/**
		*	Load templates using require strategy
		*	@private
		*	@method _load
		*	@param tpls {Array} array of templates
		*	@param [callback] optional callback
		*	@return {com.spinal.io.plugins.HTMLPlugin}
		**/
		_load: function(tpls, callback) {
			require(_.pluck(tpls, 'path'), _.bind(this._onTemplatesLoaded, this, _.values(tpls), callback));
			return this;
		},

		/**
		*	Templates Load Handler
		*	@private
		*	@method _onTemplatesLoaded
		*	@param tpls {Array} list of templates loaded
		*	@param [callback] optional callback
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		_onTemplatesLoaded: function(tpls, callback) {
			_.each(tpls, function(v) { v._loaded = true; });
			this._engine.trigger(Engine.EVENTS.plugin, callback, tpls);
			return this;
		},

		/**
		*	Proxified Checks if a template package is already loaded
		*	@public
		*	@method isTemplateLoaded
		*	@param templatePackageName {String} template package name
		*	@return Boolean
		**/
		isTemplateLoaded: function(pkgName) {
			return (_.has(this._config, pkgName) && this._config[pkgName]._loaded);
		},

		/**
		*	Proxified Load Template module using requirejs strategy to be injected as part of
		*	the current context.
		*	@public
		*	@method loadTemplate
		*	@param pkgName {String} template package name
		*	@param [callback] {Function} callback function
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		loadTemplate: function(pkgName, callback) {
			if(!pkgName || !_.isString(pkgName)) return this;
			var pkg = _.pick(this._config, function(v, k) { return (k === pkgName && !v._loaded) ? v : null; });
			return (pkg) ? this._load(pkg, callback) : this;
		},

		/**
		*	Proxified Template function that performs a look up over all the template packages
		*	using the route passed as parameter (in dot notation format) and pass the additional params
		*	to the existing compiled template function. If the template function is not found
		*	returns an empty string
		*	@public
		*	@method tpl
		*	@param route {String} route using dot notation format
		*	@param [params] {Object} parameters to pass to the template
		*	@return String
		**/
		tpl: function(route, params) {
			params || (params = {});
			if(!route || route === '') return '';
			var tpl = (tpl = this._query(route)) ? (_.isString(tpl)) ? _.template(unescape(tpl)) : tpl : null;
			return ((tpl) ? tpl(params) : '').replace(/\n+/g, '').replace(/\t+/g, '');
		},

		/**
		*	Plugin execution
		*	@public
		*	@chainable
		*	@method execute
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		execute: function() {
			this.proxify(Spinal, 'loadTemplate', 'isTemplateLoaded', 'tpl');
			return this._lazy();
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'HTMLPlugin'

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
