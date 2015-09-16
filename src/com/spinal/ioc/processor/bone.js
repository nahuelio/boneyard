/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Class BoneProcessor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.SpinalClass
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
		*	Iterates over list of bone annotations and excecutes the predicate function on each one
		*	@public
		*	@method execute
		*	@param predicate {Function} predicate function that process each bone annotation
		*	@param bones {Array} list of bone annotatioms
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
