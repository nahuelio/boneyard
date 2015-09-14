/**
*	@module com.spinal.ioc.engine
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/specs',
		'util/factories/async-factory',
		'util/adt/iterator'], function(Specs, AsyncFactory, Iterator) {

	/**
	*	Class Engine
	*	@namespace com.spinal.ioc.engine
	*	@class com.spinal.ioc.engine.Engine
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.helpers.Specs
	*	@requires com.spinal.util.factories.AsyncFactory
	*	@requires com.spinal.util.adt.Iterator
	**/
	var Engine = Spinal.namespace('com.spinal.ioc.engine.Engine', Spinal.SpinalClass.inherit({

		/**
		*	Spec Collection
		*	@public
		*	@property specs
		*	@type com.spinal.ioc.engine.helpers.Specs
		**/
		specs: new Specs(),

		/**
		*	Asynchronous Processor Factory
		*	@public
		*	@property factory
		*	@type com.spinal.util.AsyncFactory
		**/
		factory: new AsyncFactory(),

		/**
		*	Processors Iterator
		*	@public
		*	@property processors
		*	@type com.spinal.util.adt.Iterator
		**/
		processors: new Iterator(),

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.engine.Engine
		**/
		initialize: function() {
			this.wire = _.wrap(this.wire, this.setup);
			this.unwire = _.wrap(this.unwire, this.setup);
			return Engine.__super__.initialize.apply(this, arguments);;
		},

		/**
		*	Retrieves engine's asynchronous factory
		*	@public
		*	@method getFactory
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		getFactory: function() {
			return this.factory;
		},

		/**
		*	Setup Engine's processors
		*	@public
		*	@chainable
		*	@method processor
		*	@param method {Function} wire or unwire method reference
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.engine.Engine
		**/
		setup: function(method, spec, callback) {
			if(!this.processors.isEmpty()) method(spec, callback);
			this.factory.push(Engine.PROCESSORS).load(_.bind(this.ready, this, method, spec, callback));
			return this;
		},

		/**
		*	Default Setup Engine Handler
		*	@public
		*	@method ready
		*	@param method {Function} wire or unwire method reference
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.engine.Engine
		**/
		ready: function(method, spec, callback) {
			this.processors.set(Engine.PROCESSORS);
			this.trigger(Engine.EVENTS.ready, this);
			(spec) ? method(spec, callback) : callback(this);
			return this;
		},

		/**
		*	Default Processor's execute Handler
		*	@public
		*	@chainable
		*	@method execute
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.processor.BoneProcessor
		**/
		execute: function(callback) {
			if(!this.processors.hasNext()) {
				this.processors.rewind();
				callback(this);
				return this;
			}
			this.factory.create(iterator.next().path, this)
				.once(BoneProcessor.EVENTS.done, _.bind(this.execute, this, callback))
				.execute();
			return this;
		},

		/**
		*	Adds and wire a new spec supplied by a given context
		*	@public
		*	@chainable
		*	@method wire
		*	@param spec {Object} spec
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.Engine
		**/
		wire: function(spec, callback) {
			this.specs.add(spec);
			return this.execute(callback).trigger(Engine.EVENTS.wire, spec);
		},

		/**
		*	Removes an existing spec associated with a context
		*	@public
		*	@chainable
		*	@disabled
		*	@method remove
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.engine.Engine
		**/
		unwire: function(spec, callback) {
			this.specs.remove(spec);
			return this.trigger(Engine.EVENTS.unwire, spec);
		},

		/**
		*	Instanciate a bone in the root of the Context
		*	@public
		*	@method create
		*	@param injector {com.spinal.ioc.helpers.Injector} injector reference
		*	@return Object
		**/
		create: function(injector) {
			var bone = _.pick(injector.bone, 'id', '$module', '$params');
			return (this.specs.getBone(bone.id)._$created = this.factory.create(bone.$module, bone.$params));
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Engine',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event wire
			**/
			wire: 'com:spinal:ioc:engine:spec:wire',

			/**
			*	@event unwire
			**/
			unwire: 'com:spinal:ioc:engine:spec:unwire',

			/**
			*	@event ready
			**/
			ready: 'com:spinal:ioc:engine:ready'
		},

		/**
		*	@static
		*	@property PROCESSORS
		*	@type Array
		**/
		PROCESSORS: [
			{ path: 'ioc/processor/create' },
			{ path: 'ioc/processor/ready' },
			{ path: 'ioc/processor/plugin' }
		]

	}));

	return Engine;

});
