/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/engine',
	'util/exception/ioc/processor'], function(Engine, ProcessorException) {

	/**
	*	Class Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.Processor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.Engine
	*	@requires com.spinal.util.exception.ioc.ProcessorException
	**/
	var Processor = Spinal.namespace('com.spinal.ioc.processor.Processor', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param engine {com.spinal.ioc.engine.Engine} engine reference
		*	@return com.spinal.ioc.processor.Processor
		**/
		initialize: function(engine) {
			if(!engine || !(engine instanceof Engine)) throw new ProcessorException('EngineRequired');
			this.engine = engine;
			return Processor.__super__.initialize.apply(this, arguments);
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
		*	@param elements {Array} list of annotations
		*	@param predicate {Function} predicate function that process each bone annotation
		*	@return Array
		**/
		execute: function(elements, predicate) {
			if(!predicate || !_.isFunction(predicate)) return elements;
			return _.map(elements, function(element) { return predicate.call(this, element); }, this);
		},

		/**
		*	Default processor done handler
		*	@public
		*	@method done
		*	@param type {String} Processor type
		*	@return com.spinal.ioc.processor.BoneProcessor
		**/
		done: function(type) {
			return this.trigger(Processor.EVENTS.done, type);
		}

	}, {

		/**
		*	Class Name
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Processor',

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

	return Processor;

});
