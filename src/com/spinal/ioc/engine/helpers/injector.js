/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/string'], function(StringUtil) {

	/**
	*	Class Injector
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.Injector
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.Context
	**/
	var Injector = Spinal.namespace('com.spinal.ioc.engine.helpers.Injector', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@throws Error
		*	@method initialize
		*	@param annotation {com.spinal.ioc.engine.annotation.Annotation} annotation reference
		*	@return com.spinal.ioc.helpers.Injector
		**/
		initialize: function(annotation) {
			this.annotation = annotation;
			return Injector.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves injector's annotation
		*	@public
		*	@method getAnnotation
		*	@return com.spinal.ioc.engine.annotation.Annotation
		**/
		getAnnotation: function() {
			return this.annotation;
		},

		/**
		*	Retrieves Annotation Matcher composed by Type and Delimiter
		*	@public
		*	@method getAnnotationMatcher
		*	@return String
		**/
		getAnnotationMatcher: function() {
			var Annotation = this.getAnnotation().constructor;
			return (Annotation.TYPE + Annotation.DELIMITER);
		},

		/**
		*	Retrieves dependency
		*	@public
		*	@method get
		*	@param dependency {com.spinal.ioc.engine.helpers.Dependency} dependency reference
		*	@return Object
		**/
		get: function(dependency) {
			if(!(m = dependency.getCompound())) return null;
			// FIXME: Reference to Engine
			//return _.isObject(m) ? this.getEngine().bone(m.id)[m.method] : this.getEngine().bone(m);
		},

		/**
		*	Resolves and inject a dependency in the current bone annotation
		*	@public
		*	@method inject
		*	@param dependency {com.spinal.ioc.engine.helpers.Dependency} dependency reference
		*	@return com.spinal.ioc.helpers.Injector
		**/
		inject: function(dependency) {
			return (dependency.getTarget()[dependency.getProperty()] = this.get(dependency));
		},

		/**
		*	FIXME: Analyze edge case when simple bone depends on a module bone (Resolve on HOLD)
		*	Sets this dependency as on hold by assigning resolution strategy as a function
		*	@public
		*	@method hold
		*	@param dependency {com.spinal.ioc.engine.helpers.Dependency} dependency reference
		*	@return com.spinal.ioc.engine.helpers.Dependency
		**/
		hold: function(dependency) {
			this.getAnnotation()._$hold = _.bind(this.inject, this, dependency);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Injector'

	}));

	return Injector;

});
