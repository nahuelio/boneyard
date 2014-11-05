/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['core/spinal',
		'util/string',
		'util/exception/context'], function(Spinal, StringUtils, ContextException) {

	/**
	*	HTML IoC Plugin
	*	Initial Implementation to manage templates loaded at runtime.
	*	Nothing amazing about the strategy choosen. This will stay as basic as possible for now.
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.HTMLPlugin
	*	@extends com.spinal.core.Spinal.SpinalClass
	**/
	var HTMLPlugin = Spinal.namespace('com.spinal.ioc.plugins.HTMLPlugin', Spinal.SpinalClass.inherit({

		/**
		*	Context Reference
		*	@public
		*	@property ctx
		*	@type {com.spinal.ioc.Context}
		**/
		ctx: null,

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
		*	@param ctx {com.spinal.ioc.Context} context reference
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		initialize: function(attrs, ctx) {
			attrs || (attrs = {});
			if(!ctx) throw new ContextException('UndefinedContext');
			this._packages = (!_.isEmpty(attrs)) ? attrs : {};
			this.ctx = ctx;
			return HTMLPlugin.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Query the list of packages using a query (dot notation) to get the template
		*	If pkg is passed, will be use to prefix the specific package.
		*	In each case, if doesn't match any results the method returns null
		*	@private
		*	@method _query
		*	@param query {String}
		*	@param pkg {String} package to narrow down the query
		*	@return Function
		**/
		_query: function(query, pkg) {
			if(pkg && pkg !== '') query = (pkg + '.').concat(query);
			return StringUtils.search(query, this._tpls);
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
			return this._loadTemplate(tplNames);
		},

		/**
		*	Load Template module using requirejs strategy to be injected as part of
		*	the current context.
		*	@private
		*	@method _loadTemplate
		*	@param tpl {Array} list of template names
		*	@param tpl {String} Template name
		*	@param [callback] {Function} callback function
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		_loadTemplate: function(tpl, callback) {
			if(!tpl) return this;
			if(_.isString(tpl) && tpl !== '') tpl = [tpl];
			var ps = _.compact(_.map(this._packages, function(p, n) { return (_.contains(tpl, n)) ? p.path : null; }));
			require(ps, _.bind(function() {
				_.extend(this._tpls, _.object(tpl, Array.prototype.slice.call(arguments)));
				if(callback && _.isFunction(callback)) callback();
			}, this));
			return this;
		},

		/**
		*	Template Proxy function that performs a look up over all the template packages
		*	using the route passed as parameter (in dot notation format) and pass the additional params
		*	to the existing compiled template function. If the template function is not found
		*	returns an empty string
		*	@private
		*	@method _tpl
		*	@param route {String} route using dot notation format
		*	@param [params] {Object} parameters to pass to the template
		*	@return String
		**/
		_tpl: function(route, params) {
			if(!route || route === '') return '';
			if(!params) params = {};
			var ps, pkg = ((ps = route.split('!')).length > 1) ? ps[0] : null,
				compiled = this._query(ps[(!pkg) ? 0 : 1], pkg);
			return (compiled && _.isFunction(compiled)) ? compiled(params) : '';
		},

		/**
		*	Plugin execution
		*	@public
		*	@chainable
		*	@method execute
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		execute: function() {
			this.ctx.loadTemplate = _.bind(this._loadTemplate, this);
			this.ctx.tpl = _.bind(this._tpl, this);
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
