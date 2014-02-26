/**
*	@module com/spinal/ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

/**
*	Define a generic container interface to add/remove views
*	@namespace com.spinal.ui
*	@class com.spinal.ui.SpinalContainer
*	@extends com.spinal.ui.SpinalView
**/
Spinal.namespace('com.spinal.ui.SpinalContainer', Spinal.com.spinal.ui.SpinalView.inherit({
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.ui.SpinalContainer}
	**/
	initialize: function() {
		Spinal.com.spinal.ui.SpinalView.__super__.initialize.apply(this, arguments);
		return this;
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'SpinalContainer'
	
}));