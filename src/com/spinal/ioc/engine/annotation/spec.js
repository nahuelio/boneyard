/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation',
	'ioc/engine/annotation/bone',
	'ioc/engine/annotation/ready'], function(Annotation, Bone, Ready) {

	/**
	*	Class Spec
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Spec
	*	@extends com.spinal.ioc.engine.annotation.Annotation
	*
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	*	@requires com.spinal.ioc.engine.annotation.Bone
	*	@requires com.spinal.ioc.engine.annotation.Ready
	**/
	var Spec = Spinal.namespace('com.spinal.ioc.engine.annotation.Spec', Annotation.inherit({

		/**
		*	Bones collection
		*	@public
		*	@property bones
		*	@type com.spinal.util.adt.Collection
		**/
		bones: new Collection([], { interface: Bone }),

		/**
		*	Ready operation collection
		*	@public
		*	@property ready
		*	@type com.spinal.util.adt.Collection
		**/
		ready: new Collection([], { interface: Ready }),

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
			_.extend(this, StringUtil.toPrivate(_.pick(attrs, '$id', '$specs', '$plugins')));
			return this.parse();
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
			if(_.defined(attrs.$specs) || !_.isArray(attrs.$specs)) throw new Error('Spec $specs annotation must an array');
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
		*	Retrieves a $plugins annotation if found
		*	@public
		*	@method getPlugins
		*	@return Object
		**/
		getPlugins: function() {
			return this._$plugins;
		}

		/**
		*	Default Bone's Annotation parsing strategy
		*	@public
		*	@method parse
		*	@return com.spinal.ioc.engine.annotation.Spec
		**/
		parse: function() {

		},

		/**
		*	Adds a new bone annotation inside bones collection
		*	@public
		*	@chainable
		*	@method addBone
		*	@param bone {Object} bone reference
		*	@return com.spinal.ioc.engine.annotation.Spec
		**/
		addBone: function(bone) {
			this.bones.add(bone);
			return this;
		},

		/**
		*	Removes an existing bone annotation from bones collection
		*	@public
		*	@chainable
		*	@method removeBone
		*	@param bone {Object} bone reference
		*	@return com.spinal.ioc.engine.annotation.Spec
		**/
		removeBone: function(bone) {
			this.bones.remove(bone);
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
			return this.bones.find(function(bone) { return (bone.get().getId() === id); });
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
		*	@param clazz {String} bone class
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
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Spec'

	}));

});
