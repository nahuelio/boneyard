/**
*	@module com.boneyard.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/engine'], function(Engine) {

	/**
	*	Class Context
	*	@namespace com.boneyard.ioc
	*	@class com.boneyard.ioc.Context
	*	@extends com.boneyard.core.Boneyard.Class
	*
	*	@requires com.boneyard.ioc.engine.Engine
	**/
	var Context = Boneyard.namespace('com.boneyard.ioc.Context', Boneyard.Class.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.boneyard.ioc.Context
		**/
		initialize: function() {
			this.api();
			this.listenTo(this.getEngine(), Engine.EVENTS.ready, this.onStart);
			this.listenTo(this.getEngine(), Engine.EVENTS.wire, this.onWire);
			this.listenTo(this.getEngine(), Engine.EVENTS.unwire, this.onUnwire);
			this.listenTo(this.getEngine(), Engine.EVENTS.plugin, this.onPlugin);
			return Context.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Proxifies Engine's methods into this context (API)
		*	@public
		*	@method api
		*	@return com.boneyard.ioc.Context
		**/
		api: function() {
			this.getEngine().proxify(this,
				'spec', 'allSpecs', 'allBones', 'allActions',
				'bone', 'bonesByType', 'bonesByClass');
			return this;
		},

		/**
		*	Retrieves unique instance of engine associated with this context
		*	@public
		*	@method getEngine
		*	@return com.boneyard.ioc.engine.Engine
		**/
		getEngine: function() {
			return Context.engine;
		},

		/**
		*	Wires a new spec into this context
		*	@public
		*	@chainable
		*	@method wire
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@return com.boneyard.ioc.Context
		**/
		wire: function(spec, callback) {
			this.getEngine().wire(spec, callback, this);
			return this;
		},

		/**
		*	Removes an existing spec associated with this context
		*	@public
		*	@chainable
		*	@disabled
		*	@method remove
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@return com.boneyard.ioc.engine.Engine
		**/
		unwire: function(spec, callback) {
			this.getEngine().unwire(spec, callback, this);
			return this;
		},

		/**
		*	Default start operation handler
		*	@public
		*	@method onStart
		*	@param engine {com.boneyard.ioc.engine.Engine} engine reference
		*	@return com.boneyard.ioc.Context
		**/
		onStart: function(engine) {
			return this.trigger(Context.EVENTS.start, this);
		},

		/**
		*	Default wire handler
		*	@public
		*	@method onWire
		*	@param spec {Object} spec wired reference
		*	@return com.boneyard.ioc.Context
		**/
		onWire: function(spec) {
			return this.trigger(Context.EVENTS.complete, this, Engine.EVENTS.wire, spec);
		},

		/**
		*	Default unwire handler
		*	@public
		*	@method onUnwire
		*	@param spec {Object} spec unwired reference
		*	@return com.boneyard.ioc.Context
		**/
		onUnwire: function(spec) {
			return this.trigger(Context.EVENTS.complete, this, Engine.EVENTS.unwire, spec);
		},

		/**
		*	Default plugin handler
		*	@public
		*	@method onPlugin
		*	@return com.boneyard.ioc.Context
		**/
		onPlugin: function() {
			var args = _.toArray(arguments);
			args.unshift(Context.EVENTS.plugin, this);
			return this.trigger.apply(this, args);
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
			start: 'com:boneyard:ioc:context:start',

			/**
			*	@event complete
			**/
			complete: 'com:boneyard:ioc:context:complete',

			/**
			*	@event plugin
			**/
			plugin: 'com:boneyard:ioc:context:plugin'
		},

		/**
		*	Main Spec LazyLoad
		*	@static
		*	@method LazyLoad
		*	@param [callback] {Function} optional callback
		*	@return com.boneyard.ioc.Context
		**/
		LazyLoad: function(callback) {
			var mainSpec = $('script[data-spec]').data('spec');
			if(mainSpec) require([mainSpec], function(spec) { Boneyard.app = new Context().wire(spec, callback); });
			return Context;
		}

	}));

	/**
	*	Unique Engine Reference
	*	@static
	*	@property engine
	*	@type com.boneyard.ioc.engine.Engine
	**/
	Context.engine = new Engine();

	return Context.LazyLoad();

});
