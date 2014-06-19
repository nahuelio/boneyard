/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/processor/ioc-processor'], function(Spinal, IoCProcessor) {

	/**
	*	Create Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.IoCProcessor
	*
	*	@requires com.spinal.ioc.processor.IoCProcessor
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', IoCProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		initialize: function() {
			CreateProcessor.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			CreateProcessor.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Bone Create Default Event
		*	@public
		*	@method onCreate
		*	@param bone {Object} Bone created reference
		**/
		onCreate: function(bone) {
			this.trigger(CreateProcessor.EVENTS.created, bone);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'CreateProcessor',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event created
			**/
			created: 'com:spinal:ioc:processor:bone:created'
		}

	}));

	return CreateProcessor;

});
