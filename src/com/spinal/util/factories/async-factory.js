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
	*			myAsyncFactory.load(_.bind(function(id, resource) {
	*				// make use of resource or the id of the resource ('resourceA' or 'resourceB');
	*			}, this));
	*
	*	Needless to say that the main purpose of having a Stack class supporting the asynchronous factory implementation
	*	is essentially, to provide a common interface to manage the resources list by easily 'convention' rather than
	*	supporting the intrinsect mechanisms to load the resources "one by one", since the resource queue is being managed
	*	internally by requirejs itself.
	*	With that being said, this class is suceptible to be changed to "inject" different async strategies as
	*	"Adapter" classes instead. (The developer should NOT notice any difference on the High-level API).
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
		*	Resets the factory stack
		*	@public
		*	@chainable
		*	@method reset
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		reset: function(opts) {
			this.stack.reset(opts);
			return this;
		},

		/**
		*	Set a new collection of elements to be inserted in the factory stack
		*	@FIXME: Must validate same rules as 'push' but atomically.
		*	@public
		*	@chainable
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
			return this.stack.find(_.bind(function(r) { return (r.id && id && r.id === id); }, this));
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
			if(!resource || !resource.id || !resource.path) return this;
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
			return !_.isUndefined(this.findById(id));
		},

		/**
		*	Load all resources in the factory stack if the stack is not empty
		*	@public
		*	@chainable
		*	@method load
		*	@param callback {Function} callback to execute on every resource loaded
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		load: function(callback, opts) {
			opts || (opts = {});
			if(this.stack.size() <= 0) return this;
			if(!opts.silent) this.trigger(AsyncFactory.EVENTS.prepared, this.stack.collection);
			return this._execute(callback, opts);
		},

		/**
		*	Handle Resources loaded by the current factory stack
		*	@private
		*	@method _handle
		*	@param resources {Array} resource reference
		*	@param [opts] {Object} options
		*	@return Array
		**/
		_handle: function(resources, opts) {
			return _.map(resources, function(resource) {
				var res = this.stack.pop(),
					registered = AsyncFactory.__super__.register.call(this, res.id, resource);
				if(!opts.silent && res.callback && _.isFunction(res.callback)) res.callback(res.id, resource);
				return registered;
			}, this);
		},

		/**
		*	Triggers loading phase of the current resources in the factory stack
		*	@private
		*	@method _execute
		*	@param callback {Function} callback to be executed after all resources are loaded
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		_execute: function(callback, opts) {
			var paths = this.stack.map(function(resource) { return resource.path; });
			require(paths, _.bind(function() {
				var resources = this._handle(Array.prototype.slice.call(arguments), opts);
				if(callback && _.isFunction(callback)) callback(resources);
				if(!opts.silent) this.trigger(AsyncFactory.EVENTS.loaded, resources);
			}, this), _.bind(function(err) { this.trigger(AsyncFactory.EVENTS.failed, err); }, this));
			return this;
		},

		/**
		*	Debug Function
		**/
		_debug: function() {
			return this.stack.map(function(resource) { return resource.path; }).join(', ');
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
