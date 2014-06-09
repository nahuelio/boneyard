/**
*	@module com.spinal.util.factories
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/adt/collection'], function(Spinal, Collection) {

	/**
	*	Generic Factory
	*	@namespace com.spinal.util.factories
	*	@class com.spinal.util.factories.Factory
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.adt.Collection
	**/
	var Factory = Spinal.namespace('com.spinal.util.factories.Factory', Spinal.SpinalClass.inherit({

		/**
		*	Returns a factory that has been registered with the id passed as parameter.
		*	@public
		*	@method getFactory
		*	@param id {String} Factory Id
		*	@return Object
		**/
		getFactory: function(id) {
			if(!this.constructor.Factories) throw new FactoryException('UnsupportedFactory');
			return this.constructor.factories.find(function(f) { return (f.id === id); });
		},

		/**
		*	Register a new generic constructor function as Factory
		*	@public
		*	@method register
		*	@param id {String} Factory Id
		*	@param constructor {Function} constructor Function
		*	@return Function
		**/
		register: function(id, constructor) {
			if(!id || !constructor) return null;
			if(!this.getFactory(id)) this.constructor.factories.add({ id: id, create: constructor });
			return constructor;
		},

		/**
		*	UnRegister a existing factory
		*	@public
		*	@method unregister
		*	@param id {String} Factory Id
		*	@return Function
		**/
		unregister: function(id) {
			if(!id) return null;
			if(this.getFactory(id)) return this.constructor.factories.removeBy(function(f) { return (f.id === id); })[0];
		},

		/**
		*	Factory Method create
		*	@public
		*	@method create
		*	@return Object
		**/
		create: function(id) {
			var factory = this.getFactory(id);
			if(!factory) throw new FactoryException('UnregisteredFactory');
			return new factory.create(arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Factory',

		/**
		*	@static
		*	@property Factories
		*	@type {com.spinal.util.adt.Collection}
		**/
		Factories: new Collection()

	}));

	return Factory;

});
