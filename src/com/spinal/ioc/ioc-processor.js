/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/context'], function(Spinal, Context) {

	/**
	*	Abstract IoC Processor defines the interface
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.IoCProcessor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.SpinalClass
	**/
	var IoCProcessor = Spinal.namespace('com.spinal.ioc.IoCProcessor', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.IoCProcessor}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			if(opts.context) this.context = opts.context;
			return this;
		},

		/**
		*	Retrieves the Context associated with this processor.
		*	@public
		*	@method getContext
		*	@return {com.spinal.ioc.Context}
		**/
		getContext: function() {
			return this.context;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@param spec {Object} Context reference.
		*	@return {com.spinal.ioc.IoCProcessor}
		**/
		execute: function(spec) {
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'IoCProcessor',

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

	return IoCProcessor;

});
