/**
*	@module com/spinal/util/tda
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

/**
*	Define a generic interface of a Collection
*	@namespace com.spinal.util.tda
*	@class com.spinal.util.tda.Collection
*	@extends com.spinal.util.tda.Iterator
**/
var Collection = Spinal.namespace('com.spinal.util.tda.Collection', Iterator.inherit({
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.util.tda.Collection}
	**/
	initialize: function() {
		return this;
	},
	
	/**
	*	Add an element and returns it
	*	@public
	*	@method add
	*	@return Any
	**/
	add: function() {
		
	},
	
	/**
	*	Set a new collection of elements
	*	@public
	*	@method set
	*	@return Boolean
	**/
	set: function() {
		
	},
	
	/**
	*	Remove an existent element
	*	@public
	*	@method remove
	*	@return Any
	**/
	remove: function() {
		
	},
	
	/**
	*	Clears the collection
	*	@public
	*	@chainable
	*	@method reset
	*	@return {com.spinal.util.tda.Collection}
	**/
	reset: function() {
		return this;
	},
	
	/**
	*	Sort the collection
	*	@public
	*	@chainable
	*	@method sort
	*	@return {com.spinal.util.tda.Collection}
	**/
	sort: function() {
		
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'Collection'
	
}));