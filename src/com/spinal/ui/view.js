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
	},
	
	/**
	*	Render View
	*	@public
	*	@chainable
	*	@method render
	*	@return {com.spinal.ui.View}
	**/
	render: function() { },
	
	/**
	*	Update View
	*	@public
	*	@chainable
	*	@method update
	*	@return {com.spinal.ui.View}
	**/
	update: function() { },
	
	/**
	*	Lookup
	*	@public
	*	@chainable
	*	@method lookup
	*	@return Any
	**/
	lookup: function() { },
	
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
	NAME: 'View',
	
	/**
	*	@static
	*	@property EVENTS
	*	@type Object
	**/
	EVENTS: {
		shown: 'com:spinal:ui:view:shown',
		hidden: 'com:spinal:ui:view:hidden',
		enabled: 'com:spinal:ui:view:enabled',
		disabled: 'com:spinal:ui:view:disabled',
		clicked: 'com:spinal:ui:view:clicked',
		focused: 'com:spinal:ui:view:focused',
		blurred: 'com:spinal:ui:view:blurred',
		cleared: 'com:spinal:ui:view:cleared'
	}
	
}));