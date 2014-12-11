/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
*	@TODO:
*		- Improve logic here, there are a lot of queries that can be simplfied like,
*		  loops, look ups, make use of util/adt classes and general statements.
*		- Verification if a template package was already loaded in the html_load function.
**/
define(['ioc/engine',
		'util/string'], function(Engine, StringUtils) {

	/**
	*	HTML IoC Plugin
	*	Initial Implementation to manage templates loaded at runtime.
	*	Nothing amazing about the strategy choosen. This will stay as basic as possible for now.
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.HTMLPlugin
	*	@extends com.spinal.core.Spinal.SpinalClass
	*
	*	@requires com.spianl.ioc.Engine
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
		*	Template Packages Config retrieve from spec
		*	@private
		*	@property packages
		*	@type Object
		**/
		_packages: null,

		/**
		*	Templates
		*	@private
		*	@property _tpls
		*	@type Object
		**/
		_tpls: {},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param attrs {Object} attributes
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		initialize: function(attrs, engine) {
			this._engine = engine;
			this._packages = (!_.isEmpty(attrs)) ? attrs : {};
			return this;
		},

		/**
		*	Query the list of packages using a query (dot notation) to get the template
		*	If pkg is passed, will be use to prefix the specific package.
		*	In each case, if doesn't match any results the method returns null
		*	@private
		*	@method _query
		*	@param query {String}
		*	@param core {Boolean} Flag that allow performing lookup on core templates
		*	@return Function
		**/
		_query: function(query, core) {
			return StringUtils.search(query, (core) ? Spinal.templates : this._tpls);
		},

		/**
		*	Perform a lazy loading once the IoC Context is initialized for those template packages
		*	flagged with the 'lazyloading' property set to true.
		*	@private
		*	@method _lazy
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		_lazy: function() {
			var tplNames = _.compact(_.map(this._packages, function(p, n) { return (p.lazyLoading) ? n : null; }));
			return this.html_load(tplNames);
		},

		/**
		*	Proxified Checks if a template package is already loaded
		*	@public
		*	@method html_loaded
		*	@param templatePackageName {String} template package name
		*	@return Boolean
		**/
		html_loaded: function(templatePackageName) {
			return (_.has(this._packages, templatePackageName) && !_.isUndefined(this._tpls[templatePackageName]));
		},

		/**
		*	Proxified Load Template module using requirejs strategy to be injected as part of
		*	the current context.
		*	@FIXME: Logic and Engine event triggering need to be improved.
		*	@public
		*	@method html_load
		*	@param tpl {String,Array} template name or list of template names
		*	@param [callback] {Function} callback function
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		html_load: function(tpl, callback) {
			if(!tpl) return this;
			if(_.isString(tpl) && tpl !== '') tpl = [tpl];
			var ename = Engine.EVENTS.plugin;
			var ps = _.compact(_.map(this._packages, function(p, n) { return (_.contains(tpl, n)) ? p.path : null; }));
			require(ps, _.bind(function() {
				_.extend(this._tpls, _.object(tpl, Array.prototype.slice.call(arguments)));
				if(callback && _.isFunction(callback)) callback();
				this._engine.trigger(Engine.EVENTS.plugin, ename, tpl);
			}, this));
			return this;
		},

		/**
		*	Proxified Template function that performs a look up over all the template packages
		*	using the route passed as parameter (in dot notation format) and pass the additional params
		*	to the existing compiled template function. If the template function is not found
		*	returns an empty string
		*	@public
		*	@method html_tpl
		*	@param route {String} route using dot notation format
		*	@param [params] {Object} parameters to pass to the template
		*	@return String
		**/
		html_tpl: function(route, params) {
			if(!route || route === '') return '';
			if(!params) params = {};
			var inCore = (route.indexOf('!') === -1),
				tpl = this._query(route.replace('!', '.'), inCore);
			if(tpl && _.isString(tpl)) tpl = _.template(unescape(tpl));
			return ((tpl && _.isFunction(tpl)) ? tpl(params) : '').replace(/\n/g, '').replace(/\t/g, ' ');
		},

		/**
		*	Plugin execution
		*	@public
		*	@chainable
		*	@method execute
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		execute: function() {
			this._engine.trigger(Engine.EVENTS.proxified, this, 'html_load', 'html_loaded', 'html_tpl');
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

	return HTMLPlugin;

});
