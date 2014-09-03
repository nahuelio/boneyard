/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'ioc/processor/bone'], function(Context, BoneProcessor) {

	/**
	*	Defines a processor that acts as a wrapper to trigger plugins functionality
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.PluginProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var PluginProcessor = Spinal.namespace('com.spinal.ioc.processor.PluginProcessor', BoneProcessor.inherit({

		/**
		*	Supported Notation Regular Expression
		*	@public
		*	@property notationRE
		*	@type RegExp
		**/
		notationRE: new RegExp('\\' + Context.PREFIX + '(plugins)$', 'i'),

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
		*	Handles specifc notation with the current processor.
		*	@public
		*	@method handleNotation
		*	@param bone {Object} current bone to evaluate
		*	@param id {Object} current bone id
		*	@return Boolean
		*	@Note TODO: Implement Plugin job... For now just remove it from the spec/
		**/
		handleNotation: function(bone, id) {
			var b = this.matchNotation(id, this.notationRE);
			if(b) {
				delete this.ctx.spec[id];
				return true;
			}
			return false;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			this.ctx.trigger(Context.EVENTS.plugin, this.ctx.query.findBonesBy(_.bind(this.handleNotation, this)));
			this.ctx.trigger(Context.EVENTS.processed, { type: PluginProcessor.NAME });
			return this;
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
