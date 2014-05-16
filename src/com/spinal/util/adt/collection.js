/**
*	@module com/spinal/util/adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Define a generic interface of a Collection
	*	@namespace com.spinal.util.adt
	*	@class com.spinal.util.adt.Collection
	*	@extends com.spinal.core.Class
	**/
	var Collection = Spinal.namespace('com.spinal.util.adt.Collection', Spinal.com.spinal.core.SpinalClass.inherit({

		/**
		*	Internal Array
		*	@public
		*	@property collection
		*	@type Array
		**/
		collection: [],

		/**
		*	Interface reference, usually a constructor function that identifies
		*	the types of object that this collection can contain.
		*	@private
		*	@property interface
		*	@type Function
		**/
		_interface: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param attrs {Array} initial elements in the collection.
		*	@param opts {Object} Additional options.
		*	@return {com.spinal.util.adt.Collection}
		**/
		initialize: function(attrs, opts) {
			opts || (opts = {});
			if(opts.interface) this._interface = opts.interface;
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
			if(!this._valid(arr) || !_.isArray(arr)) return false;
			this.reset({ silent: true });
			(!_.isNull(this._interface)) ?
				this.collection = _.compact(_.map(arr, function(ele) { if(ele) return new this._interface(ele); })) :
				this.collection = arr.slice(0); // build new array from array (clone method).
			return true;
		},

		/**
		*	Returns the element in the index specified as parameter. If it's not found, returns null.
		*	@public
		*	@method get
		*	@param ix {Number} index
		*	@return Object
		**/
		get: function(ix) {
			if(ix < this.size()) return this.collection[ix];
			return null;
		},

		/**
		*	Add an object element and returns it
		*	@public
		*	@method add
		*	@param element {Object} element
		*	@param opts {Object} extra options
		*	@optional
		*	@return Object
		**/
		add: function(element, opts) {
			opts || (opts = {});
			if(!this._valid(element)) return null;
			(!_.isNull(this._interface)) ?
				this.collection.push(new this._interface(element)) :
				this.collection.push(element);
			if(!opts.silent) this.trigger(Collection.EVENTS.added, { added: element, collection: this });
			return element;
		},

		/**
		*	Add collection of elements to the current collection of elements.
		*	@public
		*	@method addAll
		*	@param elements {Array} Array of elements (Objects)
		*	@param opts {Object} extra options
		*	@optional
		*	@return Boolean
		**/
		addAll: function(elements, opts) {
			opts || (opts = {});
			if(!this._valid(elements) || !_.isArray(elements)) return false;
			if(!_.isNull(this._interface)) {
				elements = _.compact(_.map(elements, function(ele) { if(ele) return new this._interface(ele); }));
			}
			this.collection = this.collection.concat(elements);
			if(!opts.silent) this.trigger(Collection.EVENTS.addedAll, { addedAll: elements, collection: this });
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
			return (_.filter((!_.isNull(this._interface)) ? _.invoke(this.collection, 'toJSON') : this.collection, _.matches(element)).length > 0);
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
		*	@param opts {Object} extra options
		*	@optional
		*	@return Object
		**/
		remove: function(ix, opts) {
			opts || (opts = {});
			if(ix && _.isNumber(ix) && this.size() < ix) {
				var rmArr = this.collection.splice(ix, 1);
				if(!opts.silent) this.trigger(Collection.EVENTS.removed, { removed: rmArr[0], collection: this });
				return rmArr[0];
			}
			return null;
		},

		/**
		*	Remove element/s that match the evaluation in finder
		*	@public
		*	@method removeBy
		*	@param finder {Function} matcher function
		*	@param opts {Object} extra options
		*	@optional
		*	@return {Array}
		**/
		removeBy: function(finder, opts) {
			opts || (opts = {});
			var len = this.size();
			for(var i = 0, removed = []; i < len; i++) {
				if(finder(this.collection[i])) removed.push(this.remove(i, opts));
			}
			return removed;
		},

		/**
		*	Removes all collection's elements that are also contained in the collection specified by parameter.
		*	@public
		*	@method removeAll
		*	@param elements {Array} Collection of elements to be removed.
		*	@param opts {Object} extra options
		*	@optional
		*	@return Boolean
		**/
		removeAll: function(elements, opts) {
			opts || (opts = {});
			if(!this._valid(elements) || !_.isArray(elements)) return false;
			var removed = (this.removeBy(_.bind(function(element) {
				return (_.filter(elements, _.matches(element)).length > 0);
			}, this)).length > 0);
			if(!opts.silent && removed) this.trigger(Collection.EVENTS.removedAll, { collection: this });
			return removed;
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
			if(!opts.silent) this.trigger(Collection.EVENTS.reset, { collection: this });
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
			* @event addedAll
			**/
			addedAll: 'com:spinal:util:adt:collection:addedAll',
			/**
			* @event addedAll
			**/
			removedAll: 'com:spinal:util:adt:collection:removedAll',
			/**
			* @event reset
			**/
			reset: 'com:spinal:util:adt:collection:reset'
		}

	}));

	return Collection;

});
