/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation',
	'util/object'], function(Annotation, ObjectUtil) {

	/**
	*	Class Bone
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Bone
	*	@extends com.spinal.ioc.engine.annotation.Annotation
	*
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	*	@requires com.spinal.util.ObjectUtil
	**/
	var Bone = Spinal.namespace('com.spinal.ioc.engine.annotation.Bone', Annotation.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} attributes
		*	@return com.spinal.ioc.engine.annotation.Bone
		**/
		initialize: function(attrs) {
			return Bone.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves annotation module path
		*	@public
		*	@method getPath
		*	@return String
		**/
		getPath: function() {
			return this.isModule() ? this.getValue().$module : null;
		},

		/**
		*	Retrieves annotation module params if exists, otherwise returns bone's value
		*	@public
		*	@method getParams
		*	@return Object
		**/
		getParams: function() {
			return ObjectUtil.isRealObject(this.getValue()) ? this.getValue().$params : this.getValue();
		},

		/**
		*	Retrieves bone expression
		*	@static
		*	@method getBoneExpression
		*	@return String
		**/
		getBoneExpression: function() {
			return (Annotation.PREFIX + Bone.TYPE + Bone.DELIMITER);
		},

		/**
		*	Determines and retrieves annotation bone module instance.
		*	@public
		*	@method bone
		*	@return Object
		**/
		bone: function() {
			return (this.isModule() && this.isCreated()) ? this._$created : null;
		},

		/**
		*	Create Dependency
		*	@public
		*	@override
		*	@method create
		*	@param expr {String} expression to be evaluated
		*	@param key {String} context property key used to determine where to inject expression
		*	@param context {Object} bone reference
		*	@return Object
		**/
		create: function(expr, key, context) {
			if(!(dependency = Bone.__super__.create.apply(this, arguments)) || !this.isBone(expr)) return null;
			return dependency;
		},

		/**
		*	Dependency gathering on this annotation
		*	This method uses recursion.
		*	@public
		*	@override
		*	@method retrieve
		*	@param [ctx] {Object} context found on nested structure
		*	@return Array
		**/
		retrieve: function(ctx) {
			return Bone.__super__.retrieve.call(this, _.defined(ctx) ? ctx : this.getParams());
		},

		/**
		*	Checks if this annotation is a module
		*	@static
		*	@method isModule
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isModule: function() {
			return !ObjectUtil.isBackbone(this.getValue()) && _.defined(this.getPath());
		},

		/**
		*	Checks if this annotation was succesfully created
		*	@static
		*	@method isCreated
		*	@return Boolean
		**/
		isCreated: function() {
			return _.defined(this._$created);
		},

		/**
		*	Returns true if expression matches a bone nomenclature
		*	@static
		*	@method isBone
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isBone: function(expr) {
			return (expr.indexOf(this.getBoneExpression()) === 0);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Bone',

		/**
		*	@static
		*	@property DELIMITER
		*	@type String
		**/
		DELIMITER: '!',

		/**
		*	@static
		*	@property TYPE
		*	@type String
		**/
		TYPE: 'bone',

		/**
		*	Gather bones from a given spec
		*	@static
		*	@method only
		*	@param spec {Object} spec reference
		*	@return	Array
		**/
		only: function(spec) {
			return _.pick(spec, function(v, k) { return (k.indexOf(Bone.PREFIX) === -1); });
		}

	}));

	return Bone;

});
