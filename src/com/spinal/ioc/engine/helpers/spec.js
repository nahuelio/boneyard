/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/bone',
	'ioc/engine/annotation/ready',
	'util/adt/collection',
	'util/string',
	'util/object'], function(Bone, Ready, Collection, StringUtil, ObjectUtil) {

	/**
	*	Class Spec
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Spec
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.annotation.Bone
	*	@requires com.spinal.ioc.engine.annotation.Ready
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
		bones: new Collection(null, { interface: Bone }),

		/**
		*	Ready operation collection
		*	@public
		*	@property operations
		*	@type com.spinal.util.adt.Collection
		**/
		operations: new Collection(null, { interface: Ready }),

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} annotation attributes
		*	@return com.spinal.ioc.engine.annotation.Spec
		**/
		initialize: function(attrs) {
			attrs || (attrs = {});
			Spec.__super__.initialize.apply(this, arguments);
			_.extend(this, StringUtil.toPrivate(Spec.only(attrs)));
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
			Spec.__super__.valid.apply(this, arguments);
			if(!_.defined(attrs.$id) || attrs.$id === '') throw new Error('Spec Annotation $id cannot be null or empty');
			if(_.defined(attrs.$specs) || !_.isArray(attrs.$specs)) throw new Error('Spec $specs annotation must be an array');
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
		*	@method getDependencies
		*	@return Array
		**/
		getDependencies: function() {
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
			this.operations.set(Ready.only(spec), { silent: true });
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
			return this.getBonesBy(function(bone) { return (bone.get() instanceof clazz); });
		},

		/**
		*	Perform a look up of bones by type passed as parameter.
		*	@static
		*	@method getBonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		getBonesByType: function(type) {
			return this.getBonesBy(function(bone) { return (typeof(bone.get()) === type); });
		},

		/**
		*	Returns true if this specs has dependencies on other specs, otherwise returns false
		*	@public
		*	@method hasDependencies
		*	@return Boolean
		**/
		hasDependencies: function() {
			return (this.getDependencies() && this.getDependencies().length > 0);
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
