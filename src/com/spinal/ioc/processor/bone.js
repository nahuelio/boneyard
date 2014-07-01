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
		*	Supported Notations
		*	@public
		*	@property notations
		*	@type Array
		**/
		notations: ['plugins', 'bone'],

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
		*	Performs a notation full look up inside the bones hierarchy defined in the current context.
		*	@public
		*	@method lookup
		*	@param notation {String} Notation literal
		*	@return Object
		**/
		lookup: function(notation) {
			if(!this.context._valid.apply(this, notation)) return null;
			// TODO: Perform look up over the bone structure.
		},

		/**
		*	Resolves bone references
		*	@public
		*	@method resolve
		*	@return Object
		**/
		resolve: function(notation) {
			// TODO: Implement RegExp to extract bone reference strings
			return { bone: null, method: null };
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@param spec {Object} Context spec reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		execute: function(spec) {
			// TODO: Resolve Bone References on this.context.bones
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
