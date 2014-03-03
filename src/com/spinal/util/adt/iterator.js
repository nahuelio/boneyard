/**
*	@module com/spinal/util/adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

var Spinal = require('../../core/core');

/**
*	Define a generic interface to communicate with a service in the cloud.
*	@namespace com.spinal.util.adt
*	@class com.spinal.util.adt.Iterator
*	@extends com.spinal.core.Class
**/
Spinal.namespace('com.spinal.util.adt.Iterator', Spinal.com.spinal.core.Class.inherit({
	
	/**
	*	Internal Array
	*	@public
	*	@property collection
	*	@type Array
	**/
	collection: [],
	
	/**
	*	Cursor that points to an index inside the collection.
	*	@public
	*	@property _cur
	*	@type Number
	**/
	_cur: 0,
	
	/**
	*	Initialize
	*	@public
	*	@chainable
	*	@method initialize
	*	@return {com.spinal.util.adt.Iterator}
	**/
	initialize: function() { return this; },
	
	/**
	*	Returns true if there is still an element in the list at the current cursor position.
	*	@public
	*	@method hasNext
	*	@return Boolean
	**/
	hasNext: function() {
		return ((this.collection.length-1) > this._cur);
	},
	
	/**
	*	Returns the current element in the collection and move the cursor position 1 step forward.
	*	@public
	*	@method next
	*	@return Any
	**/
	next: function() {
		return this.collection[++this._cur];
	},
	
	/**
	*	Reset the cursor to the beginning to the index 0.
	*	@public
	*	@chainable
	*	@method rewind
	*	@return {com.spinal.util.adt.Iterator}
	**/
	rewind: function() {
		this._cur = 0;
		return this;
	},
	
	/**
	*	Removes from the underlying collection the last element returned by this iterator
	*	@public
	*	@method remove
	*	@return Any
	**/
	remove: function() {
		return (this.collection.length > 0) ? this.collection.splice(this._cur, 1) : null;
	},
	
	/**
	*	String representation of an instance of this class
	*	@public
	*	@method toString
	*	@return String
	**/
	toString: function() {
		return '[object Iterator]';
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'Iterator',
	
	/**
	*	@static
	*	@property EVENTS
	*	@type Object
	**/
	EVENTS: {
		/**
		*	@event removed
		**/
		removed: 'com:spinal:util:adt:interator:removed'	
	}
	
}));