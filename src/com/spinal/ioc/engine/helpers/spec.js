/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/bone',
	'ioc/engine/annotation/action',
	'util/adt/collection',
	'util/string',
	'util/object'], function(Bone, Action, Collection, StringUtil, ObjectUtil) {

	/**
	*	Class Spec
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Spec
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.annotation.Bone
	*	@requires com.spinal.ioc.engine.annotation.Action
	*	@requires com.spinal.util.adt.Collection
	*	@requires com.spinal.util.StringUtil
	*	@requires com.spinal.util.ObjectUtil
	**/
	var Spec = Spinal.namespace('com.spinal.ioc.engine.annotation.Spec', Spinal.SpinalClass.inherit({

		/**
		*	Bones collection
		*	@public
		*	@property bones
		*	@type com.spinal.util.adt.Collection
		**/
		bones: null,

		/**
		*	Actions collection
		*	@public
		*	@property actions
		*	@type com.spinal.util.adt.Collection
		**/
		actions: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param attrs {Object} annotation attributes
		*	@return com.spinal.ioc.engine.annotation.Spec
		**/
		initialize: function(attrs) {
			Spec.__super__.initialize.apply(this, arguments);
			this.valid(attrs);
			_.extend(this, StringUtil.toPrivate(Spec.only(attrs)));
			this.bones = new Collection(null, { interface: Bone });
			this.actions = new Collection(null, { interface: Action });
			return this.parse(attrs);
		},

		/**
		*	Validates annotation
		*	@public
		*	@override
		*	@method valid
		*	@throws Error
		*	@param [attrs] {Object} annotation attributes
		**/
		valid: function(attrs) {
			if(!_.defined(attrs)) throw new Error('Spec attributes cannot be null or undefined');
			if(!_.defined(attrs.$id) || attrs.$id === '') throw new Error('Spec Annotation $id cannot be null or empty');
			if(_.defined(attrs.$specs) && !_.isArray(attrs.$specs)) throw new Error('Spec $specs annotation must be an array');
		},

		/**
		*	Retrieves annotation id
		*	@public
		*	@method getId
		*	@return String
		**/
		getId: function() {
			return this._$id;
		},

		/**
		*	Retrieves dependent specs if found
		*	@public
		*	@method getSpecs
		*	@return Array
		**/
		getSpecs: function() {
			return this._$specs;
		},

		/**
		*	Default Bone annotations parsing strategy
		*	@public
		*	@method parse
		*	@param spec {Object} spec reference
		*	@return com.spinal.ioc.engine.annotation.Spec
		**/
		parse: function(spec) {
			this.bones.set(ObjectUtil.objToArr(Bone.only(spec)), { silent: true });
			this.actions.set(Action.only(spec).$actions, { silent: true });
			return this;
		},

		/**
		*	Perform a bone look up by bone id
		*	@static
		*	@method getBone
		*	@param id {String} bone id
		*	@return Object
		**/
		getBone: function(id) {
			var bone = this.bones.find(function(bone) { return (bone.getId() === id); });
			return (bone) ? bone.get() : null;
		},

		/**
		*	Filters out bones on each spec by a predicate.
		*	@static
		*	@method getBonesBy
		*	@param finder {Function} predicate evaluation
		*	@return Array
		**/
		getBonesBy: function(finder) {
			return this.bones.findBy(function(bone) { return finder(bone.get()); });
		},

		/**
		*	Perform a look up of bones by className passed as parameter.
		*	@static
		*	@method findBonesByClass
		*	@param clazz {Function} bone constructor function
		*	@return Array
		**/
		getBonesByClass: function(clazz) {
			return this.getBonesBy(function(bone) { return (bone.bone() instanceof clazz); });
		},

		/**
		*	Perform a look up of bones by type passed as parameter.
		*	@static
		*	@method getBonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		getBonesByType: function(type) {
			return this.getBonesBy(function(bone) {
				return (Object.prototype.toString.call(bone.bone()).indexOf(type) !== -1);
			});
		},

		/**
		*	Returns true if this specs has dependencies on other specs, otherwise returns false
		*	@public
		*	@method hasSpecs
		*	@return Boolean
		**/
		hasSpecs: function() {
			return (this.getSpecs() && this.getSpecs().length > 0);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Spec',

		/**
		*	Gather spec metadata from a given spec
		*	@static
		*	@method only
		*	@param spec {Object} spec reference
		*	@return	Array
		**/
		only: function(spec) {
			return _.pick(spec, '$id', '$specs');
		}

	}));

	return Spec;

});
