/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation',
	'ioc/engine/helpers/dependency'], function(Annotation, Dependency) {

	/**
	*	Class Action
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Action
	*	@extends com.spinal.ioc.engine.annotation.Annotation
	*
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	**/
	var Action = Spinal.namespace('com.spinal.ioc.engine.annotation.Action', Annotation.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} annotation attributes
		*	@return com.spinal.ioc.engine.annotation.Action
		**/
		initialize: function(attrs) {
			return Action.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves action's target
		*	@public
		*	@method getTarget
		*	@return Object
		**/
		getTarget: function() {
			return this.target;
		},

		/**
		*	Default action's target resolution strategy
		*	@public
		*	@method getTarget
		*	@return com.spinal.ioc.engine.annotation.Action
		**/
		resolve: function() {
			var target = new Dependency({ expression: this.getId(), target: this, property: '_id', bone: this });
			this.target = this.getInjector().inject(target);
			delete target;
			return this;
		},

		/**
		*	Default Action parameter dependencies resolution strategy
		*	@public
		*	@method parameters
		*	@return Array
		**/
		parameters: function() {
			//return this.getInjector().resolve();
			return [];
		},

		/**
		*	Default action execution
		*	@public
		*	@method execute
		*	@return com.spinal.ioc.engine.annotation.Action
		**/
		execute: function() {
			return _.defined(this.getTarget()) ? this.getId().apply(this, this.parameters()) : this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Action',

		/**
		*	Gather action bones from a given spec
		*	@static
		*	@method only
		*	@param spec {Object} spec reference
		*	@return	Array
		**/
		only: function(spec) {
			return _.pick(spec, '$actions');
		}

	}));

	return Action;

});
