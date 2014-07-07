/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

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
		*	@param ctx {com.spinal.ioc.Context} Context Reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		initialize: function(ctx) {
			if(!ctx) throw new ContextException('UndefinedContext');
			// FIXME: ctx is an real array!!
			this.context = ctx;
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
			// return { bone: null, method: null };
			return this;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		execute: function() {
			// TODO: Resolve Bone References on this.context.bones
			console.log(this.constructor.NAME + '.execute()... with Spec ->');
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
