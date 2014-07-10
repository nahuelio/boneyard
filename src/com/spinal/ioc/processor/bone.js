/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/context'], function(Spinal, Context) {

	/**
	*	BaseClass Bone Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.IoCProcessor
	**/
	var BoneProcessor = Spinal.namespace('com.spinal.ioc.processor.BoneProcessor', Spinal.SpinalClass.inherit({

		/**
		*	Context Reference
		*	@public
		*	@property ctx
		*	@type {com.spinal.ioc.Context}
		**/
		ctx: null,

		/**
		*	Supported Notations
		*	@public
		*	@property notations
		*	@type Array
		**/
		notations: ['bone'],

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param ctx {com.spinal.ioc.Context} Context Reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		initialize: function(ctx) {
			this.ctx = (!ctx) ? throw new ContextException('UndefinedContext') : ctx;
			this.notationRE = new RegExp('/\\' + Context.PREFIX + '(' + this.notations.join('|') + ')/');
			return this;
		},

		/**
		*	Checks if the bone was succesufuly created
		*	@public
		*	@method isCreated
		*	@param id {String} bone id
		*	@return Boolean
		**/
		isCreated: function(id) {
			if(!id) return false;
			var b = this.ctx.query.findBoneById(id);
			return (b && b._$created);
		},

		/**
		*	Checks if the bone completed the ready phase
		*	@public
		*	@method isReady
		*	@param id {String} bone id
		*	@return Boolean
		**/
		isReady: function(id) {
			if(!id) return false;
			var b = this.ctx.query.findBoneById(id);
			return (b && b._$ready);
		},

		/**
		*	Handles specifc notation with the current processor.
		*	@public
		*	@method handleNotation
		*	@param bone {Object} current bone to evaluate
		*	@return Object
		**/
		handleNotation: function(id, bone) {
			return (!this.notationRE.test(id));
		},

		/**
		*	Filters out and call the predicate function over the notations supported by the processor
		*	@public
		*	@method execute
		*	@param predicate {Function} predicate function being call when notation correspond to the processor
		*	@return Array
		**/
		execute: function(predicate) {
			if(!predicate || !_.isFunction(predicate)) return [];
			var bones = _.filter(this.context.spec, function(bone, id) {
				return predicate(id, bone);
			}, this);
			return bones;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneProcessor',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event created
			**/
			created: 'com:spinal:ioc:context:bone:created',
			/**
			*	@event ready
			**/
			ready: 'com:spinal:ioc:context:bone:ready'
		}

	}));

	return BoneProcessor;

});
