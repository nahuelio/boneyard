/**
*	@module com.spinal.util.factories
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/factories/factory',
		'util/adt/stack',
		'util/string'], function(Spinal, Factory, Stack, StringUtil) {

	/**
	*	AsyncFactory Class
	*	After all the resources are loaded, it register them in the factory.
	*	<h5>Usages:</h5>
	*
	*		var myAsyncFactory = new AsyncFactory();
	*			myAsyncFactory.set([{
	*				path: 'path/to/resourceA',
	*				path: 'path/to/resourceB', callback: function() { }
	*			}]);
	*			myAsyncFactory.on(AsyncFactory.EVENTS.loaded, myLoadedCallback);
	*			// On each resource loaded and successfuly registered, the callback will be called.
	*			myAsyncFactory.load(_.bind(function(path, resource) {
	*				// make use of resource or the path of the resource ('resourceA' or 'resourceB');
	*			}, this));
	*
	*	@namespace com.spinal.util.factories
	*	@class com.spinal.util.factories.AsyncFactory
	*	@extends com.spinal.util.factories.Factory
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.factories.Factory
	*	@requires com.spinal.util.adt.Collection
	*	@requires com.spinal.util.StringUtil
	**/
	var AsyncFactory = Spinal.namespace('com.spinal.util.factories.AsyncFactory', Factory.inherit({

		/**
		*	Factory Stack
		*	@public
		*	@property resources
		*	@type com.spinal.adt.Stack
		**/
		resources: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [opts] {Object} options
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		initialize: function(opts) {
			opts || (opts = {});
			this.resources = new Stack([], opts);
			return AsyncFactory.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Reset factory stack
		*	@public
		*	@method reset
		*	@param [opts] {Object} options
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		reset: function(opts) {
			opts || (opts = {});
			this.resources.reset(opts);
			return this;
		},

		/**
		*	Set a new collection of elements to be inserted in the factory stack
		*	Resource collection gets reset with new data if this method is called.
		*	@public
		*	@chainable
		*	@method set
		*	@param arr {Array} new collection to be replaced
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		set: function(arr) {
			if(!arr || !_.isArray(arr)) return false;
			this.resources.set(arr);
			return this;
		},

		/**
		*	Find a resource inside the factory stack by path
		*	@public
		*	@method findByPath
		*	@param path {String} resource path
		*	@return Object
		**/
		findByPath: function(path) {
			return this.stack.find(_.bind(function(r) { return (path && r.path === path); }, this));
		},

		/**
		*	Find a resource inside the resource collection by predicate
		*	@public
		*	@method findPosBy
		*	@param predicate {Function} predicate function used for evaluation
		*	@return Object
		**/
		findPosBy: function(predicate) {
			return this.resources.findPosBy(predicate);
		},

		/**
		*	Inserts a resource into the factory resource collection if the resource doesn't exists
		*	@public
		*	@chainable
		*	@method push
		*	@param resource {Object} resource
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		push: function(resource) {
			if(!resource || !resource.path) return this;
			this.resources.push(resource);
			return this;
		},

		/**
		*	Removes using (0-based) position of an existing resource from the factory stack
		*	@public
		*	@chainable
		*	@method remove
		*	@param ix {Object} (0-based) index position of the resource
		*	@param [opts] {Object} additional options
		*	@return Object
		**/
		remove: function(ix, opts) {
			return this.resources.remove(ix, opts);
		},

		/**
		*	Checks if the resource already exists in the factory resource collection by path passed as parameter
		*	@public
		*	@method exists
		*	@param path {String} resource path
		*	@return Boolean
		**/
		exists: function(path) {
			return _.defined(this.findByPath(path));
		},

		/**
		*	Swaps positions of 2 resources inside the factory resource collection.
		*	@public
		*	@method swap
		*	@param comparator {Function} predicate that evaluates when the swap should take place
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		swap: function(comparator) {
			this.resources.swap(comparator);
			return this;
		},

		/**
		*	Load all resources in the factory resource collection if it's not empty
		*	@public
		*	@chainable
		*	@method load
		*	@param callback {Function} callback to execute on every resource loaded
		*	@param [opts] {Object} options
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		load: function(callback, opts) {
			opts || (opts = {});
			if(this.resources.size() <= 0) {
				if(callback && _.isFunction(callback)) callback([]);
				return this;
			}
			if(!opts.silent) this.trigger(AsyncFactory.EVENTS.prepared, this.resources.collection);
			return this._execute(callback, opts);
		},

		/**
		*	Handle Resources loaded by the current factory resource collection
		*	@private
		*	@method _handle
		*	@param resources {Array} resource reference
		*	@param [opts] {Object} options
		*	@return Array
		**/
		_handle: function(resources, opts) {
			return _.map(resources, function(resource) {
				var res = this.resources.pop();
				var registered = AsyncFactory.__super__.register.call(this, res.path, resource, res.options);
				if(!opts.silent && res.callback && _.isFunction(res.callback)) res.callback(res.path, resource);
				return registered;
			}, this);
		},

		/**
		*	Triggers loading phase of the current resources in the factory resource collection
		*	@private
		*	@method _execute
		*	@param callback {Function} callback to be executed after all resources are loaded
		*	@param [opts] {Object} options
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		_execute: function(callback, opts) {
			var paths = _.pluck(this.resources.collection, 'path');
			require(paths, _.bind(function() {
				var rs = this._handle(Array.prototype.slice.apply(arguments), opts);
				if(callback && _.isFunction(callback)) callback(rs);
				if(!opts.silent) this.trigger(AsyncFactory.EVENTS.loaded, rs);
			}, this), _.bind(function(err) { this.trigger(AsyncFactory.EVENTS.failed, err); }, this));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'AsyncFactory',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			* @event loaded
			**/
			loaded: 'com:spinal:util:factories:async:loaded',
			/**
			* @event loaded
			**/
			failed: 'com:spinal:util:factories:async:failed',
			/**
			* @event prepared
			**/
			prepared: 'com:spinal:util:factories:async:prepared'
		}

	}));

	return AsyncFactory;

});
