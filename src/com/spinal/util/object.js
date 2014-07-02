/**
*	@module com/spinal/util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	ObjectUtil Singleton class provides a useful interface to query object structure.
	*	@namespace com.spinal.util
	*	@class com.spinal.util.ObjectUtil
	*	@extends com.spinal.core.SpinalClass
	*
	*	Try to give some shape to this implementation and see if it's worth it.
	*	This should be benchmarked it!!!
	*
	*	The goal:
	*		1) Simple and please... faster!!
	*		2) Remove the boiler plate code, while checking the existance of object's props
	*		in large object structure hierarchies.
	*		3) This should be a bug helper to query specs on the spinal-ioc/context module.
	*		essentially to avoid the usage of the Collection classes and keep the spec structure.
	*
	**/
	var ObjectUtil = Spinal.namespace('com.spinal.util.ObjectUtil', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.ObjectUtil}
		**/
		initialize: function() {
			if(arguments.callee._singleton) return arguments.callee._singleton;
			return arguments.callee._singleton = this;
		},

		/**
		*	By Query
		**/
		byQuery: function(query) {
			return _.reduce(query.split('.'), function(ref, prop) { return ref[prop]; }, this.o, this);
		},

		/**
		*	By Key
		**/
		byKey: function() {
			return null;
		},

		/**
		*	By Val
		**/
		byVal: function() {
			return null;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ObjectUtil'

	}));

	return ObjectUtil;

});
