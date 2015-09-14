/**
*	@module com.spinal.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Define a generic interface to communicate with a service in the cloud.
	*	@namespace com.spinal.util.adt
	*	@class com.spinal.util.adt.Iterator
	*	@extends com.spinal.core.SpinalClass
	**/
	var Iterator = Spinal.namespace('com.spinal.util.adt.Iterator', Spinal.SpinalClass.inherit({

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
		*	@param [initial] {Array} initial elements in the collection.
		*	@return {com.spinal.util.adt.Iterator}
		**/
		initialize: function(initial) {
			(initial) ? this.set(initial) : (this.collection = []);
			return Iterator.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Set a new collection of elements
		*	@public
		*	@method set
		*	@param attrs {Object} attribu
		*	@return {com.spinal.util.adt.Iterator}
		**/
		set: function(arr) {
			if(!_.isArray(arr)) throw new Error(this.toString() + ' requires an array in order to be instanciate it.');
			this.collection = arr.slice(0);
			return this.rewind();
		},

		/**
		*	Returns true if there is still an element in the list at the current cursor position.
		*	@public
		*	@method hasNext
		*	@return Boolean
		**/
		hasNext: function() {
			return (this._cur <= (this.collection.length-1));
		},

		/**
		*	Returns the current element in the collection and move the cursor position 1 step forward.
		*	@public
		*	@method next
		*	@return Object
		**/
		next: function() {
			return (this._cur <= this.collection.length-1) ? this.collection[this._cur++] : null;
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
		*	@return Object
		**/
		remove: function() {
			if(this.collection.length > 0) {
				var removed = this.collection.splice(this._cur, 1)[0];
				this.trigger(Iterator.EVENTS.removed, { removed: removed, iterator: this });
			}
			return removed;
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
			removed: 'com:spinal:util:adt:iterator:removed'
		}

	}));

	return Iterator;

});
