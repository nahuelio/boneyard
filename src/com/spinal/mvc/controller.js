/**
*	@module com/spinal/mvc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var Spinal = require('../core/core');

/**
*	Define a generic interface to communicate with a service in the cloud.
*	@namespace com.spinal.mvc
*	@class com.spinal.mvc.Controller
*	@extends com.spinal.core.Class
**/
Spinal.namespace('com.spinal.mvc.Controller', Spinal.com.spinal.core.Class.inherit({
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.mvc.Controller}
	**/
	initialize: function() {
		return this;
	},
	
	/**
	*	String representation of an instance of this class
	*	@public
	*	@method toString
	*	@return String
	**/
	toString: function() {
		return '[object Controller]';
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'Controller'
	
}));

module.exports = Spinal.com.spinal.mvc.Controller;