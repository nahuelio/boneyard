/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'util/exception/context'], function(Context, ContextException) {

	/**
	*	Bone Engine Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.Engine
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.util.exception.ContextException
	**/
	var Engine = Spinal.namespace('com.spinal.ioc.Engine', Spinal.SpinalClass.inherit({

		/**
		*	Main Spec root reference
		*	@public
		*	@property root
		*	@type {Object}
		**/
		root: {},

		/**
		*	Async Module Factory
		*	@public
		*	@property factory
		*	@type {com.spinal.util.AsyncFactory}
		**/
		factory: null,

		/**
		*	Notation
		*	@public
		*	@property notation
		*	@type String
		**/
		notation: 'specs',

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param root {Object} reference to the spec root
		*	@param factory {com.spinal.util.factories.AsyncFactory} factory reference
		*	@return {com.spinal.ioc.Engine}
		**/
		initialize: function(factory) {
			if(!factory) throw new ContextException('UndefinedRootSpec');
			this.factory = factory;
			this.notation = (Engine.PREFIX + this.notation);
			return this;
		},

		/**
		*	Build specs into a single object unit suitable for querying by this class
		*	This method is also responsible to build composite spec trees by merging them
		*	into a single object to speed up querying and reducing the amount of nesting loops.
		*	@public
		*	@method build
		*	@param bone {Object} current bone or sub spec
		*	@return {com.spinal.ioc.Engine}
		**/
		build: function(bone) {
			if(!_.isObject(bone)) throw new ContextException('InvalidSpecFormat');
			_.extend(this.root, _.omit(bone, this.notation));
			if(bone[this.notation]) this.invoke('build', bone[this.notation]);
			return this;
		},

		/**
		*	Perform a look up of bones by a predicate passed as parameter.
		*	If a bone is specified as a extra argument, it will narrow the search down to the specific bone context.
		*	@public
		*	@method getBonesBy
		*	@param finder {Function} predicate evaluation
		*	@param [bone] {Object} Optional Bone context in which the lookup will be narrowed down
		*	@return Array
		**/
		getBonesBy: function(finder, bone) {
			if(!this.root) return [];
			var args = Array.prototype.slice.call(arguments);
			args.unshift((bone) ? bone : this.root);
			return _.filter.apply(this, args);
		},

		/**
		*	Perform a bone look up by id.
		*	If the bone is a module and it was already created, this method will return the instance of the bone.
		*	@public
		*	@method getBone
		*	@param id {String} bone id
		*	@return Object
		**/
		getBone: function(id) {
			return (this.root && this.root[id]) ?
				((this.isCreated(this.root[id])) ? this.root[id]._$created : this.root[id]) : null;
		},

		/**
		*	Perform a look up of bones by type passed as parameter.
		*	In order to use this method, the context must be completly initialized.
		*	@public
		*	@method getBonesByType
		*	@param type {String} bone type
		*	@param [bone] {Object} Optional Bone context in which the lookup will be narrowed down
		*	@return Array
		**/
		getBonesByType: function(type, bone) {
			return this.getBonesBy(_.bind(function(b, i) {
				return (this.isReady(b) && b instanceof type);
			}, this), bone);
		},

		/**
		*	Perform a look up of bones by className passed as parameter.
		*	In order to use this method, the context must be completly initialized.
		*	@public
		*	@method findBonesByType
		*	@param type {String} bone type
		*	@param [bone] {Object} Optional Bone context in which the lookup will be narrowed down
		*	@return Array
		**/
		getBonesByClass: function(className, bone) {
			return this.getBonesBy(_.bind(function(b, i) {
				return (this.isModule(b) && this.isReady(b) && b._$created.constructor.NAME === className);
			}, this), bone);
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
		NAME: 'Engine',

		/**
		*	@static
		*	@property PREFIX
		*	@type String
		**/
		PREFIX: '$'

	}));

	return Engine;

});
