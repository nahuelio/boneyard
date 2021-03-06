/**
*	@module com.boneyard.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/injector',
	'util/object'], function(Injector, ObjectUtil) {

	/**
	*	Class Annotation
	*	@namespace com.boneyard.ioc.engine.annotation
	*	@class com.boneyard.ioc.engine.annotation.Annotation
	*	@extends com.boneyard.core.Boneyard.Class
	*
	*	@requires com.boneyard.ioc.engine.helpers.Injector
	*	@requires com.boneyard.util.adt.Collection
	*	@requires com.boneyard.util.ObjectUtil
	**/
	var Annotation = Boneyard.namespace('com.boneyard.ioc.engine.annotation.Annotation', Boneyard.Class.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} annotation attributes
		*	@return com.boneyard.ioc.engine.annotation.Annotation
		**/
		initialize: function(attrs) {
			this.valid(attrs);
			_.extend(this, { _id: _.keys(attrs)[0], _value: _.values(attrs)[0] });
			this.injector = new Injector(this);
			return Annotation.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves Engine unique instance from context
		*	@static
		*	@method getEngine
		*	@return com.boneyard.ioc.engine.Engine
		**/
		getEngine: function() {
			return (!Annotation.engine) ? (Annotation.engine = require('ioc/context').engine) : Annotation.engine;
		},

		/**
		*	Returns a reference of this Annotation
		*	@public
		*	@method get
		*	@return com.boneyard.ioc.engine.annotation.Annotation
		**/
		get: function() {
			return this;
		},

		/**
		*	Retrieves annotation id
		*	@public
		*	@method getId
		*	@return Object
		**/
		getId: function() {
			return this._id;
		},

		/**
		*	Retrieves annotation value
		*	@public
		*	@method getValue
		*	@return Object
		**/
		getValue: function() {
			return this._value;
		},

		/**
		*	Retrieves annotation's Injector
		*	@public
		*	@method getInjector
		*	@return com.boneyard.ioc.engine.helpers.Injector
		**/
		getInjector: function() {
			return this.injector;
		},

		/**
		*	Retrieves annotation's dependencies via injector
		*	@public
		*	@method getDependencies
		*	@return com.boneyard.util.adt.Collection
		**/
		getDependencies: function() {
			return this.getInjector().getDependencies();
		},

		/**
		*	Returns true if the bone has dependencies, otherwise returns false
		*	@public
		*	@method hasDependencies
		*	@return Boolean
		**/
		hasDependencies: function() {
			return !this.getDependencies().isEmpty();
		},

		/**
		*	Validates annotation
		*	@public
		*	@method valid
		*	@throws Error
		*	@param [attrs] {Object} annotation attributes
		**/
		valid: function(attrs) {
			if(!_.defined(attrs)) throw new Error('Annotation cannot be undefined');
			if(!_.isObject(attrs)) throw new Error('Annotation type must be an object');
		},

		/**
		*	Retrieves bone expression
		*	@static
		*	@method getBoneExpression
		*	@return String
		**/
		getBoneExpression: function() {
			return (Annotation.PREFIX + Annotation.TYPE + Annotation.DELIMITER);
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
		},

		/**
		*	Default Dependency create strategy
		*	@public
		*	@method createDependency
		*	@param expr {String} expression to be evaluated
		*	@param key {String} context property key used to determine where to inject expression
		*	@param context {Object} bone reference
		*	@return Object
		**/
		createDependency: function(expr, key, context) {
			if(!Annotation.isExpressionValid(expr) || !this.isBone(expr) || !context) return null;
			return { expression: expr, target: context, property: key, bone: this };
		},

		/**
		*	Default dependency gathering strategy
		*	This method uses recursion.
		*	@public
		*	@method retrieve
		*	@param [ctx] {Object} context found on nested structure
		*	@return Array
		**/
		retrieve: function(ctx) {
			ctx = (ctx) ? ctx : this.getValue();
			return _.compact(_.flatten(_.map(ctx, function(value, key, target) {
				return ((ObjectUtil.isRealObject(value) || _.isArray(value)) && !ObjectUtil.isBackbone(value)) ?
					this.retrieve(value) : this.createDependency.apply(this, arguments);
			}, this)));
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Annotation',

		/**
		*	@static
		*	@property PREFIX
		*	@type String
		**/
		PREFIX: '$',

		/**
		*	@static
		*	@property TYPE
		*	@type String
		**/
		TYPE: 'bone',

		/**
		*	@static
		*	@property DELIMITER
		*	@type String
		**/
		DELIMITER: '!',

		/**
		*	Returns true if expression matches a annotation nomenclature
		*	@static
		*	@method isExpressionValid
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isExpressionValid: function(expr) {
			return (_.defined(expr) && _.isString(expr) && expr.indexOf(Annotation.PREFIX) === 0);
		}

	}));

	return Annotation;

});
