/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/processor/bone'], function(Spinal, BoneProcessor) {

	/**
	*	Destroy Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.DestroyProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var DestroyProcessor = Spinal.namespace('com.spinal.ioc.processor.DestroyProcessor', BoneProcessor.inherit({

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
			this.context.notify(DestroyProcessor.EVENTS.destroyed, bone);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'DestroyProcessor'

	}));

	return DestroyProcessor;

});
