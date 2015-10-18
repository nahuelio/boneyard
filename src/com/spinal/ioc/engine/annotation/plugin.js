/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation'], function(Annotation) {

	/**
	*	Class Plugin
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Plugin
	*	@extends com.spinal.ioc.engine.annotation.Annotation
	*
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	**/
	var Plugin = Spinal.namespace('com.spinal.ioc.engine.annotation.Plugin', Annotation.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param attrs {Object} plugin attributes
		*	@return com.spinal.ioc.engine.annotation.Plugin
		**/
		initialize: function(attrs) {
			return Plugin.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Creates plugin instance via injector
		*	@public
		*	@method create
		*	@return com.spinal.ioc.engine.annotation.Plugin
		**/
		create: function() {
			this.getInjector().create();
			return this;
		},

		/**
		*	Resolves Plugin's dependencies
		*	@public
		*	@method resolve
		*	@return com.spinal.ioc.engine.annotation.Plugin
		**/
		resolve: function() {
			this.getInjector().resolve();
			return this;
		},

		/**
		*	Default Plugin Execution strategy
		*	@public
		*	@method run
		*	@return com.spinal.ioc.engine.annotation.Plugin
		**/
		run: function() {
			if(this.isCreated()) this._$created.run();
			return this;
		},

		/**
		*	Returns true, plugin is a module
		*	@public
		*	@method isModule
		*	@return Boolean
		**/
		isModule: function() {
			return true;
		},

		/**
		*	Checks if this annotation was succesfully created
		*	@static
		*	@method isCreated
		*	@return Boolean
		**/
		isCreated: function() {
			return _.defined(this._$created);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Plugin',

		/**
		*	Gather plugins bones from a given spec
		*	@static
		*	@method only
		*	@param spec {Object} spec reference
		*	@return	Object
		**/
		only: function(spec) {
			return spec.$plugins ? spec.$plugins : {};
		}

	}));

	return Plugin;

});
