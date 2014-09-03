/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/string',
		'util/adt/iterator',
		'ioc/bone-factory',
		'ioc/bone-query',
		'util/exception/context'], function(Spinal, StringUtil, Iterator, BoneFactory, BoneQuery, ContextException) {

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
		*	Bone Query Engine Class
		*	@public
		*	@property query
		*	@type com.spinal.ioc.BoneQuery
		**/
		query: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param [opts] {Object} Initial Options
		*	@return {com.spinal.ioc.Context}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			this.query = new BoneQuery({ context: this });
			return Context.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Processors loaded callback
		*	@private
		*	@method _onProcessorsLoaded
		*	@param [callback] {Function} Optional Callback
		*	@param processors {Array} Array of Processor Modules
		**/
		_onProcessorsLoaded: function(callback, processors) {
			this.on(Context.EVENTS.processed, _.bind(this._onProcessorFinished, this, callback));
			_.each(processors, function(p) { Context[p.NAME] = this.factory('create', p.NAME, this); }, this);
			this._onProcessorFinished(callback);
		},

		/**
		*	Processor Finish Handler
		*	@private
		*	@method _onProcessorFinished
		*	@param data {Object} event data
		**/
		_onProcessorFinished: function(callback, event) {
			if(Context.PROCESSORS.hasNext()) {
				Context[Context.PROCESSORS.next().id].execute();
			} else {
				Context.PROCESSORS.rewind();
				if(callback && _.isFunction(callback)) callback(this);
				this.trigger(Context.EVENTS.initialized, this);
			}
		},

		/**
		*	Build specs into a single object unit suitable to query by boneQuery class
		*	@private
		*	@method _build
		*	@param bone {Object} current bone
		*	@return {com.spinal.ioc.Context}
		**/
		_build: function(bone) {
			_.each(bone, function(b, id) {
		        (id === (Context.PREFIX + 'specs')) ?
					_.each((!_.isArray(b) && _.isObject(b)) ? [b] : b, this._build, this) :
					this.spec[id] = b;
		    }, this);
			return this;
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
			return (Context.BoneFactory[methodName]) ?
				Context.BoneFactory[methodName].apply(Context.BoneFactory, args) : null;
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
			this.spec = {};
			this._build(spec);
			Context.BoneFactory.set(Context.PROCESSORS.collection).load(_.bind(this._onProcessorsLoaded, this, callback));
			return this;
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
			initialized: 'com:spinal:ioc:context:initialized',
			/**
			*	@event processed
			**/
			processed: 'com:spinal:ioc:processor:processed',
			/**
			*	@event plugin
			**/
			plugin: 'com:spinal:ioc:context:bone:plugin',
			/**
			*	@event created
			**/
			created: 'com:spinal:ioc:context:bone:created',
			/**
			*	@event ready
			**/
			ready: 'com:spinal:ioc:context:bone:ready'
		},

		/**
		*	@static
		*	@property PREFIX
		*	@type String
		**/
		PREFIX: '$',

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
		*	@static
		*	@property BoneFactory
		*	@type {com.spinal.ioc.BoneFactory}
		**/
		BoneFactory: new BoneFactory(),

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
	var $mainSpec = $('script[data-spec]');
	if($mainSpec.length > 0)
		Context.LazyLoad($mainSpec.data('spec'), function(spec) { Spinal.app = Context.Initialize(spec); });

	return Context;

});
