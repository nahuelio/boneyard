/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'util/error/types/context-exception'], function(Context, ContextException) {

	/**
	*	Bone Query Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.BoneQuery
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.util.error.types.ContextException
	**/
	var BoneQuery = Spinal.namespace('com.spinal.ioc.BoneQuery', Spinal.SpinalClass.inherit({

		/**
		*	Context Reference
		*	@public
		*	@property ctx
		*	@type {com.spinal.ioc.Context}
		**/
		ctx: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param [opts] {Object} Initial Options
		*	@return {com.spinal.ioc.BoneQuery}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			if(!opts.context) throw new ContextException('UndefinedContext');
			this.ctx = opts.context;
			return this;
		},

		/**
		*	Perform a look up of bones by a predicate passed as parameter.
		*	If a bone is specified as a extra argument, it will narrow the search down to the specific bone context.
		*	@public
		*	@method findBonesBy
		*	@param finder {Function} predicate evaluation
		*	@param [bone] {Object} Optional Bone context in which the lookup will be narrowed down
		*	@return Array
		**/
		findBonesBy: function(finder, bone) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift((bone) ? bone : this.ctx.spec);
			return _.filter.apply(this, args);
		},

		/**
		*	Perform a look up of bones by type passed as parameter.
		*	@public
		*	@method findBonesByType
		*	@param type {String} bone type
		*	@param [bone] {Object} Optional Bone context in which the lookup will be narrowed down
		*	@return Array
		**/
		findBonesByType: function(type, bone) {
			return this.findBonesBy(function(b, i) { return (b instanceof type); }, bone);
		},

		/**
		*	Perform a look up by bone id passed as parameter
		*	@public
		*	@method findBoneById
		*	@param id {String} bone id
		*	@return Object
		**/
		findBoneById: function(id) {
			return (this.ctx.spec[id]) ? this.ctx.spec[id] : null;
		},

		/**
		*	Checks if the bone defined was declared as a module.
		*	@public
		*	@method isModule
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isModule: function(bone) {
			return (bone && bone.$module);
		},

		/**
		*	Checks if the bone was succesufuly created
		*	@public
		*	@method isCreated
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isCreated: function(bone) {
			return (bone && bone._$created);
		},

		/**
		*	Checks if the bone completed the ready phase
		*	@public
		*	@method isReady
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isReady: function(bone) {
			return (bone && bone._$ready);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneQuery'

	}));

	return BoneQuery;

});
