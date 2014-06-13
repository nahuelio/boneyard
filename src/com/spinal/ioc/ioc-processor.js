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
		initialize: function() {
			return this;
		},

		/**
		*	Retrieves the Context associated with this processor.
		*	@public
		*	@method getContext
		*	@return {com.spinal.ioc.Context}
		**/
		getContext: function() {
			return this;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.IoCProcessor}
		**/
		execute: function() {
			// throw new ContextException('ProcessorExecutor');
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'IoCProcessor'

	}));

	return IoCProcessor;

});
