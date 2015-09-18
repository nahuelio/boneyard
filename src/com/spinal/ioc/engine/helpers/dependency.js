/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/exception/ioc/dependency'], function(DependencyException) {

	/**
	*	Class Dependency
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.Dependency
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.util.exception.ioc.DependencyException
	**/
	var Dependency = Spinal.namespace('com.spinal.ioc.engine.helpers.Dependency', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param attrs {Object} attributes
		*	@return com.spinal.ioc.engine.helpers.Dependency
		**/
		initialize: function(attrs) {
			attrs || (attrs = {});
			this.valid(attrs);
			Dependency.__super__.initialize.apply(this, arguments);
			return _.extend(this, attrs);
		},

		/**
		*	Validate constructor parameters
		*	@public
		*	@throws Error
		*	@method valid
		*	@param attrs {Object} attributes
		**/
		valid: function(attrs) {
			if(!attrs.target || !_.isObject(attrs.target)) throw new DependencyException('TargetRequired');
			if(!attrs.property || !_.isString(attrs.property)) throw new DependencyException('PropertyRequired');
			if(!attrs.injector) throw new DependencyException('InjectorRequired');
			if(!attrs.target[attrs.property]) throw new DependencyException('UndefinedTargetProperty');
		},

		/**
		*	Default Injection strategy
		*	@public
		*	@method inject
		*	@param engine
		**/
		resolve: function() {
			return this.injector.inject(this);
		},

		/**
		*	Extracts dependency id from dependency expression
		*	@public
		*	@method getId
		*	@return String
		**/
		getId: function() {
			var expr = this.getExpression(), pos = expr.indexOf(this.injector.getAnnotationMatcher());
			return (pos !== -1) ? expr.substring((pos + 1), expr.length) : null;
		},

		/**
		*	Extracts Compound Dependency from dependency expression if exist
		*	@public
		*	@method getCompound
		*	@return Object
		**/
		getCompound: function() {
			if(!(id = this.getId())) return null;
			var compound = id.split('.');
			return (compound.length > 1) ? { id: compound[0], method: [0] } : id;
		},

		/**
		*	Retrieves dependency expression
		*	@public
		*	@method getExpression
		*	@return String
		**/
		getExpression: function() {
			return this.expression;
		},

		/**
		*	Retrieves dependency target
		*	@public
		*	@method getTarget
		*	@return Object
		**/
		getTarget: function() {
			return this.target;
		},

		/**
		*	Retrieves dependency target property
		*	@public
		*	@method getProperty
		*	@return String
		**/
		getProperty: function() {
			return this.property;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Dependency'

	}));

	return Dependency;

});
