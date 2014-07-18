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
		*	Create RegExp used by this processor
		*	@private
		*	@method _regexp
		*	@return RegExp
		**/
		_regexp: function() {
			return new RegExp('\\' + Context.PREFIX + '(' + this.notations.join('|') + ')$', 'i');
		},

		/**
		*	Handles specifc notation with the current processor.
		*	@public
		*	@method handleNotation
		*	@param bone {Object} current bone to evaluate
		*	@param id {Object} current bone id
		*	@param parentRef {Object} parent bone ref
		*	@return Boolean
		*	@Note Once CreateProcessor finished their job, evaluates the presence of $ready notation.
		**/
		handleNotation: function(bone, id, parentRef) {
			if(this.ctx.query.isCreated(bone)) {
				console.log('Ready -> ', id, bone);
				return true;
			}
			return false;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
		**/
		execute: function() {
			this.ctx.notify(ReadyProcessor.EVENTS.ready, this.ctx.query.findBonesBy(_.bind(this.handleNotation, this)));
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
