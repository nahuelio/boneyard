/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/context',
		'util/error/types/context-exception'], function(Spinal, Context, ContextException) {

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
		*	@property context
		*	@type {com.spinal.ioc.Context}
		**/
		context: null,

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
			this.context = opts.context;
			return this;
		},

		/**
		*	Validate notation for the current context or processor
		*	@private
		*	@method _valid
		*	@param notation {String} Notation name
		*	@return Boolean
		**/
		_valid: function(notation) {
			return !(!notation || !_.isString(notation) || notation === '' || !_.contains(this.notations, notation));
		},

		/**
		*	Perform a look up for an specific notation in the current context.
		*	If a bone is specified as a extra argument, it will narrow the search down to the specific bone context.
		*	If no notations are found, it returns null.
		*	@public
		*	@method findNotations
		*	@param notation {String} Notation name
		*	@param [bone] {Object} Optional Bone context in which the lookup will be narrowed down
		*	@return Array
		**/
		findNotations: function(notation, bone) {
			if(!this.context.spec || !_.isObject(this.context.spec) || !this._valid.apply(this, notation)) return null;
			return _.find((bone) ? bone : this.context.spec, function(bone, id) {
				return (id === (Context.PREFIX + notation));
			}, this);
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
			args.unshift((bone) ? bone : this.context.spec);
			return _.filter.apply(this, args);
		},

		/**
		*	Perform a look up of bones by type passed as parameter.
		*	@public
		*	@method findBonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		findBonesByType: function(type) {
			return this.findBonesBy(function(bone, id) {
				var module = this.findNotations('module', bone);
				return (module.length > 0) ?
					(module[Context.PREFIX + 'module'] === type) :
					(bone instanceof type);
			});
		},

		/**
		*	Perform a look up by bone id passed as parameter
		*	@public
		*	@method findBoneById
		*	@param id {String} bone id
		*	@return Object
		**/
		findBoneById: function(id) {
			return _.find(this.context.spec, function(bone, boneId) {
				return (boneId === id);
			}, this);
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
