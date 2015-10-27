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
		*	@param path {String} plugin module path
		*	@return com.spinal.ioc.plugins.Plugin
		**/
		create: function(path) {
			this.getInjector().create(path, { engine: this.getEngine(), config: this.getValue() });
			return this.plugin();
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
		*	Retrieves plugin instance if it was created, otherwise returns null
		*	@public
		*	@method plugin
		*	@return com.spinal.ioc.plugins.Plugin
		**/
		plugin: function() {
			return this.isCreated() ? this._$created : null;
		},

		/**
		*	Default Plugin Execution strategy
		*	@public
		*	@method run
		*	@return com.spinal.ioc.engine.annotation.Plugin
		**/
		run: function() {
			if(this.plugin()) this.plugin().run();
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
		},

		/**
		*	Returns true if the plugin was executed, otherwise returns false
		*	@public
		*	@method isExecuted
		*	@return Boolean
		**/
		isExecuted: function() {
			return (_.defined(this.plugin()) && this.plugin().executed);
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
