/**
*	@module com/spinal/ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var Spinal = require('../core/core');

/**
*	Define a generic view interface that extends classic Backbone.View
*	@namespace com.spinal.ui
*	@class com.spinal.ui.View
*	@extends Spinal.Backbone.View
**/
Spinal.namespace('com.spinal.ui.View', Spinal.Backbone.View.inherit({
	
	/**
	*	Id
	*	@public
	*	@property id
	*	@type String
	**/
	id: null,
	
	/**
	*	Class
	*	@public
	*	@property class
	*	@type String
	**/
	class: 'spinal-view',
	
	/**
	*	Template
	*	@public
	*	@property template
	*	@type Function
	**/
	template: _.template('<div></div>'),
	
	/**
	*	Succesor
	*	@public
	*	@property succesor
	*	@type {com.spinal.ui.View}
	**/
	succesor: null,
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.ui.View}
	**/
	initialize: function(attrs) {
		View.__super__.initialize.apply(this, arguments);
		if(attrs.succesor) this.set('el', succesor.get('el'));
		return this;
	},
	
	/**
	*	Render View
	*	@public
	*	@chainable
	*	@method render
	*	@return {com.spinal.ui.View}
	**/
	render: function() {
		return this;
	},
	
	/**
	*	Update View
	*	@public
	*	@chainable
	*	@method update
	*	@return {com.spinal.ui.View}
	**/
	update: function() {
		return this;
	},
	
	/**
	*	Lookup
	*	@public
	*	@chainable
	*	@method lookup
	*	@param id {String} Succesor id
	*	@return {com.spinal.ui.View}
	**/
	lookup: function(id) {
		return this._next(id);
	},
	
	/**
	*	Show View
	*	@public
	*	@chainable
	*	@method show
	*	@return {com.spinal.ui.View}
	**/
	show: function() {
		if(this.$el) this.$el.show();
		return this;
	},
	
	/**
	*	Hide View
	*	@public
	*	@chainable
	*	@method hide
	*	@return {com.spinal.ui.View}
	**/
	hide: function() {
		if(this.$el) this.$el.hide();
		return this;
	},
	
	/**
	*	Enable View
	*	@public
	*	@chainable
	*	@method enable
	*	@return {com.spinal.ui.View}
	**/
	enable: function() {
		if(this.$el) this.$el.enable();
		return this;
	},
	
	/**
	*	Disable View
	*	@public
	*	@chainable
	*	@method disable
	*	@return {com.spinal.ui.View}
	**/
	disable: function() {
		if(this.$el) this.$el.disable();
		return this;
	},
	
	/**
	*	Clear View
	*	@public
	*	@chainable
	*	@method clear
	*	@return {com.spinal.ui.View}
	**/
	clear: function() {
		if(this.$el) this.$el.children().remove();
		return this;
	},
	
	/**
	*	Try to Retrieve next succesor if possible (Chain of Responsability)
	*	@private
	*	@method _next
	*	@param id {String} Succesor id
	*	@return {com.spinal.ui.View}
	**/
	_next: function(id) {
		if(this.id === id) return this;
		if(this.successor) return this.successor.lookup(id);
		return null;
	},
	
	/**
	*	String representation of an instance of this class
	*	@public
	*	@method toString
	*	@return String
	**/
	toString: function() {
		return '[object View]';
	}
	
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
		/**
		* @event shown
		**/
		shown: 'com:spinal:ui:view:shown',
		/** 
		*	@event hidden
		**/
		hidden: 'com:spinal:ui:view:hidden',
		/**
		*	@event enabled
		**/
		enabled: 'com:spinal:ui:view:enabled',
		/**
		*	@event disabled
		**/
		disabled: 'com:spinal:ui:view:disabled',
		/**
		*	@event clicked
		**/
		clicked: 'com:spinal:ui:view:clicked',
		/**
		*	@event focused
		**/
		focused: 'com:spinal:ui:view:focused',
		/**
		*	@event blurred
		**/
		blurred: 'com:spinal:ui:view:blurred',
		/**
		*	@event rendered
		**/
		rendered: 'com:spinal:ui:view:rendered',
		/**
		*	@event updated
		**/
		updated: 'com:spinal:ui:view:updated',
		/**
		*	@event cleared
		**/
		cleared: 'com:spinal:ui:view:cleared'
	}
	
}));