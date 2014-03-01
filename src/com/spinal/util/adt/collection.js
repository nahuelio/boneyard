/**
*	@module com/spinal/util/adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

/**
*	Define a generic interface of a Collection
*	@namespace com.spinal.util.adt
*	@class com.spinal.util.adt.Collection
*	@extends com.spinal.core.Class
**/
Spinal.namespace('com.spinal.util.adt.Collection', Spinal.com.spinal.core.Class.inherit({
	
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
	*	@return {com.spinal.util.adt.Collection}
	**/
	initialize: function() {
		return this;
	},
	
	/**
	*	Validate that the element is an Object.
	*	@private
	*	@method _valid
	*	@param element {Object} element to be evaluated.
	*	@return Boolean
	**/
	_valid: function(element) {
		if(!element) return false;
		if(!_.isObject(element)) return false;
		if(_.isArray(element)) return !(_.reject(element, function(e) { return _.isObject(element); }).length > 0);
		return true;
	},
	
	/**
	*	Set a new collection of elements
	*	@public
	*	@method set
	*	@param arr {Array} new collection to be replaced
	*	@return Boolean
	**/
	set: function(arr) {
		if(!this._valid(arr)) return false;
		this.reset({ silent: true });
		this.collection = new Array(arr);
		return true;
	},
	
	/**
	*	Returns the element in the index specified as parameter. If it's not found, returns null.
	*	@public
	*	@method get
	*	@param ix {Number} index
	*	@return {Object}
	**/
	get: function(ix) {
		if(this.size() < ix) return this.collection[ix];
		return null;
	},
	
	/**
	*	Add an object element and returns it
	*	@public
	*	@method add
	*	@param element {Object} element
	*	@return Object
	**/
	add: function(element) {
		if(!this._valid(element)) return null;
		this.collection.push(element);
		return element;
	},
	
	/**
	*	Add collection of elements to the current collection of elements.
	*	@public
	*	@method addAll
	*	@param elements {Array} Array of elements (Objects)
	*	@return Boolean
	**/
	addAll: function(elements) {
		if(!this._valid(elements)) return false;
		this.collection = this.collection.concat(elements);
		return true;
	},
	
	/**
	*	Returns true if this collection contains the specified element.
	*	@public
	*	@method contains
	*	@param element {Object} element to evaluate
	*	@return Boolean
	**/
	contains: function(element) {
		if(!this._valid(element)) return false;
		return (_.filter(this.collection, _.matches(element)).length > 0);
	},
	
	/**
	*	Returns true if this collection contains all elements of the collection specified as parameter
	*	@public
	*	@method containsAll
	*	@param elements {Array} collection of elements to evaluate
	*	@return Boolean
	**/
	containsAll: function(elements) {
		if(!elements) return false;
		return _.some(_.map(elements, function(e) { return this.contains(e); }));
	},
	
	/**
	*	Returns an iterator over the elements of this collection.
	*	@public
	*	@method iterator
	*	@return {com.spinal.util.adt.Iterator}
	**/
	iterator: function() {
		return new Iterator({ collection: this.collection });
	},
	
	/**
	*	Remove an existent element
	*	@public
	*	@method remove
	*	@param ix {Number} index
	*	@return Object
	**/
	remove: function(ix) {
		if(this.size() < ix) return this.collection.splice(ix, 1);
		return null;
	},
	
	/**
	*	Remove element/s that match the evaluation in finder
	*	@public
	*	@method removeBy
	*	@param finder {Function} matcher function
	*	@return {Array}
	**/
	removeBy: function(finder) {
		var len = this.size();
		for(var i = 0, removed = []; i < len; i++) {
			if(finder(this.collection[i])) removed.push(this.collection.splice(i, 1));
		}
		return removed;
	},
	
	/**
	*	Removes all of this collection's elements that are also contained in the specified collection.
	*	@public
	*	@method removeAll
	*	@param elements {Array} Collection of elements to be removed.
	*	@return Boolean
	**/
	removeAll: function(elements) {
		if(!this._valid(elements)) return false;
		return (this.removeBy(_.bind(function(element) { 
			return (_.filter(elements, _.matches(element)).length > 0);
		}, this)).length > 0);
	},
	
	/**
	*	Find element/s by evaluation defined in finder.
	*	@public
	*	@method findBy
	*	@param finder {Function} matcher function
	*	@return {Array}
	**/
	findBy: function(finder) {
		for(var i = 0, found = []; i < this.size(); i++) {
			if(finder(this.collection[i])) found.push(this.collection[i]);
		}
		return found;
	},	
	
	/**
	*	Clears the collection
	*	@public
	*	@chainable
	*	@method reset
	*	@param opts {Object} Options
	*	@optional
	*	@return {com.spinal.util.adt.Collection}
	**/
	reset: function(opts) {
		opts || (opts = {});
		this.collection = [];
		return this;
	},
	
	/**
	*	Returns true if the collection is empty.
	*	@public
	*	@chainable
	*	@method isEmpty
	*	@return Boolean
	**/
	isEmpty: function() {
		return (this.size() === 0);
	},
	
	/**
	*	Returns the size of the collection.
	*	@public
	*	@chainable
	*	@method size
	*	@return Number
	**/
	size: function() {
		return this.collection.length;		
	},
		
	/**
	*	Sort the collection
	*	@public
	*	@chainable
	*	@method sort
	*	@param comparator {Function} comparator function
	*	@return {com.spinal.util.adt.Collection}
	**/
	sort: function(comparator) {
		this.collection.sort(comparator);
		return this;
	},
	
	/**
	*	String representation of an instance of this class
	*	@public
	*	@method toString
	*	@return String
	**/
	toString: function() {
		return '[object Collection]';
	}
	
}, {
	
	/**
	*	@static
	*	@property NAME
	*	@type String
	**/
	NAME: 'Collection',
	
	/**
	*	@static
	*	@property EVENTS
	*	@type Object
	**/
	EVENTS: {
		/**
		* @event added
		**/
		added: 'com:spinal:util:adt:collection:added',
		/**
		* @event removed
		**/
		removed: 'com:spinal:util:adt:collection:removed',
		/**
		* @event reset
		**/
		reset: 'com:spinal:util:adt:collection:reset'
	}
	
}));