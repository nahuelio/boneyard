/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation'], function(Annotation) {

	/**
	*	Class Ready
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Ready
	*	@extends com.spinal.ioc.engine.annotation.Annotation
	*
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	**/
	var Ready = Spinal.namespace('com.spinal.ioc.engine.annotation.Ready', Annotation.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [attrs] {Object} annotation attributes
		*	@return com.spinal.ioc.engine.annotation.Ready
		**/
		initialize: function(attrs) {
			attrs || (attrs = {});
			Ready.__super__.initialize.call(this, attrs);
			_.extend(this, StringUtil.toPrivate(attrs));
			return this;
		},

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Ready',

		/**
		*	Gather ready bones from a given spec
		*	@static
		*	@method only
		*	@param spec {Object} spec reference
		*	@return	Array
		**/
		only: function(spec) {
			return _.pick(spec, '$ready');
		}

	}));

	return Ready;

});
