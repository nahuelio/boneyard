/**
*	@module com/spinal/mvc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

if(typeof exports !== 'undefined') Spinal = require('../core/core');

/**
*	Define a generic interface of a middle man that helps with the Controller/Model communication
*	@namespace com.spinal.mvc
*	@class com.spinal.mvc.Service
*	@extends com.spinal.core.Class
**/
Spinal.namespace('com.spinal.mvc.Service', Spinal.com.spinal.core.Class.inherit({
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.mvc.Service}
	**/
	initialize: function() {
		return this;
	},
	
	/**
	*	Serialize
	*	@public
	*	@method serialize
	*	@return Object
	**/
	serialize: function() {
		return {};
	},
	
	/**
	*	Deserialize
	*	@public
	*	@method deserialize
	*	@return Any
	**/
	deserialize: function() {
		return null;
	},
	
	/**
	*	String representation of an instance of this class
	*	@public
	*	@method toString
	*	@return String
	**/
	toString: function() {
		return '[object Service]';
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'Service'
	
}));