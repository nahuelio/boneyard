/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/injector',
	'util/string'], function(Injector, StringUtil) {

	/**
	*	Class Annotation
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Annotation
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.util.StringUtil
	*	@requires com.spinal.ioc.engine.helpers.Injector
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
			if(!attrs) throw new Error('Annotation cannot be null');
			if(!_.isObject(attrs)) throw new Error('Annotation type must be an object');
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
		*	@property DELIMITER
		*	@type String
		**/
		DELIMITER: '!',

		/**
		*	Create a new Injector instance by optionally passing arguments to the constructor
		*	@static
		*	@method newInjector
		*	@return com.spinal.ioc.engine.helpers.Injector
		**/
		newInjector: function() {
			return Injector.new.apply(Array.prototype.slice.call(this, arguments));
		}

	}));

	return Annotation;

});
