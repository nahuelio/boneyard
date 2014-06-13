/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/ioc-processor'], function(Spinal, IoCProcessor) {

	/**
	*	Bone Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.ioc.IoCProcessor
	*
	*	@requires com.spinal.ioc.IoCProcessor
	**/
	var BoneProcessor = Spinal.namespace('com.spinal.ioc.processor.BoneProcessor', IoCProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		initialize: function() {
			BoneProcessor.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		execute: function() {
			BoneProcessor.__super__.execute.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneProcessor'

	}));

	return IoCProcessor.getContext().register('BoneProcessor', BoneProcessor);

});
