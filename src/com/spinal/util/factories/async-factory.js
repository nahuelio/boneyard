/**
*	@module com.spinal.util.factories
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/adt/stack',
		'util/factories/factory'], function(Spinal, Stack, Factory) {

	/**
	*	AsyncFactory Class
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
		*	Load all resources in the factory stack
		*	@public
		*	@method load
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		load: function(opts) {
			opts || (opts = {});
			// CONTINUE HERE... Refactoring com.spinal.ioc.BoneFactory on this one and extract the logic.
			// TODO: Trigger require() one by one will not have any benefit considering we are using
			// requirejs and it does exactly the same thing.
			// So let's trigger all at once ([resources]) and make use of callbacks like these:
			/**
			*	opts.success -> on every resource loaded
			*	opts.fail -> on every resource failed to load -> throw exception.
			*	opts.callback -> final one to be executed at the end of the load method.
			**/
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'AsyncFactory'

	}));

	return AsyncFactory;

});
