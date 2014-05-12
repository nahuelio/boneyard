/**
*	@module com/spinal/util/adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
	   'util/adt/collection'], function(Spinal, Collection) {

	/**
	*	Define a generic interface to communicate with a service in the cloud.
	*	@namespace com.spinal.util.adt
	*	@class com.spinal.util.adt.Queue
	*	@extends com.spinal.util.adt.Collection
	*	@example
	*	Usage:
	*
	*	var myqueue = new Queue({ capacity: 5 }); // capacity was set to 5
	*		myqueue.addAll([{ name: 1 }, { name: 2 }]); // using 'addAll' from com.spinal.util.adt.Collection
	*		myqueue.offer({ name: 3 }); // or adding one by one.
	*		myqueue.poll();
	**/
	var Queue = Spinal.namespace('com.spinal.util.adt.Queue', Collection.inherit({

		/**
		*	Queue capacity
		*	@public
		*	@property capacity
		*	@type Number
		**/
		capacity: 0,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.util.adt.Queue}
		**/
		initialize: function() {
			return this;
		},

		/**
		*	Validate capacity of the queue to add or not the element in the queue.
		*	@private
		*	@method _valid
		*	@param element {Object} element to be evaluated.
		*	@return Boolean
		**/
		_valid: function(element) {
			if(this.size() >= this.capacity) return false;
			return Queue.__super__._valid.apply(this, arguments);
		},

		/**
		*	Inserts the specified element into this queue if it is possible to do so immediately without violating capacity restrictions.
		*	@public
		*	@method remove
		*	@param element {Object} element to be inserted.
		*	@return Boolean
		**/
		offer: function(element) {
			if(!this._valid(element)) return false;
			this.collection.unshift(element);
			return true;
		},

		/**
		*	Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty.
		*	@public
		*	@method peek
		*	@return Object
		**/
		peek: function() {
			return (this.size() > 0) ? this.collection[0] : null;
		},

		/**
		*	Retrieves and removes the head of this queue, or returns null if this queue is empty.
		*	@public
		*	@method poll
		*	@return Object
		**/
		poll: function() {
			return (this.size() > 0) ? this.remove(0) : null;
		},

		/**
		*	String representation of an instance of this class
		*	@public
		*	@method toString
		*	@return String
		**/
		toString: function() {
			return '[object Queue]';
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Queue'

	}));

	return Queue;

});
