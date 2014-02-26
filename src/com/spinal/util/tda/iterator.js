/**
*	@module com/spinal/util/tda
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

/**
*	Define a generic interface to communicate with a service in the cloud.
*	@namespace com.spinal.util.tda
*	@class com.spinal.util.tda.Iterator
*	@extends com.spinal.core.Class
**/
var Iterator = Spinal.namespace('com.spinal.util.tda.Iterator', Spinal.com.spinal.core.Class.inherit({
	
	/**
	*	Internal Array
	*	@public
	*	@property collection
	*	@type Array
	**/
	collection: [],
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.util.tda.Iterator}
	**/
	initialize: function() {
		return this;
	},
	
	/**
	*	Has Next
	*	@public
	*	@method hasNext
	*	@return Boolean
	**/
	hasNext: function() {
		return false;
	},
	
	/**
	*	Next
	*	@public
	*	@method next
	*	@return Any
	**/
	next: function() {
		
	},
	
	/**
	*	Remove
	*	@public
	*	@method remove
	*	@return Any
	**/
	remove: function() {
		
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'Iterator'
	
}));