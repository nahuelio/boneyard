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
	*	@return {com.spinal.ui.Container}
	**/
	initialize: function() {
		Container.__super__.initialize.apply(this, arguments);
		return this;
	},
	
	/**
	*	Add View
	*	@public
	*	@chainable
	*	@method add
	*	@return {com.spinal.ui.Container}
	**/
	add: function() { },
	
	/**
	*	Remove View
	*	@public
	*	@chainable
	*	@method lookup
	*	@return {com.spinal.ui.Container}
	**/
	remove: function() { },
	
	/**
	*	Find View
	*	@public
	*	@method find
	*	@return Any
	**/
	find: function() { },
	
	/**
	*	Show View
	*	@public
	*	@chainable
	*	@method show
	*	@return {com.spinal.ui.View}
	**/
	show: function() { },
	
	/**
	*	Hide View
	*	@public
	*	@chainable
	*	@method hide
	*	@return {com.spinal.ui.View}
	**/
	hide: function() { },
	
	/**
	*	Enable View
	*	@public
	*	@chainable
	*	@method enable
	*	@return {com.spinal.ui.View}
	**/
	enable: function() { },
	
	/**
	*	Disable View
	*	@public
	*	@chainable
	*	@method disable
	*	@return {com.spinal.ui.View}
	**/
	disable: function() { },
	
	/**
	*	Clear View
	*	@public
	*	@chainable
	*	@method clear
	*	@return {com.spinal.ui.View}
	**/
	clear: function() { }
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'Container'
	
}));