/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Class Query
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.Query
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.SpinalClass
	**/
	var Query = Spinal.namespace('com.spinal.ioc.engine.helpers.Query', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.ioc.engine.helpers.Query
		**/
		initialize: function() {
			return Query.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Perform a spec look up by a given id
		*	@public
		*	@method getSpec
		*	@param id {String} spec id
		*	@return Object
		**/
		getSpec: function(id) {
			return this.find(function(spec) { return (spec.$id === id); });
		},

		/**
		*	Filters out specs by predicate
		*	@public
		*	@method getSpecsBy
		*	@param finder {Function} predicate evaluation
		*	@return Array
		**/
		getSpecsBy: function(finder) {
			return this.findBy(finder);
		},

		/**
		*	Retrieves all specs
		*	@public
		*	@method getAllSpecs
		*	@param onlyBones {Boolean} skipping annotations
		*	@return Array
		**/
		getAllSpecs: function(onlyBones) {
			return (onlyBones) ?
				_.flatten(_.map(this.collection, function(spec) { return _.omit(spec, '$id', '$specs', '$plugins') })) :
				this.collection;
		},

		/**
		*	Retrieves all bones of all specs
		*	@public
		*	@method getAllBones
		*	@return Array
		**/
		getAllBones: function() {
			var allSpecs = this.getAllSpecs(true);
			return _.reduce(allSpecs, function(prev, curr) { return _.extend(prev, curr); }, allSpecs[0]);
		},

		/**
		*	Retrieves raw bone or an instance of a bone
		*	@public
		*	@method get
		*	@param bone {Object} bone reference
		*	@return Object
		**/
		get: function(bone) {
			return (this.isModule(bone) && this.isCreated(bone)) ? bone._$created : bone;
		},

		/**
		*	Perform a bone look up by bone id
		*	@static
		*	@method getBone
		*	@param id {String} bone id
		*	@param [context] {Object} spec reference
		*	@return Object
		**/
		getBone: function(id, context) {
			context = (context) ? context : this.getAllBones();
			return this.get(_.find(context, function(bone) { return (bone.id === id); }));
		},

		/**
		*	Filters out bones on each spec by a predicate.
		*	If context is passed, this method will limit the look up on the given spec.
		*	@static
		*	@method getBonesBy
		*	@param finder {Function} predicate evaluation
		*	@param [context] {Object} spec reference
		*	@return Array
		**/
		getBonesBy: function(finder, context) {
			context = (context) ? context : this.getAllBones();
			return _.filter(context, function(bone) { return (finder(bone = this.get(bone))) ? bone  : null; });
		},

		/**
		*	Perform a look up of bones by className passed as parameter.
		*	If context is passed, this method will limit the look up on the given spec.
		*	@static
		*	@method findBonesByClass
		*	@param className {String} bone class name
		*	@param [context] {Object} spec reference
		*	@return Array
		**/
		getBonesByClass: function(className, context) {
			return this.getBonesBy(function(bone) { return (bone.constructor.NAME === className); }, context);
		},

		/**
		*	Perform a look up of bones by type passed as parameter.
		*	If context is passed, this method will limit the look up on the given spec.
		*	@static
		*	@method getBonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		getBonesByType: function(type, context) {
			return this.getBonesBy(function(bone) { return (bone instanceof type); }, context);
		},

		/**
		*	Retrieves plugins found inside all specs
		*	@public
		*	@method getPlugins
		*	@param [context] {Object} spec reference
		*	@return Object
		**/
		getPlugins: function(context) {
			return this.getBonesBy(function(bone) { return _.defined(bone.$plugin); }, context);
		},

		/**
		*	Checks if the bone defined was declared as a module.
		*	@static
		*	@method isModule
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isModule: function(bone) {
			return _.defined(bone.$module);
		},

		/**
		*	Checks if the bone was succesfully created
		*	@static
		*	@method isCreated
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isCreated: function(bone) {
			return _.defined(bone._$created);
		},

		/**
		*	Check if the bone is an instance of a Backbone class
		*	@public
		*	@method isNative
		*	@param bone {Object} bone reference
		*	@return Boolean
		**/
		isNative: function(bone) {
			if(!_.defined(bone)) return false;
			return (bone instanceof Backbone.Model ||
				bone instanceof Backbone.Collection ||
				bone instanceof Backbone.View ||
				bone instanceof Backbone.Router);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Query',

		/**
		*	Static constructor
		*	@static
		*	@method new
		*	@return com.spinal.ioc.engine.helpers.Query
		**/
		new: function() {
			return new Query();
		}

	}));

	return Query;

});
