/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/string'], function(StringUtil) {

	/**
	*	Class Annotation
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Annotation
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires  com.spinal.util.StringUtil
	**/
	var Annotation = Spinal.namespace('com.spinal.ioc.engine.annotation.Annotation', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.engine.annotation.Annotation
		**/
		initialize: function(attrs) {
			attrs || (attrs = {});
			_.extend(this, StringUtil.toPrivate(attrs, 'name', 'value'));
			return Annotation.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Validate if a given expression matches an annotation nomenclature
		*	@public
		*	@method validate
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		validate: function(expr) {
			return (expr && _.isString(expr) && expr.indexOf(Annotation.PREFIX) === 0);
			return ((ev.indexOf(this.annotations._b) !== -1) || (ev.indexOf(this.annotations._r) !== -1));
		},

		/**
		*	Retrieves Annotation's name
		*	@public
		*	@method getName
		*	@return String
		**/
		getName: function() {
			return this._name;
		},

		/**
		*	Retrieves annotation's value
		*	@public
		*	@method getValue
		*	@return Object
		**/
		getValue: function() {
			return this._value;
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
		*	@property TYPE
		*	@type Object
		**/
		TYPE: {
			bone: 'bone!',
			boneRef: 'bone-ref!'
		},

		/**
		*	@static
		*	@property PREFIX
		*	@type String
		**/
		PREFIX: '$'

	}));

	return Annotation;

});
