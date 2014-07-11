/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/bone'], function(BoneProcessor) {

	/**
	*	Create Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', BoneProcessor.inherit({

		/**
		*	Supported Notations
		*	@public
		*	@property notations
		*	@type Array
		**/
		notations: ['module', 'params'],

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		initialize: function() {
			return CreateProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Handles specifc notation with the current processor.
		*	@public
		*	@method handleNotation
		*	@param bone {Object} current bone to evaluate
		*	@param id {Object} current bone id
		*	@return Boolean
		**/
		handleNotation: function(bone, id) {
			var result = CreateProcessor.__super__.handleNotation.apply(this, arguments);
			if(!result && _.isObject(bone) && !this.isCreated(bone)) {
				//CreateProcessor.__super__.execute.call(this, this.handleNotation, bone);
			} else {
				//console.log(id);
			}
			// bone._$created = instance of module???;
			return result;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@param [bone] {Object} Bone context in which the execution will be narrowed down
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function(bone) {
			this.ctx.notify(CreateProcessor.EVENTS.created, {
				bones: CreateProcessor.__super__.execute.call(this, this.handleNotation, bone)
			});
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'CreateProcessor'

	}));

	return CreateProcessor;

});
