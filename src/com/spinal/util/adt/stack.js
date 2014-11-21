/**
*	@module com.spinal.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
	'util/adt/collection'], function(Spinal, Collection) {

	/**
	*	Defines the interface of a Stack LIFO (LastIn-FirstOut)
	*	<h5>Usages:</h5>
	*
	*		var mystack = new Stack([]); // initial
	*			mystack.addAll([{ name: 1 }, { name: 2 }]); // using 'addAll' from com.spinal.util.adt.Collection
	*			mystack.push({ name: 3 }); // or adding one by one.
	*			mystack.pop();
	*
	*		var mystack = new Stack([], { interface: Spinal.SpinalClass });
	*			mystack.addAll([{ name: 1 }, { name: 2 }]); // using 'addAll' from com.spinal.util.adt.Collection
	*			mystack.push({ name: 3 }); // or adding one by one.
	*			mystack.pop();
	*
	*	@namespace com.spinal.util.adt
	*	@class com.spinal.util.adt.Stack
	*	@extends com.spinal.util.adt.Collection
	**/
	var Stack = Spinal.namespace('com.spinal.util.adt.Stack', Collection.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param initial {Array} initial collection of elements in the stack.
		*	@param opts {Object} Additional options.
		*	@return {com.spinal.util.adt.Stack}
		**/
		initialize: function(initial, opts) {
			return Stack.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Validate the element in the stack.
		*	@private
		*	@method _valid
		*	@param element {Object} element to be evaluated.
		*	@return Boolean
		**/
		_valid: function(element) {
			return Stack.__super__._valid.apply(this, arguments);
		},

		/**
		*	Set the initial state of the stack
		*	@public
		*	@method set
		*	@param arr {Array} initial elements in the collection.
		*	@param opts {Object} Additional options.
		*	@return {com.spinal.util.adt.Stack}
		**/
		set: function(arr, opts) {
			opts || (opts = {});
			Stack.__super__.set.apply(this, arguments);
			return this;
		},

		/**
		*	Inserts the specified element into this stack.
		*	@public
		*	@method push
		*	@param element {Object} element to be inserted.
		*	@return Boolean
		**/
		push: function(element) {
			if(!this._valid(element)) return false;
			(!_.isNull(this._interface)) ?
				this.collection.unshift(new this._interface(element)) :
				this.collection.unshift(element);
			return true;
		},

		/**
		*	Retrieves, but does not remove, the head of this stack, or returns null if this stack is empty.
		*	@public
		*	@method peek
		*	@return Object
		**/
		peek: function() {
			return (this.size() > 0) ? this.collection[0] : null;
		},

		/**
		*	Retrieves and removes the head of this stack, or returns null if this stack is empty.
		*	@public
		*	@method pop
		*	@return Object
		**/
		pop: function() {
			return (this.size() > 0) ? this.remove(0) : null;
		},

		/**
		*   Returns the 1-based position where an object is on this stack
		*	@public
		*	@method search
		*	@param element {Object} element to get 1-based position
		*	@return Number
		**/
		search: function(element) {
			var pos = -1;
			for(var i = 0; i < this.size(); i++) {
				if(_.isEqual(this.collection[i],element)) { pos = i; break; }
			}
			return pos;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Stack'

	}));

	return Stack;

});
