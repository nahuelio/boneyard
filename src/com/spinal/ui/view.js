/**
*	@module com/spinal/ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

/**
*	Define a generic view interface that extends classic Backbone.View
*	@namespace com.spinal.ui
*	@class com.spinal.ui.SpinalView
*	@extends com.spinal.core.Class
**/
Spinal.namespace('com.spinal.ui.SpinalView', Spinal.com.spinal.core.Class.inherit({
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.ui.SpinalView}
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
	NAME: 'SpinalView'
	
}));