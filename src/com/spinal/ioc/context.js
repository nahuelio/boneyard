/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/string',
		'util/adt/iterator',
		'util/factories/async-factory',
		'util/exception/context',
		'ioc/processor/bone',
		'ioc/engine'], function(Spinal, StringUtil, Iterator, AsyncFactory, ContextException, BoneProcessor, Engine) {

	/**
	*	IOC Context Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.Context
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.StringUtil
	*	@requires com.spinal.util.adt.Iterator
	*	@requires com.spinal.util.AsyncFactory
	*	@requires com.spinal.util.exception.ContextException
	*	@requires com.spinal.ioc.processor.BoneProcessor
	*	@requires com.spinal.ioc.Engine
	**/
	var Context = Spinal.namespace('com.spinal.ioc.Context', Spinal.SpinalClass.inherit({

		/**
		*	Identifier
		*	@public
		*	@property id
		*	@type String
		**/
		id: StringUtil.uuid(),

		/**
		*	Engine Class
		*	@public
		*	@property query
		*	@type com.spinal.ioc.Engine
		**/
		engine: null,

		/**
		*	Async Module Factory
		*	@public
		*	@property factory
		*	@type {com.spinal.util.AsyncFactory}
		**/
		factory: null,

		/**
		*	Processors List used by the context
		*	@public
		*	@property processors
		*	@type {com.spinal.util.adt.Iterator}
		**/
		processors: new Iterator([
			{ id: 'CreateProcessor', path: 'ioc/processor/create' },
			{ id: 'ReadyProcessor', path: 'ioc/processor/ready' },
			{ id: 'PluginProcessor', path: 'ioc/processor/plugin' }
		]),

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.Context}
		**/
		initialize: function() {
			this.factory = new AsyncFactory();
			this.engine = new Engine(this.factory);
			this.proxify(this.engine, 'getBone', 'getBonesByType', 'getBonesByClass');
			return Context.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Load Processors if they were not loaded previously.
		*	@private
		*	@method _loadProcessors
		*	@param [callback] {Function} callback reference
		*	@return {com.spinal.ioc.Context}
		**/
		_loadProcessors: function(callback) {
			this.processors.rewind();
			(!this.factory.getFactory('CreateProcesor')) ?
				this.factory.set(this.processors.collection).load(_.bind(this._onProcessorsLoaded, this, callback)) :
				this._onProcessorsLoaded(callback);
			return this;
		},

		/**
		*	Processors Load Handler
		*	@private
		*	@method _onProcessorsLoaded
		*	@param [callback] {Function} callback reference
		**/
		_onProcessorsLoaded: function(callback) {
			while(this.processors.hasNext()) {
				var p = this.processors.next();
				p.module = this.bonefactory('create', p.id, this.engine);
				p.module.once(BoneProcessor.EVENTS.processed, _.bind(this._next, this, p.module, callback));
			}
			return (this.processors.rewind() && this._next());
		},

		/**
		*	Next Processor Execution Complete Handler
		*	@private
		*	@method _next
		*	@param processor {Object} processor reference
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.Context
		**/
		_next: function(processor, callback) {
			if(processor) this.notify(Context.EVENTS.processorCompleted, null, processor);
			return (this.processors.hasNext()) ?
				this.processors.next().module.execute() :
				this.notify(Context.EVENTS.initialized, callback, this);
		},

		/**
		*	Bone Factory method wrapper
		*	@public
		*	@method bonefactory
		*	@param methodName {String} factory method name
		*	@return Object
		**/
		bonefactory: function(methodName) {
			if(!methodName) return null;
			var args = Array.prototype.slice.call(arguments, 1);
			return (this.factory[methodName]) ? this.factory[methodName].apply(this.factory, args) : null;
		},

		/**
		*	Context Wiring
		*	@public
		*	@chainable
		*	@method wire
		*	@throws {com.spinal.util.exception.ContextException}
		*	@param spec {Object} context specification to be wired
		*	@param callback {Function} callback function to be called after autowiring.
		*	@return {com.spinal.ioc.Context}
		**/
		wire: function(spec, callback) {
			if(!spec) { callback(this); return this; }
			if(!_.isObject(spec)) throw new ContextException('InvalidSpecFormat');
			this.engine.build(spec);
			return this._loadProcessors(callback);
		},

		/**
		*	Trigger Context notifications
		*	@public
		*	@method notify
		*	@param eventName {String} event name to be trigger
		*	@param [callback] {Function} optional callback to be called
		**/
		notify: function(eventName, callback) {
			if(callback && _.isFunction(callback)) callback(this);
			if(eventName && _.isString(eventName)) {
				var args = Array.prototype.slice.call(arguments, 2); args.unshift(eventName);
				this.trigger.apply(this, args);
			}
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Context',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event initialized
			**/
			initialized: 'com:spinal:ioc:context:initialized',
			/**
			*	@event processorCompleted
			**/
			processorCompleted: 'com:spinal:ioc:context:processor:completed'
		},

		/**
		*	Static IoC Initializer
		*	@static
		*	@method Initialize
		*	@param spec {Object} Default spec
		*	@param callback {Function} callback pass to the wire
		*	@return com.spinal.ioc.Context
		**/
		Initialize: function(spec, callback) {
			return (arguments.length === 1 && _.isFunction(spec)) ?
				new Context().wire(null, spec) :
				new Context().wire(spec, callback);
		},

		/**
		*	Main Spec LazyLoad
		*	@static
		*	@method LazyLoad
		*	@param pathSpec {String} main spec path
		*	@param callback {Function} callback pass to the wire
		*	@return com.spinal.ioc.Context
		**/
		LazyLoad: function(pathSpec, callback) {
			require([pathSpec], callback);
		}

	}));

	// Automatic Initializer
	var mainSpec = $('script[data-spec]').data('spec');
	if(mainSpec) Context.LazyLoad(mainSpec, function(spec) { Spinal.app = Context.Initialize(spec); });

	return Context;

});
