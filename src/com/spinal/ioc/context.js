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
			this.proxy()
				.listenTo(this.getEngine(), Engine.EVENTS.ready, this.onStart);
				.listenTo(this.getEngine(), Engine.EVENTS.wire, this.onWire);
				.listenTo(this.getEngine(), Engine.EVENTS.unwire, this.onUnwire);
			return Context.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Proxifies Engine and Query methods into this Context
		*	@public
		*	@method proxy
		*	@return com.spinal.ioc.Context
		**/
		proxy: function() {
			this.proxify(this.getEngine(), 'wire', 'unwire',
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

	// Unique Engine Instance for all context
	Context.engine = new Engine();

	// Automatic Initializer
	var mainSpec = $('script[data-spec]').data('spec');
	if(mainSpec) Context.LazyLoad(mainSpec, function(spec) { Spinal.app = Context.Initialize(spec); });

	return Context;

});
