/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/string',
	'util/exception/ioc/dependency'], function(StringUtil, DependencyException) {

	/**
	*	Class Dependency
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.Dependency
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.util.StringUtil
	*	@requires com.spinal.util.exception.ioc.DependencyException
	**/
	var Dependency = Spinal.namespace('com.spinal.ioc.engine.helpers.Dependency', Spinal.SpinalClass.inheirt({

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
			if(!attrs.target[attrs.property]) throw new DependencyException('UndefinedTargetProperty');
		},

		/**
		*	Default Injection strategy
		*	@public
		*	@method inject
		*	@param engine
		*	@return Object
		**/
		inject: function(engine) {
			return (this.getTarget()[this.getProperty()] = engine.bone(this.getDependencyId()));
		},

		/**
		*	Retrieves dependency id
		*	@public
		*	@method getDependencyId
		*	@return com.spinal.ioc.engine.helpers.Bone
		**/
		getDependencyId: function() {
			return this.dependencyId;
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
