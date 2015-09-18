/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/injector',
	'ioc/engine/helpers/dependency',
	'util/adt/collection'], function(Injector, Dependency, Collection) {

	/**
	*	Class Annotation
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Annotation
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.helpers.Injector
	*	@requires com.spinal.ioc.engine.helpers.Dependency
	*	@requires com.spinal.util.adt.Collection
	**/
	var Annotation = Spinal.namespace('com.spinal.ioc.engine.annotation.Annotation', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} annotation attributes
		*	@return com.spinal.ioc.engine.annotation.Annotation
		**/
		initialize: function(attrs) {
			attrs || (attrs = {});
			this.valid(attrs);
			this.dependencies = new Collection(null, { interface: Dependency });
			return Annotation.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves dependencies
		*	@public
		*	@method getDependencies
		*	@return com.spinal.util.adt.Collection
		**/
		getDependencies: function() {
			return this.dependencies;
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
		*	Create Dependency
		*	@public
		*	@method create
		*	@param expr {String} expression to be evaluated
		*	@param key {String} context property key used to determine where to inject expression
		*	@param context {Object} bone reference
		*	@return Object
		**/
		create: function(expr, key, context) {
			if(!this.isAnnotation(expr) || !context) return null;
			return { expression: expr, target: context, property: key, injector: new Injector(this) };
		},

		/**
		*	Dependency gathering on this annotation
		*	This method uses recursion.
		*	@public
		*	@method retrieve
		*	@param [context] {Object} context found on nested structure
		*	@return Array
		**/
		retrieve: function(context) {
			if(!context) return [];
			return _.compact(_.flatten(_.map(context, function(value, key, target) {
				if(this.isNativeObject(value) && !this.isNative(value)) return this.retrieve(value);
				return this.create.apply(this, arguments);
			}, this)));
		},

		/**
		*	Returns true if expression matches a annotation nomenclature
		*	@public
		*	@method isAnnotation
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isAnnotation: function(expr) {
			return (_.defined(expr) && _.isString(expr) && expr.indexOf(Annotation.PREFIX) === 0);
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
		PREFIX: '$'

	}));

	return Annotation;

});
