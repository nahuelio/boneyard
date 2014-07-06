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
		*	Context Reference
		*	@public
		*	@property context
		*	@type {com.spinal.ioc.Context}
		**/
		context: null,

		/**
		*	Supported Notations
		*	@public
		*	@property notations
		*	@type Array
		**/
		notations: ['bone'],

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param ctx {com.spinal.ioc.Context} context reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		initialize: function(ctx) {
			if(!ctx) throw new ContextException('UndefinedContext');
			this.context = ctx;
			BoneProcessor.__super__.initialize.apply(this, arguments);
			return this;
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
		}

	}));

	return BoneProcessor;

});
