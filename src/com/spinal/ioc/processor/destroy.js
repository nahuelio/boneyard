/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/processor/create'], function(Spinal, CreateProcessor) {

	/**
	*	Destroy Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.DestroyProcessor
	*	@extends com.spinal.ioc.processor.CreateProcessor
	*
	*	@requires com.spinal.ioc.processor.CreateProcessor
	**/
	var DestroyProcessor = Spinal.namespace('com.spinal.ioc.processor.DestroyProcessor', CreateProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.DestroyProcessor}
		**/
		initialize: function() {
			DestroyProcessor.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.DestroyProcessor}
		**/
		execute: function() {
			DestroyProcessor.__super__.execute.apply(this, arguments);
			return this;
		},

		/**
		*	Bone Destroy Default Event
		*	@public
		*	@method onDestroy
		*	@param bone {Object} Bone destroyed reference
		**/
		onDestroy: function(bone) {
			this.trigger(DestroyProcessor.EVENTS.destroyed, bone);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'DestroyProcessor',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event destroyed
			**/
			destroyed: 'com:spinal:ioc:processor:bone:destroyed'
		}

	}));

	return DestroyProcessor;

});
