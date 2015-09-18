/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/engine'], function(Engine) {

	/**
	*	IOC Context Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.Context
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.Engine
	**/
	var Context = Spinal.namespace('com.spinal.ioc.Context', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.Context
		**/
		initialize: function() {
			this.proxy();
			this.listenTo(this.getEngine(), Engine.EVENTS.ready, this.onStart);
			this.listenTo(this.getEngine(), Engine.EVENTS.wire, this.onWire);
			this.listenTo(this.getEngine(), Engine.EVENTS.unwire, this.onUnwire);
			return Context.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Proxifies Engine and Query methods into this Context
		*	@public
		*	@method proxy
		*	@return com.spinal.ioc.Context
		**/
		proxy: function() {
			this.getEngine().proxify(this,
				'spec', 'allSpecs', 'allBones',
				'bone', 'bonesByType', 'bonesByClass');
			return this;
		},

		/**
		*	Retrieves unique instance of engine associated with this context
		*	@public
		*	@method getEngine
		*	@return com.spinal.ioc.engine.Engine
		**/
		getEngine: function() {
			return Context.engine;
		},

		/**
		*	Adds and wire a new spec supplied on this context
		*	@public
		*	@chainable
		*	@method wire
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.Context
		**/
		wire: function(spec, callback) {
			this.getEngine().wire(spec, callback, this);
			return this;
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
			this.getEngine().unwire(spec, callback, this);
			return this;
		},

		/**
		*	Default start operation handler
		*	@public
		*	@method onStart
		*	@param engine {com.spinal.ioc.engine.Engine} engine reference
		*	@return com.spinal.ioc.Context
		**/
		onStart: function(engine) {
			return this.trigger(Context.EVENTS.start, this);
		},

		/**
		*	Default wire handler
		*	@public
		*	@method onWire
		*	@param spec {Object} spec wired reference
		*	@return com.spinal.ioc.Context
		**/
		onWire: function(spec) {
			return this.trigger(Context.EVENTS.complete, this, Engine.EVENTS.wire, spec);
		},

		/**
		*	Default unwire handler
		*	@public
		*	@method onUnwire
		*	@param spec {Object} spec unwired reference
		*	@return com.spinal.ioc.Context
		**/
		onUnwire: function(spec) {
			return this.trigger(Context.EVENTS.complete, this, Engine.EVENTS.unwire, spec);
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
			*	@event start
			**/
			start: 'com:spinal:ioc:context:start',

			/**
			*	@event complete
			**/
			complete: 'com:spinal:ioc:context:complete'
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
			var ctx = new Context();
			if(_.defined(spec) && _.isFunction(spec)) {
				callback = spec;
				spec = null;
			}
			(arguments.length > 0) ? ctx.wire(spec, callback) : ctx.getEngine().setup();
			return ctx;
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

	/**
	*	Unique Engine Reference
	*	@static
	*	@property engine
	*	@type com.spinal.ioc.engine.Engine
	**/
	Context.engine = new Engine();

	// Automatic Initializer
	var mainSpec = $('script[data-spec]').data('spec');
	if(mainSpec) Context.LazyLoad(mainSpec, function(spec) { Spinal.app = Context.Initialize(spec); });

	return Context;

});
