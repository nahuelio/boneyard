/**
*	@module com.spinal.util.factories
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/adt/stack',
		'util/factories/factory'], function(Spinal, Stack, Factory) {

	/**
	*	AsyncFactory Class
	*	This class uses a Stack ADT internally to enqueue resources and trigger the loading phase asynchronously.
	*	After all the resources are loaded, it register them in the factory.
	*	<h5>Usages:</h5>
	*
	*		var myAsyncFactory = new AsyncFactory();
	*			myAsyncFactory.set([{
	*				id: 'resourceA', path: 'path/to/resourceA',
	*				id: 'resourceB', path: 'path/to/resourceB'
	*			}]);
	*			myAsyncFactory.on(AsyncFactory.EVENTS.loaded, myLoadedCallback);
	*			// On each resource loaded and successfuly registered, the callback will be called.
	*			myAsyncFactory.load(_.bind(function(resource) {
	*				myAsyncFactory.getFactory(resource.id);
	*			}, this));
	*
	*	@namespace com.spinal.util.factories
	*	@class com.spinal.util.factories.AsyncFactory
	*	@extends com.spinal.util.factories.Factory
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.adt.Stack
	*	@requires com.spinal.util.factories.Factory
	**/
	var AsyncFactory = Spinal.namespace('com.spinal.util.factories.AsyncFactory', Factory.inherit({

		/**
		*	Stack of factory constructors to load
		*	@public
		*	@property stack
		*	@type {com.spinal.util.adt.Stack}
		**/
		stack: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			this.stack = new Stack([], opts);
			return AsyncFactory.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Set a new collection of elements to be inserted in the factory stack
		*	@public
		*	@method set
		*	@param arr {Array} new collection to be replaced
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		set: function(arr) {
			if(!arr || !_.isArray(arr)) return false;
			this.stack.reset({ silent: true });
			this.stack.set(arr);
			return this;
		},

		/**
		*	Find a the resource inside the factory stack
		*	@public
		*	@method findById
		*	@param id {String} resource id
		*	@return Object
		**/
		findById: function(id) {
			return this.stack.find(_.bind(function(r) { return (r.id && id && id === id); }, this));
		},

		/**
		*	Find a the resource position (0-based) in the factory stack
		*	@public
		*	@method findPos
		*	@param resource {String} resource reference
		*	@return Number
		**/
		findPos: function(resource) {
			return this.stack.search(resource);
		},

		/**
		*	Inserts a resource into the factory stack
		*	@public
		*	@chainable
		*	@method push
		*	@param resource {Object} resource
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		push: function(resource) {
			if(!resource.id || !resource.path) return this;
			this.stack.push(resource);
			return this;
		},

		/**
		*	Removes a resource from the factory stack
		*	@public
		*	@chainable
		*	@method remove
		*	@param resource {Object} resource reference
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		remove: function(resource, opts) {
			opts || (opts = {});
			if(!resource) return this;
			this.stack.remove(this.stack.search(resource), opts);
			return this;
		},

		/**
		*	Checks if the resource already exists in the factory stack by id passed as parameter
		*	@public
		*	@method exists
		*	@param id {String} resource id
		*	@return Boolean
		**/
		exists: function(id) {
			return (this.findById(id) !== null);
		},

		/**
		*	Load all resources in the factory stack if the stack is not empty
		*	@public
		*	@method load
		*	@param callback {Function} callback to execute on every resource loaded
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		load: function(callback, opts) {
			opts || (opts = {});
			return _.defer(_.bind(function() {
				if(this.stack.size() <= 0) return this;
				if(!opts.silent) this.trigger(AsyncFactory.EVENTS.prepared, this.stack.collection);
				return this._execute(callback, opts);
			}, this));
		},

		/**
		*	Handle Resources loaded by the current factory stack
		*	@private
		*	@method _handle
		*	@param resources {Array} resource reference
		*	@param callback {Function} callback to execute on every resource loaded
		*	@param [opts] {Object} options
		*	@return Array
		**/
		_handle: function(resources, callback, opts) {
			return _.map(resources, function(resource) {
				var registered = AsyncFactory.__super__.register.call(this, this.stack.pop().id, resource);
				if(callback && _.isFunction(callback)) callback(registered);
				return registered;
			}, this);
		},

		/**
		*	Triggers loading phase of the current resources in the factory stack
		*	@private
		*	@method _execute
		*	@param callback {Function} callback to execute on every resource loaded
		*	@param [opts] {Object} options
		*	@return Boolean
		**/
		_execute: function(callback, opts) {
			var paths = this.stack.map(function(resource) { return resource.path; });
			require(paths, _.bind(function() {
				var resources = this._handle(Array.prototype.slice.call(arguments), callback, opts);
				if(!opts.silent) this.trigger(AsyncFactory.EVENTS.loaded, resources);
			}, this), _.bind(function() { this.trigger(AsyncFactory.EVENTS.failed, arguments); }, this));
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
