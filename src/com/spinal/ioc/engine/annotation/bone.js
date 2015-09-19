/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation',
	'ioc/engine/helpers/injector',
	'util/object'], function(Annotation, Injector, ObjectUtil) {

	/**
	*	Class Bone
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Bone
	*	@extends com.spinal.ioc.engine.annotation.Annotation
	*
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	*	@requires com.spinal.ioc.engine.helpers.Injector
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
			Bone.__super__.initialize.apply(this, arguments);
			this.getDependencies().set(this.retrieve(), { silent: true });
			return this;
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
			if(Bone.__super__.create.apply(this, arguments) && !Bone.isBone(expr)) return null;
			return { expression: expr, target: context, property: key, injector: new Injector(this) };
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
			return !ObjectUtil.isBackbone(this.getValue()) && _.defined(this.getModule());
		},

		/**
		*	Checks if this annotation was succesfully created
		*	@static
		*	@method isCreated
		*	@return Boolean
		**/
		isCreated: function() {
			return _.defined(this._$created);
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
		*	Returns true if expression matches a bone nomenclature
		*	@static
		*	@method isBone
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isBone: function(expr) {
			return (expr.indexOf(Annotation.PREFIX + Bone.TYPE + Bone.DELIMITER) === 0);
		}

	}));

	return Bone;

});
