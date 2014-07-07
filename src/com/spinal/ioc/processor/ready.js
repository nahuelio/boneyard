/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/bone'], function(BoneProcessor) {

	/**
	*	Ready Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.ReadyProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var ReadyProcessor = Spinal.namespace('com.spinal.ioc.processor.ReadyProcessor', BoneProcessor.inherit({

		/**
		*	Supported Notations
		*	@public
		*	@property notations
		*	@type Array
		**/
		notations: ['ready'],

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
		**/
		initialize: function() {
			return ReadyProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
		**/
		execute: function() {
			return ReadyProcessor.__super__.execute.apply(this, arguments);
		},

		/**
		*	Bone Ready Default Event
		*	@public
		*	@method onReady
		*	@param bone {Object} Bone reference
		**/
		onReady: function(bone) {
			this.context.notify(ReadyProcessor.EVENTS.ready, bone);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ReadyProcessor'

	}));

	return ReadyProcessor;

});
