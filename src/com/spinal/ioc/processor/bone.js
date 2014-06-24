/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/context'], function(Spinal, Context) {

	/**
	*	BaseClass Bone Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.IoCProcessor
	**/
	var BoneProcessor = Spinal.namespace('com.spinal.ioc.processor.BoneProcessor', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			if(opts.context) this.context = opts.context;
			BoneProcessor.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Resolves bone references
		*	@public
		*	@method resolve
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		resolve: function() {
			return this;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@param spec {Object} Context spec reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		execute: function(spec) {
			// Solve dependencies (Child Processors will execute this "super call")
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneProcessor',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event created
			**/
			created: 'com:spinal:ioc:context:bone:created',
			/**
			*	@event ready
			**/
			ready: 'com:spinal:ioc:context:bone:ready',
			/**
			*	@event destroyed
			**/
			destroyed: 'com:spinal:ioc:context:bone:destroyed'
		},

		/**
		*	Static Initializer
		*	@static
		*	@method Register
		*	@param ctx {com.spinal.ioc.Context} context in wich the processor will be registered
		*	@return {com.spinal.ioc.processor.IoCProcessor}
		**/
		Register: function(ctx) {
			return ctx.register(this.NAME, this);
		}

	}));

	return BoneProcessor;

});
