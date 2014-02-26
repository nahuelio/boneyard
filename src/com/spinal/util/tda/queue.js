/**
*	@module com/spinal/util/tda
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

/**
*	Define a generic interface to communicate with a service in the cloud.
*	@namespace com.spinal.util.tda
*	@class com.spinal.util.tda.Queue
*	@extends com.spinal.util.tda.Iterator
**/
var Queue = Spinal.namespace('com.spinal.util.tda.Queue', Iterator.inherit({
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.util.tda.Queue}
	**/
	initialize: function() {
		return this;
	},
	
	/**
	*	Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions, returning true upon success and throwing an Error if no space is currently available.
	*	@public
	*	@method add
	*	@return Boolean
	**/
	add: function(element) {
		return false;
	},
	
	/**
	*	Retrieves, but does not remove, the head of this queue.
	*	@public
	*	@method element
	*	@return Any
	**/
	element: function() {
		return {};
	},
	
	/**
	*	Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions.
	*	@public
	*	@method remove
	*	@return Boolean
	**/
	offer: function() {
		return false;	
	},
	
	/**
	*	Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty.
	*	@public
	*	@method peek
	*	@return Any
	**/
	peek: function() {
		return {};
	},
	
	/**
	*	Retrieves and removes the head of this queue, or returns null if this queue is empty.
	*	@public
	*	@method poll
	*	@return Any
	**/
	poll: function() {
		return {};
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'Iterator'
	
}));