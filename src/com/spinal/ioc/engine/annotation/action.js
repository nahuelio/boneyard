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
		*	Action's Target
		*	@private
		*	@property _target
		*	@type com.spinal.ioc.engine.helpers.Dependency
		**/
		_target: null,

		/**
		*	Action's Context
		*	@private
		*	@property _context
		*	@type Object
		**/
		_context: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} annotation attributes
		*	@return com.spinal.ioc.engine.annotation.Action
		**/
		initialize: function(attrs) {
			Action.__super__.initialize.apply(this, arguments);
			this._target = new Dependency({ expression: this.getId(), target: this, property: '_id', bone: this });
			return this;
		},

		/**
		*	Retrieves action's target
		*	@public
		*	@method getTarget
		*	@return Object
		**/
		getTarget: function() {
			return this._target;
		},

		/**
		*	Retrieves Action's target Context
		*	@public
		*	@method getContext
		*	@return Object
		**/
		getContext: function() {
			return this._context;
		},

		/**
		*	Default action's target resolution strategy
		*	@public
		*	@method getTarget
		*	@return com.spinal.ioc.engine.annotation.Action
		**/
		resolve: function() {
			this._context = this.getEngine().bone(this.getTarget().getCompound().id).bone();
			this.getInjector().inject(this.getTarget());
			return this;
		},

		/**
		*	Default Action parameter dependencies resolution strategy
		*	@public
		*	@method parameters
		*	@return Array
		**/
		parameters: function() {
			this.getInjector().resolve();
			return this.getValue();
		},

		/**
		*	Default action execution
		*	@public
		*	@method execute
		*	@return com.spinal.ioc.engine.annotation.Action
		**/
		execute: function() {
			if(this.getContext()) this.getId().apply(this.getContext(), this.parameters());
			this.executed = true;
			return this;
		},

		/**
		*	Returns true if the action was executed, otherwise returns false
		*	@public
		*	@method isExecuted
		*	@return Boolean
		**/
		isExecuted: function() {
			return (_.defined(this.executed) && this.executed);
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
