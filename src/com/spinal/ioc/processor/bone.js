/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine',
	'util/exception/ioc/processor'], function(Engine, ProcessorException) {

	/**
	*	BaseClass Bone Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.Engine
	*	@requires com.spinal.util.exception.ProcessorException
	**/
	var BoneProcessor = Spinal.namespace('com.spinal.ioc.processor.BoneProcessor', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		initialize: function(engine) {
			this.engine = engine;
			return BoneProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves unique instance of engine associated with this processor
		*	@public
		*	@method getEngine
		*	@return com.spinal.ioc.engine.Engine
		**/
		getEngine: function() {
			return this.engine;
		},

		/**
		*	Retrieves Engine's async factory
		*	@public
		*	@method getFactory
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		getFactory: function() {
			return this.getEngine().getFactory();
		},

		/**
		*	Retrieves Engine's spec collection
		*	@public
		*	@method getSpecs
		*	@return com.spinal.ioc.engine.helpers.SpecCollection
		**/
		getSpecs: function() {
			return this.getEngine().specs;
		},

		/**
		*	Checks if the expression is a module bone dependency
		*	@public
		*	@method isModuleDependency
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isModuleDependency: function(expr) {
			return _.isString(expr) ? this._engine.isModule(this.getDependency(expr).bone) : false;
		},

		/**
		*	Filters out and call the predicate function over the bone annotations supported by the processor.
		*	@public
		*	@method execute
		*	@param predicate {Function} predicate function that filters out bones that are suitable to be processed
		*	@param bones {Array} current bone
		*	@return Array
		**/
		execute: function(predicate, bones) {
			return _.map(bones, function(bone) { return predicate.call(this, bone); }, this);
		},

		/**
		*	Default processor done handler
		*	@public
		*	@method done
		*	@param type {String} Processor type
		*	@return com.spinal.ioc.processor.BoneProcessor
		**/
		done: function(type) {
			return this.trigger(BoneProcessor.EVENTS.done, type);
		}

	}, {

		/**
		*	Class Name
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneProcessor',

		/**
		*	@static
		*	@property PREFIX
		*	@type String
		**/
		PREFIX: '$',

		/**
		*	BoneProcessor Events
		*	@static
		*	@property Object
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event done
			**/
			done: 'com:spinal:ioc:processor:done'
		}

	}));

	return BoneProcessor;

});
