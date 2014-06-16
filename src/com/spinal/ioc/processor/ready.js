/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/ioc-processor'], function(Spinal, IoCProcessor) {

	/**
	*	Ready Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.ReadyProcessor
	*	@extends com.spinal.ioc.IoCProcessor
	*
	*	@requires com.spinal.ioc.IoCProcessor
	**/
	var ReadyProcessor = Spinal.namespace('com.spinal.ioc.processor.ReadyProcessor', IoCProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
		**/
		initialize: function() {
			ReadyProcessor.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
		**/
		execute: function() {
			ReadyProcessor.__super__.execute.apply(this, arguments);
			return this;
		},

		/**
		*	Bone Ready Default Event
		*	@public
		*	@method onReady
		*	@param bone {Object} Bone reference
		**/
		onReady: function(bone) {
			this.trigger(ReadyProcessor.EVENTS.ready, bone);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ReadyProcessor',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event ready
			**/
			ready: 'com:spinal:ioc:processor:bone:ready'
		}

	}));

	return ReadyProcessor;

});
