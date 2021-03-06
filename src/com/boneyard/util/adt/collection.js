/**
*	@module com.boneyard.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/boneyard',
	'util/adt/iterator',
	'util/object'], function(Boneyard, Iterator, ObjectUtil) {

	/**
	*	Class Collection
	*	@namespace com.boneyard.util.adt
	*	@class com.boneyard.util.adt.Collection
	*	@extends com.boneyard.core.Boneyard.Class
	*
	*	@requires com.boneyard.core.Boneyard
	*	@requires com.boneyard.util.adt.Iterator
	*	@requires com.boneyard.util.ObjectUtil
	**/
	var Collection = Boneyard.namespace('com.boneyard.util.adt.Collection', Boneyard.Class.inherit({

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
		*	@return com.boneyard.util.adt.Collection
		**/
		initialize: function(initial, opts) {
			opts || (opts = {});
			this.collection = [];
			if(opts.interface) this._interface = opts.interface;
			(initial) ? this.set(initial, opts) : (this.collection = []);
			return Collection.__super__.initialize.apply(this, arguments);
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
			if(!_.defined(arr) || !_.isArray(arr) || !_.every(Collection.__super__.invoke.call(this, '_valid', arr)))
				return false;
			this.reset({ silent: true });
			Collection.__super__.invoke.call(this, 'add', arr);
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
			if(_.defined(this._interface) && !(element instanceof this._interface)) {
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
		*	@return Array
		**/
		invoke: function(methodName) {
			var args = _.flatten(Array.prototype.slice.call(arguments, 1));
			args.unshift(this.collection, methodName);
			return _.invoke.apply(this, args);
		},

		/**
		*	Iterate over all the elements inside the collection by using func as the predicate.
		*	@public
		*	@method each
		*	@param func {Function} predicate function used to iterate over the elements.
		*	@return Array
		**/
		each: function(func) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this.collection);
			return _.each.apply(this, args);
		},

		/**
		*	Filter result by iterating over all the elements inside the collection given a predicate.
		*	@public
		*	@method filter
		*	@param func {Function} predicate function used to iterate over the elements.
		*	@return Array
		**/
		filter: function(func) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this.collection);
			return _.filter.apply(this, args);
		},

		/**
		*	Produces a new array of values by mapping each value in list through a transformation function (predicate)
		*	@public
		*	@method map
		*	@param func {Function} predicate function used to iterate over the elements.
		*	@return Array
		**/
		map: function(func) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this.collection);
			return _.map.apply(this, args);
		},

		/**
		*	Looks through the list and returns the first value that matches
		*	all of the key-value pairs listed in properties.
		*	@public
		*	@method findWhere
		*	@param element {Object} key-value pair object to evaluate
		*	@return Object
		**/
		findWhere: function(element) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this.collection);
			return _.findWhere.apply(this, args);
		},

		/**
		*	Returns true if this collection contains any elements evaluated by predicate passed by parameter.
		*	@public
		*	@method containsBy
		*	@param predicate {Function} predicate function used for evaluation
		*	@param element {Object} element to evaluate
		*	@return Boolean
		**/
		containsBy: function(predicate, element) {
			if(!element || !predicate || !_.isFunction(predicate)) return false;
			var result = false, col = (this._interface && this._interface.prototype.toJSON) ?
				this.invoke('toJSON') : this.collection;
			for(var i = 0; i < col.length; i++) {
				if(predicate(element, col[i])) { result = true; break; }
			}
			return result;
		},

		/**
		*	Returns true if this collection contains the specified element.
		*	@public
		*	@method contains
		*	@param element {Object} element to evaluate
		*	@return Boolean
		**/
		contains: function(element) {
			if(!this._valid(element) || this.isEmpty()) return false;
			var result = false, col = (this._interface && this._interface.prototype.toJSON) ?
				this.invoke('toJSON') : this.collection;
			for(var i = 0; i < col.length; i++) {
				if(_.isEqual(col[i], element)) { result = true; break; }
			}
			return result;
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
		*	@return {com.boneyard.util.adt.Iterator}
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
			if(!_.isUndefined(ix) && _.isNumber(ix) && ix >= 0 && ix < this.size()) {
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
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this.collection);
			return _.find.apply(this, args);
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
				if(finder(this.collection[i], i)) found.push(this.collection[i]);
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
		findPosBy: function(finder) {
			for(var i = 0, ix = -1; i < this.size(); i++) {
				if(finder(this.collection[i], i)) { ix = i; break; }
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
		*	@return {com.boneyard.util.adt.Collection}
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
		*	@method isEmpty
		*	@return Boolean
		**/
		isEmpty: function() {
			return (this.size() === 0);
		},

		/**
		*	Returns the size of the collection.
		*	@public
		*	@method size
		*	@return Number
		**/
		size: function() {
			return this.collection.length;
		},

		/**
		*	Sort the collection by comparator passed as parameter.
		*	If the function comparator is ommited, the standard sort will be applied.
		*	@public
		*	@chainable
		*	@method sort
		*	@param comparator {Function} comparator function
		*	@return {com.boneyard.util.adt.Collection}
		**/
		sort: function(comparator) {
			(!_.isUndefined(comparator) && _.isFunction(comparator)) ?
				this.collection.sort(comparator) :
				this.collection.sort();
			return this;
		},

		/**
		*	Swap element positions that matches the comparator evaluation function
		*	@public
		*	@chainable
		*	@method swap
		*	@param comparator {Function} comparator function
		*	@return {com.boneyard.util.adt.Collection}
		**/
		swap: function(comparator) {
			if(!_.isUndefined(comparator) && _.isFunction(comparator)) {
				for(var i = 0; i < this.collection.length; i++) {
					var ix = comparator(this.collection[i], i);
					if(!_.isNull(ix) && ix > -1) {
						var e = this.collection[i];
						this.collection[i] = this.collection[ix];
						this.collection[ix] = e;
					}
				}
			}
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
			added: 'com:boneyard:util:adt:collection:added',
			/**
			* @event removed
			**/
			removed: 'com:boneyard:util:adt:collection:removed',
			/**
			* @event addedAll
			**/
			addedAll: 'com:boneyard:util:adt:collection:addedAll',
			/**
			* @event removedAll
			**/
			removedAll: 'com:boneyard:util:adt:collection:removedAll',
			/**
			* @event reset
			**/
			reset: 'com:boneyard:util:adt:collection:reset'
		}

	}));

	return Collection;

});
