/**
*	@module com/spinal/util/adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal', 'util/adt/iterator'], function(Spinal, Iterator) {

	/**
	*	Define a generic interface of a Collection
	*	@namespace com.spinal.util.adt
	*	@class com.spinal.util.adt.Collection
	*	@extends com.spinal.core.SpinalClass
	**/
	var Collection = Spinal.namespace('com.spinal.util.adt.Collection', Spinal.com.spinal.core.SpinalClass.inherit({

		/**
		*	Internal Array
		*	@public
		*	@property collection
		*	@type Array
		**/
		collection: null,

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
		*	@param initial {Array} initial elements in the collection.
		*	@param opts {Object} Additional options.
		*	@return {com.spinal.util.adt.Collection}
		**/
		initialize: function(initial, opts) {
			this.collection = [];
			Collection.__super__.initialize.apply(this, arguments);
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
		set: function(arr, opts) {
			opts || (opts = {});
			if(!this._valid(arr) || !_.isArray(arr)) return false;
			this.reset({ silent: true });
			if(opts.interface) this._interface = opts.interface;
			if(!_.isNull(this._interface)) {
				this.collection = _.compact(_.map(arr, function(ele) {
					if(ele) return new this._interface(ele);
				}, this));
			} else {
				this.collection = arr.slice(0); // build new array from array (clone method).
			}
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
			if(!_.isNull(this._interface)) {
				element = new this._interface(element);
				this.collection.push(element);
			} else {
				this.collection.push(element);
			}
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
			elements = _.compact(_.map(elements, function(ele) {
				if(!_.isUndefined(ele)) return (!_.isNull(this._interface)) ? new this._interface(ele) : ele;
			}, this));
			this.collection = this.collection.concat(elements);
			if(!opts.silent) this.trigger(Collection.EVENTS.addedAll, { addedAll: elements, collection: this });
			return true;
		},

		/**
		*	Invoke a method specified by parameter on every the elements inside the collection
		*	@public
		*	@method invoke
		*	@param methodName {String} Method Name to invoke in every element in the collection
		*	@param [*arguments] {Array} arguments to pass to the method invocation.
		*	@return Array
		**/
		invoke: function(methodName) {
			var args = _.flatten(Array.prototype.slice.call(arguments, 1));;
			return _.invoke(this.collection, methodName, args);
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
			if(!_.isNull(this._interface)) {
				var attrs = (this._interface.prototype.toJSON) ? this.invoke('toJSON') : this.collection;
				return (_.filter(attrs, _.matches(element)).length > 0);
			} else {
				return (_.filter(this.collection, _.matches(element)).length > 0);
			}
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
			return _.every(_.map(elements, function(e) { return this.contains(e); }, this));
		},

		/**
		*	Returns an iterator over the elements of this collection.
		*	@public
		*	@method iterator
		*	@return {com.spinal.util.adt.Iterator}
		**/
		iterator: function() {
			return new Iterator(_.clone(this.collection));
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
			if(!_.isUndefined(ix) && _.isNumber(ix) && ix < this.size()) {
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
				if(this.collection[i] && finder(this.collection[i])) {
					removed.push(this.remove(i, opts));
					i--; len--;
				}
			}
			return removed;
		},

		/**
		*	Removes all collection's elements that are also strictly contained in the collection specified by parameter.
		*	@public
		*	@method removeAll
		*	@param elements {Array} Collection of elements to be removed.
		*	@param opts {Object} extra options
		*	@optional
		*	@return Array
		**/
		removeAll: function(elements, opts) {
			opts || (opts = {});
			if(!this._valid(elements) || !_.isArray(elements)) return [];
			var len = this.size(), removed = [];
			for(var i = 0; i < len; i++) {
				if(_.filter(elements, _.matches(this.collection[i])).length > 0) {
					removed.push(this.remove(i, { silent: true }));
					if(i > 0) i--;
					len--;
				}
			}
			if(!opts.silent && removed.length > 0) this.trigger(Collection.EVENTS.removedAll, { removed: removed, collection: this });
			return removed;
		},

		/**
		*	Find an element by evaluation defined in finder.
		*	@public
		*	@method find
		*	@param finder {Function} matcher function
		*	@return Object
		**/
		find: function(finder) {
			if(!finder || !_.isFunction(finder)) return null;
			return _.find(this.collection, finder);
		},

		/**
		*	Find elements by evaluation defined in finder.
		*	@public
		*	@method findBy
		*	@param finder {Function} matcher function
		*	@return Array
		**/
		findBy: function(finder) {
			for(var i = 0, found = []; i < this.size(); i++) {
				if(finder(this.collection[i])) found.push(this.collection[i]);
			}
			return found;
		},

		/**
		*	Find index position of an element that match the evaluation defined in finder.
		*	First element index that matches the evaluation will be returned. Otherwise, it will return null.
		*	@public
		*	@method findPosBy
		*	@param finder {Function} matcher function
		*	@return Object
		**/
		findPos: function(finder) {
			for(var i = 0, ix = null; i < this.size(); i++) {
				if(finder(this.collection[i])) { ix = i; break; }
			}
			return ix;
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
			(!_.isUndefined(comparator) && _.isFunction(comparator)) ?
				this.collection.sort(comparator) :
				this.collection.sort();
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
			* @event removedAll
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
