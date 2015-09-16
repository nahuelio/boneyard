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
	var	Annotation = Spinal.namespace('com.spinal.ioc.engine.annotation.Annotation', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} annotation attributes
		*	@return com.spinal.ioc.engine.annotation.Annotation
		**/
		initialize: function(attrs) {
			attrs || (attrs = {});
			this.valid.apply(this, arguments);
			this.dependencies = new Collection(this.retrieve(), { interface: Dependency });
			return Annotation.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Validates annotation
		*	@public
		*	@method valid
		*	@throws Error
		*	@param [attrs] {Object} annotation attributes
		**/
		valid: function(attrs) {
			if(!attrs) throw new Error('Annotation cannot be undefined');
			if(!_.isObject(attrs)) throw new Error('Annotation type must be an object');
		},

		/**
		*	Standard Injection resolution
		*	@public
		*	@method resolve
		*	@param expr {String} expression used for resolve direct references
		*	@param key {String} property key of parent one used to extract dependency.
		*	@param context {Object} parent bone reference
		*	@return Object
		**/
		resolve: function(expr, key, context) {
			if(!_.defined(expr) || !parent) return null;
			if(!this.isAnnotation(expr)) return expr;
			// FIXME: Review this one, move isModuleDependency and getDependency to injector???
			if(!this.isModuleDependency(expr)) return (parent[key] = this.getDependency(expr).bone);
			return null;
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
			if(!(context = this.getParams(context)) return [];
			return _.compact(_.flatten(_.map(context, function(value, key, target) {
				if(_.isArray(value) || _.isObject(value)) return this.retrieve(target);
				// FIXME: bone.getDependencyId(value)
				return { dependencyId: , target: target, property: key };
			}, this)));
		},

		/**
		*	Retrieves dependencies
		*	@public
		*	@method getDependencies
		*	@return Array
		**/
		getDependencies: function() {
			return this.dependencies;
		},

		/**
		*	Returns true if expression matches a annotation nomenclature
		*	@public
		*	@method isAnnotation
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isAnnotation: function(expr) {
			if(!expr || !_.isString(expr) || expr.indexOf(Annotation.PREFIX) !== 0) return false;
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
		*	Create a new Injector instance by optionally passing arguments to the constructor
		*	@static
		*	@throws Error
		*	@method newInjector
		*	@param annotation {com.spinal.ioc.engine.annotation.Annotation} annotation reference
		*	@return com.spinal.ioc.engine.helpers.Injector
		**/
		newInjector: function(annotation) {
			if(!annotation || !(annotation instanceof Annotation))
				throw new Error('Parameter being pass to the Injector was null or not an instance of Annotation');
			return Injector.new.apply(Array.prototype.slice.call(this, arguments));
		}

	}));

	return Annotation;

});
