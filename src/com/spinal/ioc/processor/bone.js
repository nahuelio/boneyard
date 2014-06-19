/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/processor/ioc-processor'], function(Spinal, IoCProcessor) {

	/**
	*	Bone Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.ioc.processor.IoCProcessor
	*
	*	@requires com.spinal.ioc.processor.IoCProcessor
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
		*	@param spec {Object} Context spec reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		execute: function(spec) {
			BoneProcessor.__super__.execute.apply(this, arguments);
			// TODO: Solve $bone! references.
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

	return BoneProcessor;

});
