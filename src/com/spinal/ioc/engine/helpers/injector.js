/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/dependency'], function(Dependency) {

	/**
	*	Class Injector
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.Injector
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.helpers.Dependency
	**/
	var Injector = Spinal.namespace('com.spinal.ioc.engine.helpers.Injector', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param engine {com.spinal.ioc.engine.Engine} engine reference
		*	@param annotation {com.spinal.ioc.engine.annotation.Annotation} annotation reference
		*	@return com.spinal.ioc.helpers.Injector
		**/
		initialize: function(engine, annotation) {
			this.engine = engine;
			this.annotation = annotation;
			return Injector.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves Engine's Factory
		*	@public
		*	@method getFactory
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		getFactory: function() {
			return this.engine.getFactory();
		},

		/**
		*	Resolves dependency injection and resolves dependency injection on the current bone
		*	@public
		*	@method resolve
		*	@return com.spinal.ioc.helpers.Injector
		**/
		resolve: function() {
			return this.annotation.getDependencies().invoke('inject', this.engine);
		},

		/**
		*	Assigns bone module instance into the bone managed by this injector
		*	@public
		*	@method assign
		*	@param instance {Object} instance gathered from factory
		*	@return com.spinal.ioc.helpers.Injector
		**/
		assign: function(instance) {
			this.annotation._$created = instance;
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Injector'

	}));

	return Injector;

});
