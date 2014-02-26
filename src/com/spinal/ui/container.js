/**
*	@module com/spinal/ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

/**
*	Define a generic container interface to add/remove views
*	@namespace com.spinal.ui
*	@class com.spinal.ui.Container
*	@extends com.spinal.ui.View
**/
var Container = Spinal.namespace('com.spinal.ui.Container', View.inherit({
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.ui.SpinalContainer}
	**/
	initialize: function() {
		Container.__super__.initialize.apply(this, arguments);
		return this;
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'Container'
	
}));