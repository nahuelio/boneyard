/**
*	@module com/spinal/ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var Spinal = require('../core/core'),
	Collection = require('../util/adt/collection'),
	View = require('./view');

/**
*	Define a generic container interface to add/remove views
*	@namespace com.spinal.ui
*	@class com.spinal.ui.Container
*	@extends com.spinal.ui.View
**/
Spinal.namespace('com.spinal.ui.Container', View.inherit({
	
	/**
	*	View Collection
	*	@property views
	*	@type {com.spinal.util.adt.Collection}
	**/
	views: new Collection(),
	
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
	*	@param v {com.spinal.ui.View} View instance
	*	@return {com.spinal.ui.Container}
	**/
	add: function(v) {
		if(!this.find(v)) this.views.add(v);
		return this;
	},
	
	/**
	*	Remove View
	*	@public
	*	@chainable
	*	@method lookup
	*	@param v {com.spinal.ui.View} View instance
	*	@return {com.spinal.ui.Container}
	**/
	remove: function(v) {
		if(this.find(v)) this.views.remove(v);
		return this;
	},
	
	/**
	*	Find View
	*	@public
	*	@method find
	*	@param v {com.spinal.ui.View} View instance
	*	@return {com.spinal.ui.View}
	**/
	find: function(finder) {
		return this.views.findBy(finder);
	},
	
	/**
	*	Find View by id
	*	@public
	*	@method findById
	*	@param id {String} View id
	*	@return {com.spinal.ui.View}
	**/
	findById: function(id) {
		return this.views.findBy(function(v) { return (v.id && v.id == id); });
	},
	
	/**
	*	Show View
	*	@public
	*	@chainable
	*	@method show
	*	@return {com.spinal.ui.View}
	**/
	show: function() {
		this.views.invoke('show');
		Container.__super__.show.apply(this, arguments);
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
		this.views.invoke('hide');
		Container.__super__.hide.apply(this, arguments);
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
		this.views.invoke('enable');
		Container.__super__.enable.apply(this, arguments);
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
		this.views.invoke('disable');
		Container.__super__.disable.apply(this, arguments);
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
		this.views.invoke('clear');
		Container.__super__.clear.apply(this, arguments);
		return this;
	},
	
	/**
	*	String representation of an instance of this class
	*	@public
	*	@method toString
	*	@return String
	**/
	toString: function() {
		return '[object Container]';
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'Container'
	
}));

module.exports = Spinal.com.spinal.ui.Collection;