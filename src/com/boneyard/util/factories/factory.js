/**
*	@module com.boneyard.util.factories
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/boneyard',
	'util/adt/collection',
	'util/exception/util/factory'], function(Boneyard, Collection, FactoryException) {

	/**
	*	Class Factory
	*	@namespace com.boneyard.util.factories
	*	@class com.boneyard.util.factories.Factory
	*	@extends com.boneyard.core.Boneyard.Class
	*
	*	@requires com.boneyard.core.Boneyard
	*	@requires com.boneyard.util.exception.util.FactoryException
	*	@requires com.boneyard.util.adt.Collection
	**/
	var Factory = Boneyard.namespace('com.boneyard.util.factories.Factory', Boneyard.Class.inherit({

		/**
		*	Collection of factory objects
		*	@public
		*	@property factories
		*	@type com.boneyard.util.adt.Collection
		**/
		factories: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.boneyard.util.factories.Factory
		**/
		initialize: function() {
			this.factories = new Collection();
			return Factory.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Creates a pseudo constructor to allow passing an argument list with the new operator.
		*	This utility function checks first if the factory obj is a constructor function or a simple object,
		*	in order to decide to create a pseudo constructor or not.
		*	In the case of a simple object, the arguments passed will be ignored returning the object reference.
		*	@private
		*	@method _construct
		*	@param factory {Object} Original factoryObj
		*	@return Function
		**/
		_construct: function(factory, args) {
			if(!_.isFunction(factory)) return factory;
			function F() { return factory.apply(this, args); }
		    F.prototype = factory.prototype;
		    return new F();
		},

		/**
		*	Returns a factory that has been registered with the id passed as parameter.
		*	@public
		*	@method GetFactory
		*	@param path {String} Factory path
		*	@return Object
		**/
		getFactory: function(path) {
			return this.factories.find(_.bind(function(f) { return (f.path === path); }, this));
		},

		/**
		*	Returns true if the factory is already registered, otherwise returns false.
		*	@public
		*	@method isRegistered
		*	@param path {String} Factory path
		*	@return Boolean
		**/
		isRegistered: function(path) {
			return _.defined(this.getFactory(path));
		},

		/**
		*	Register a new generic factoryObj as Factory
		*	@public
		*	@method Register
		*	@param path {String} factory path
		*	@param factory {Object} factoryObj
		*	@return Function
		**/
		register: function(path, factory) {
			if(!path || !factory) return null;
			if(!this.getFactory(path)) this.factories.add({
				path: path,
				factory: factory,
				options: Array.prototype.slice.call(arguments, 2)
			});
			return factory;
		},

		/**
		*	UnRegister a existing factory
		*	@public
		*	@method Unregister
		*	@param path {String} Factory path
		*	@return Object
		**/
		unregister: function(path) {
			if(!path) return null;
			return (this.getFactory(path)) ?
				this.factories.removeBy(_.bind(function(f) { return (f.path === path); }, this))[0] : null;
		},

		/**
		*	Factory Method Create
		*	@public
		*	@method Create
		*	@return Object
		**/
		create: function(path) {
			var f = this.getFactory(path);
			if(!f) throw new FactoryException('UnregisteredFactory', { path: path });
			var args = Array.prototype.slice.call(arguments, 1);
			args = (args && args.length > 0) ? args : f.options;
			return this._construct(f.factory, args);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Factory'

	}));

	return Factory;

});
