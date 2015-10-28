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
	*	@requires com.spinal.util.adt.Stack
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
		*	Returns true if the resource meet minimum conditions to be added into this factory stack
		*	@public
		*	@method valid
		*	@param [resource] {Object} resource reference
		*	@return Boolean
		**/
		valid: function(resource) {
			if(!_.defined(resource) || !resource.path) return false;
			return true;
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
			if(!arr || !_.isArray(arr) || !_.every(this.invoke('valid', arr))) return this;
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
			return this.resources.find(_.bind(function(r) { return (path && r.path === path); }, this));
		},

		/**
		*	Find a resource position (0-index based) inside the resource stack by predicate
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
			if(!this.valid(resource)) return this;
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
		*	Default Load Handler
		*	@public
		*	@method onLoad
		*	@param [callback] {Function} optional callback
		*	@param [opts] {Object} additional options
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		onLoad: function(callback, opts) {
			var rs = this._handle(Array.prototype.slice.call(arguments, 2), opts);
			if(callback && _.isFunction(callback)) callback(rs);
			if(!opts.silent) this.trigger(AsyncFactory.EVENTS.loaded, rs);
			return this;
		},

		/**
		*	Default Error Handler
		*	@public
		*	@method onError
		*	@param err {Object} error reference
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		onError: function(err) {
			return this.trigger(AsyncFactory.EVENTS.failed, err);
		},

		/**
		*	Handle Resources loaded by the current factory resource collection
		*	@private
		*	@method _handle
		*	@param resources {Array} resource reference
		*	@param [opts] {Object} additional options
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
		*	Enqueues and triggers a new require call.
		*	If subsequents calls are made, the queue will manage asynchronous to be called in FIFO order.
		*	This is: always execute the callback before calling a new "require" call.
		*	@private
		*	@method _require
		*	@param paths {Array} collection of require paths to modules
		*	@param [callback] {Function} optional callback
		*	@param [opts] {Object} additional options
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		_require: function(paths, callback, opts) {
			require(paths, _.bind(this.onLoad, this, callback, opts), _.bind(this.onError, this));
			return this;
		},

		/**
		*	Triggers loading phase by enqueing require calls to pull resources in the current factory resource stack.
		*	@private
		*	@method _execute
		*	@param callback {Function} callback to be executed after all resources are loaded
		*	@param [opts] {Object} options
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		_execute: function(callback, opts) {
			return this._require(_.pluck(this.resources.collection, 'path'), callback, opts);
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
