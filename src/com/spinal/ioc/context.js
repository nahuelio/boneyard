/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/string',
		'util/adt/iterator',
		'util/async-factory',
		'ioc/engine',
		'util/exception/context'], function(Spinal, StringUtil, Iterator, AsyncFactory, Engine, ContextException) {

	/**
	*	IOC Context Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.Context
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.StringUtil
	*	@requires com.spinal.util.adt.Iterator
	*	@requires com.spinal.ioc.BoneFactory
	*	@requires com.spinal.ioc.BoneQuery
	*	@requires com.spinal.util.exception.ContextException
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
		*	Current Spec
		*	@public
		*	@property spec
		*	@type Object
		**/
		spec: {},

		/**
		*	Engine Class
		*	@public
		*	@property query
		*	@type com.spinal.ioc.Engine
		**/
		engine: null,

		/**
		*	Async Bone Factory
		*	@public
		*	@property boneFactory
		*	@type {com.spinal.util.AsyncFactory}
		**/
		boneFactory: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.Context}
		**/
		initialize: function() {
			this.boneFactory = new AsyncFactory();
			this.engine = new Engine({ context: this });
			return Context.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Processor load Handler
		*	@private
		*	@method _onProcessorLoaded
		*	@param processorId {String} Processor Module Id
		*	@param processor {Object} registered processor module
		*	@return com.spinal.ioc.Context
		**/
		_onProcessorLoaded: function(callback, processorId, processor) {
			var p = Context.PROCESSORS.next();
			p.module = this.factory('create', processorId, this);
			p.module.once(Context[processorId].EVENTS.processed, this._next, this);
			return (!Context.PROCESSORS.hasNext() && Context.PROCESSORS.rewind()) ? this._next(callback) : this;
		},

		/**
		*	Next Processor Execution Complete Handler
		*	@private
		*	@method _next
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.Context
		**/
		_next: function(callback) {
			return (Context.PROCESSORS.hasNext()) ?
				Context.PROCESSORS.next().module.execute(this) :
				this.notify(Context.EVENTS.initialized, callback);
		},

		/**
		*	Bone Factory method wrapper
		*	@public
		*	@method factory
		*	@param methodName {String} Bone factory method
		*	@return Object
		**/
		factory: function(methodName) {
			if(!methodName) return null;
			var args = Array.prototype.slice.call(arguments, 1);
			return (this.boneFactory[methodName]) ? this.boneFactory[methodName].apply(this.boneFactory, args) : null;
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
			this.spec = {}; // Partial Specs not ready yet.
			this.engine.build(spec);
			this.boneFactory.set(Context.PROCESSORS.collection).load(_.bind(this._onProcessorLoaded, this, callback));
			return this;
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
			if(eventName && _.isString(eventName)) this.trigger(eventName, this);
		},

		/**
		*	Perform a look up of bones by a predicate passed as parameter.
		*	If a bone is specified as a extra argument, it will narrow the search down to the specific bone context.
		*	@public
		*	@method getBonesBy
		*	@param predicate {Function} predicate evaluation
		*	@return Array
		**/
		getBonesBy: function(predicate) {
			var result = [];
			for(var b in this.spec) {
				var m = (this.query.isModule(this.spec[b]) && this.query.isCreated(this.spec[b])) ?
					this.spec[b]._$created : this.spec[b];
				if(predicate(m, b)) result.push(m);
			}
			return result;
		},

		/**
		*	Perform a look up of bones by class name passed as parameter.
		*	This method will require to make use of the Static NAME property declared in the constructor.
		*	@public
		*	@method getBonesByClass
		*	@param className {String} bone class name
		*	@return Array
		**/
		getBonesByClass: function(className) {
			return this.getBonesBy(_.bind(function(bone, id) { return (bone.constructor.NAME === className); }, this));
		},

		/**
		*	Perform a look up of bones by type passed as parameter.
		*	@public
		*	@method getBonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		getBonesByType: function(type) {
			return this.getBonesBy(function(bone, id) { return (bone instanceof type); });
		},

		/**
		*	Perform a look up by bone id passed as parameter
		*	@public
		*	@method getBone
		*	@param id {String} bone id
		*	@return Object
		**/
		getBone: function(id) {
			var bone = this.query.findBoneById(id);
			return (this.query.isModule(bone)) ? (this.query.isCreated(bone) ? bone._$created : null) : bone;
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
			initialized: 'com:spinal:ioc:context:initialized'
		},

		/**
		*	Processors List used by the context
		*	@static
		*	@property PROCESSORS
		*	@type {com.spinal.util.adt.Iterator}
		**/
		PROCESSORS: new Iterator([
			{ id: 'PluginProcessor', class: 'ioc/processor/plugin' },
			{ id: 'CreateProcessor', class: 'ioc/processor/create' },
			{ id: 'ReadyProcessor', class: 'ioc/processor/ready' }
		]),

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
