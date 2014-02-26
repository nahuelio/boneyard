/**
*	@module com/spinal/ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

/**
*	Define a generic view interface that extends classic Backbone.View
*	@namespace com.spinal.ui
*	@class com.spinal.ui.View
*	@extends com.spinal.core.Class
**/
var View = Spinal.namespace('com.spinal.ui.View', Spinal.com.spinal.core.Class.inherit({
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.ui.View}
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
	NAME: 'View'
	
}));