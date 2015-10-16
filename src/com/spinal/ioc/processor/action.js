/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/processor'], function(Processor) {

	/**
	*	Action Processor Class
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.ActionProcessor
	*	@extends com.spinal.ioc.processor.Processor
	*
	*	@requires com.spinal.ioc.processor.Processor
	**/
	var ActionProcessor = Spinal.namespace('com.spinal.ioc.processor.ActionProcessor', Processor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.processor.ActionProcessor
		**/
		initialize: function() {
			return ActionProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Resolves and processes actions declared in module's action section by parsing expression as methods
		*	and params to be passed to the result of those methods
		*	@private
		*	@method resolve
		*	@return Array
		**/
		resolve: function(exprs, params) {

		},

		/**
		*	Defaul Process strategy that operates on each action.
		*	@public
		*	@method process
		*	@param action {com.spinal.ioc.engine.annotation.Action} action annotation reference
		*	@return com.spinal.ioc.engine.processor.ActionProcessor
		**/
		process: function(action) {
			//this.action.getTarget().resolve()
			return this;
		},

		/**
		*	Iterates over list of bone annotations and excecutes the predicate function on each one
		*	@public
		*	@method execute
		*	@param bones {Array} list of bone annotations
		*	@param predicate {Function} predicate function that process each bone annotation
		*	@return Array
		**/
		execute: function() {
			ActionProcessor.__super__.execute.call(this, this.getEngine().allOperations(), this.process);
			return ActionProcessor.__super__.done.apply(this, arguments);
		},

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ActionProcessor'

	}));

	return ActionProcessor;

});
