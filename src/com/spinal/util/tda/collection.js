/**
*	@module com/spinal/util/tda
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/

/**
*	Define a generic interface of a Collection
*	@namespace com.spinal.util.tda
*	@class com.spinal.util.tda.Collection
*	@extends com.spinal.core.Class
**/
var Collection = Spinal.namespace('com.spinal.util.tda.Collection', Spinal.com.spinal.core.Class.inherit({
	
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
	*	@return {com.spinal.util.tda.Collection}
	**/
	initialize: function() {
		return this;
	},
	
	/**
	*	Add an element and returns it
	*	@public
	*	@method add
	*	@param element {Any} element
	*	@return Any
	**/
	add: function(element) {
		this.collection.push(element);
		return element;
	},
	
	/**
	*	Set a new collection of elements
	*	@public
	*	@method set
	*	@param arr {Array} new collection to be replaced
	*	@return Boolean
	**/
	set: function(arr) {
		this.reset({ silent: true });
		this.collection = this.collection.concat(arr);
		return true;
	},
	
	/**
	*	Set a new collection of elements
	*	@public
	*	@method set
	*	@param ix {Number} index
	*	@return {Any}
	**/
	get: function(ix) {
		if(this.size() < ix) return this.collection[ix];
		return null;
	},
	
	/**
	*	Find element by evaluation defined in finder.
	*	@public
	*	@method findBy
	*	@param finder {Function} matcher function
	*	@return {Any}
	**/
	findBy: function(finder) {
		for(var i = 0; i < this.size(); i++) {
			if(finder(this.collection[i])) 
			return this.collection[i];
		}
	},
	
	/**
	*	Remove an existent element
	*	@public
	*	@method remove
	*	@param ix {Number} index
	*	@return {Any}
	**/
	remove: function(ix) {
		if(this.size() < ix) return this.collection.splice(ix, 1);
		return null;
	},
	
	/**
	*	Clears the collection
	*	@public
	*	@chainable
	*	@method reset
	*	@param opts {Object} Options
	*	@optional
	*	@return {com.spinal.util.tda.Collection}
	**/
	reset: function(opts) {
		opts || (opts = {});
		this.collection = [];
		return this;
	},
	
	/**
	*	Clears the collection
	*	@public
	*	@chainable
	*	@method reset
	*	@return {Number}
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
	*	@return {com.spinal.util.tda.Collection}
	**/
	sort: function(comparator) {
		this.collection.sort(comparator);
		return this;
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
		added: 'com:spinal:util:tda:collection:added',
		/**
		* @event removed
		**/
		removed: 'com:spinal:util:tda:collection:removed',
		/**
		* @event reset
		**/
		reset: 'com:spinal:util:tda:collection:reset'
	}
	
}));