/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/bone'], function(BoneProcessor) {

	/**
	*	Defines a processor that acts as a wrapper to trigger plugins functionality
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.PluginProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	**/
	var PluginProcessor = Spinal.namespace('com.spinal.ioc.processor.PluginProcessor', BoneProcessor.inherit({

		/**
		*	Supported Notations
		*	@public
		*	@property notations
		*	@type Array
		**/
		notations: ['plugins'],

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		initialize: function() {
			return PluginProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			return PluginProcessor.__super__.execute.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'PluginProcessor'

	}));

	return PluginProcessor;

});
