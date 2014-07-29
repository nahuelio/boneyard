/**
*	@module com.spinal.util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/error/types/factory-exception',
		'util/adt/collection'], function(Spinal, FactoryException, Collection) {

	/**
	*	Generic Factory
	*	@namespace com.spinal.util
	*	@class com.spinal.util.Factory
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.adt.Collection
	**/
	var Factory = Spinal.namespace('com.spinal.util.Factory', Spinal.SpinalClass.inherit({

		/**
		*	@public
		*	@property factories
		*	@type {com.spinal.util.adt.Collection}
		**/
		factories: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.Factory}
		**/
		initialize: function() {
			this.factories = new Collection();
			return Factory.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Creates a pseudo constructor to allow passing an argument list with the new operator.
		*	@private
		*	@method _construct
		*	@param constructor {Function} Original Constructor function
		*	@return {Function}
		**/
		_construct: function(constructor, args) {
			function F() { return constructor.apply(this, args); }
		    F.prototype = constructor.prototype;
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
		*	Register a new generic constructor function as Factory
		*	@public
		*	@method Register
		*	@param id {String} Factory Id
		*	@param constructor {Function} constructor Function
		*	@return Function
		**/
		register: function(id, constructor) {
			if(!id || !constructor) return null;
			if(!this.getFactory(id)) this.factories.add({ id: id, create: constructor });
			return constructor;
		},

		/**
		*	UnRegister a existing factory
		*	@public
		*	@method Unregister
		*	@param id {String} Factory Id
		*	@return Function
		**/
		unregister: function(id) {
			if(!id) return null;
			if(this.getFactory(id)) return this.factories.removeBy(function(f) { return (f.id === id); })[0];
		},

		/**
		*	Factory Method create
		*	@public
		*	@method Create
		*	@return Object
		**/
		create: function(id) {
			var factory = this.getFactory(id);
			if(!factory) throw new FactoryException('UnregisteredFactory');
			return this._construct(factory.create, Array.prototype.slice.call(arguments, 1));
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
