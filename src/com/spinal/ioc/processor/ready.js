/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'ioc/processor/bone'], function(Context, BoneProcessor) {

	/**
	*	Ready Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.ReadyProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var ReadyProcessor = Spinal.namespace('com.spinal.ioc.processor.ReadyProcessor', BoneProcessor.inherit({

		/**
		*	Supported Notation Regular Expression
		*	@public
		*	@property notationRE
		*	@type RegExp
		**/
		notationRE: new RegExp('\\' + Context.PREFIX + '(ready)$', 'i'),

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
		*	Validates if the current processor supports the notation passed as parameter
		*	@public
		*	@method matchNotation
		*	@param bone {String} notation to be evaluated
		*	@return Boolean
		**/
		matchNotation: function(bone) {
			var result = (this.ctx.query.isModule(bone) && this.ctx.query.isCreated(bone) && !this.ctx.query.isReady(bone));
			if(result) return ReadyProcessor.__super__.matchNotation.apply(this, [bone, this.notationRE]);
			return false;
		},

		/**
		*	Handler when a module $ready depends on a bone of '$module' type in order to execute
		*	@public
		*	@method handleDependency
		*	@param id {Object} current bone id
		*	@param bone {Object} current bone to evaluate
		*	@return Object
		**/
		handleDependency: function(bone, id) {
			//console.log('Ready.handleDependency: ', bone, id);
		},

		/**
		*	Handles specifc notation with the current processor.
		*	FIXME: Continue working here...
		*	@public
		*	@method handleNotation
		*	@param bone {Object} current bone to evaluate
		*	@param id {Object} current bone id
		*	@return Boolean
		**/
		handleNotation: function(bone, id) {
			var result = this.matchNotation(bone);
			//console.log(bone, result);
			// if(result) {
			// 	console.log(id);
			// }
			return result;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@param [bone] {Object} Bone context in which the execution will be narrowed down
		*	@param [id] {Object} Bone Id of the context
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
		**/
		execute: function(bone, id) {
			var result = ReadyProcessor.__super__.execute.call(this, this.handleNotation, bone, id);
			this.ctx.trigger(Context.EVENTS.ready, result);
			this.ctx.trigger(Context.EVENTS.processed, { type: ReadyProcessor.NAME });
			return this;
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
