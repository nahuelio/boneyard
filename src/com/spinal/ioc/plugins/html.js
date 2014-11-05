/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['core/spinal',
		'util/exception/context'], function(Spinal, ContextException) {

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
		*	Template Packages
		*	@private
		*	@property packages
		*	@type Object
		**/
		packages: null,

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
			this.packages = (!_.isEmpty(attrs)) ? attrs : {};
			this.ctx = ctx;
			return HTMLPlugin.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Load Template module using requirejs strategy to be injected as part of
		*	the current context.
		*	@private
		*	@method _loadTemplate
		*	@param tplName {String} template name
		*	@return {com.spinal.ioc.plugins.HTMLPlugin}
		**/
		_loadTemplate: function(tplName) {
			// TODO: Implementation
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
			// TODO: Implementation
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
			return this._loadTemplate();
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
