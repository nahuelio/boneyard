/**
*	@module com.spinal.util.factories
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/factory',
		'util/adt/collection'], function(Spinal, FactoryException, Collection) {

	/**
	*	Generic Factory
	*	@namespace com.spinal.util.factories
	*	@class com.spinal.util.factories.Factory
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.exception.FactoryException
	*	@requires com.spinal.util.adt.Collection
	**/
	var Factory = Spinal.namespace('com.spinal.util.factories.Factory', Spinal.SpinalClass.inherit({

		/**
		*	Collection of factory objects
		*	@public
		*	@property factories
		*	@type {com.spinal.util.adt.Collection}
		**/
		factories: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.factories.Factory}
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
		*	@return {Function}
		**/
		_construct: function(factory, args) {
			if(!_.isFunction(factory)) return factoryObj;
			function F() { return factory.apply(this, args); }
		    F.prototype = factory.prototype;
		    return new F();
		},

		/**
		*	Returns a factory that has been registered with the id passed as parameter.
		*	@public
		*	@method GetFactory
		*	@param id {String} Factory Id
		*	@return Object
		**/
		getFactory: function(id) {
			return this.factories.find(function(f) { return (f.id === id); });
		},

		/**
		*	Register a new generic factoryObj as Factory
		*	@public
		*	@method Register
		*	@param id {String} Factory Id
		*	@param factory {Object} factoryObj
		*	@return Function
		**/
		register: function(id, factory) {
			if(!id || !factory) return null;
			if(!this.getFactory(id)) this.factories.add({ id: id, factory: factory });
			return factory;
		},

		/**
		*	UnRegister a existing factory
		*	@public
		*	@method Unregister
		*	@param id {String} Factory Id
		*	@return Object
		**/
		unregister: function(id) {
			if(!id) return null;
			if(this.getFactory(id)) return this.factories.removeBy(function(f) { return (f.id === id); })[0];
		},

		/**
		*	Factory Method Create
		*	@public
		*	@method Create
		*	@return Object
		**/
		create: function(id) {
			var f = this.getFactory(id);
			if(!f) throw new FactoryException('UnregisteredFactory', { id: id });
			return this._construct(f.factory, Array.prototype.slice.call(arguments, 1));
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
