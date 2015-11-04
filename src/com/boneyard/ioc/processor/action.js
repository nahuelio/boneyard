/**
*	@module com.boneyard.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/processor'], function(Processor) {

	/**
	*	Class ActionProcessor
	*	@namespace com.boneyard.ioc.processor
	*	@class com.boneyard.ioc.processor.ActionProcessor
	*	@extends com.boneyard.ioc.processor.Processor
	*
	*	@requires com.boneyard.ioc.processor.Processor
	**/
	var ActionProcessor = Boneyard.namespace('com.boneyard.ioc.processor.ActionProcessor', Processor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.boneyard.ioc.processor.ActionProcessor
		**/
		initialize: function() {
			return ActionProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Default Sort strategy for execution of actions
		*	@public
		*	@method sort
		*	@param actionA {com.boneyard.ioc.engine.annotation.Action} action A reference
		*	@param actionB {com.boneyard.ioc.engine.annotation.Action} action B reference
		*	@return Number
		**/
		sort: function(actionA, actionB) {
			var aListenTo = actionA.getId().indexOf('listenTo');
			var bListenTo = actionB.getId().indexOf('listenTo');

			var aRender = actionA.getId().indexOf('render');
			var bRender = actionB.getId().indexOf('render');

			if(aListenTo < bListenTo) return -1;
			if(aListenTo > bListenTo) return 1;

			if(aRender < bRender) return -1;
			if(aRender > bRender) return 1;

			return 0;
		},

		/**
		*	Defaul Process strategy that operates on each action.
		*	@public
		*	@method process
		*	@param action {com.boneyard.ioc.engine.annotation.Action} action annotation reference
		*	@return com.boneyard.ioc.engine.annotation.Action
		**/
		process: function(action) {
			return action.resolve().execute();
		},

		/**
		*	Retrieves a list of action annotations that have not been executed
		*	@public
		*	@method actions
		*	@return Array
		**/
		actions: function() {
			return _.filter(this.getEngine().allActions(), function(action) { return !action.isExecuted(); });
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
			var actions = this.actions().sort(this.sort);
			ActionProcessor.__super__.execute.call(this, actions, this.process);
			return ActionProcessor.__super__.done.apply(this, [ActionProcessor.NAME]);
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
