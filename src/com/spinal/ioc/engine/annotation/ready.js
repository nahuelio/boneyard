/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation',
	'ioc/engine/helpers/dependency'], function(Annotation, Dependency) {

	/**
	*	Class Ready
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Ready
	*	@extends com.spinal.ioc.engine.annotation.Annotation
	*
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	**/
	var Ready = Spinal.namespace('com.spinal.ioc.engine.annotation.Ready', Annotation.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} annotation attributes
		*	@return com.spinal.ioc.engine.annotation.Ready
		**/
		initialize: function(attrs) {
			return Ready.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves target operation
		*	@public
		*	@method getTarget
		*	@return Object
		**/
		getTarget: function() {
			return this.target;
		},

		/**
		*	Default target resolution strategy
		*	@public
		*	@method getTarget
		*	@return com.spinal.ioc.engine.annotation.Ready
		**/
		resolve: function() {
			var target = new Dependency({ expression: this.getId(), target: this, property: '_id', bone: this });
			this.target = this.getInjector().inject(target);
			delete target;
			return this;
		},

		/**
		*	Default operation execution
		*	@public
		*	@method execute
		*	@return com.spinal.ioc.engine.annotation.Ready
		**/
		execute: function() {
			return _.defined(this.getTarget()) ? this.getTarget().apply(this, arguments) : this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Ready',

		/**
		*	Gather ready bones from a given spec
		*	@static
		*	@method only
		*	@param spec {Object} spec reference
		*	@return	Array
		**/
		only: function(spec) {
			return _.pick(spec, '$ready');
		}

	}));

	return Ready;

});
