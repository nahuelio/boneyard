/**
*	@module com/spinal/mvc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

/**
*	Define a generic interface to communicate with a service in the cloud.
*	@namespace com.spinal.mvc
*	@class com.spinal.mvc.SpinalController
*	@extends com.spinal.core.Class
**/
Spinal.namespace('com.spinal.mvc.SpinalController', Spinal.com.spinal.core.Class.inherit({
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.mvc.SpinalController}
	**/
	initialize: function() {
		return this;
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'SpinalController'
	
}));