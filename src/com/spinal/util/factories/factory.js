/**
*	@module com.spinal.util.factories
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	FIXME: Resolve factories static access to instance member.
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
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.factories.Factory}
		**/
		initialize: function() {
			return Factory.__super__.initialize.apply(this, arguments);
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
		*	@property factories
		*	@type {com.spinal.util.adt.Collection}
		**/
		factories: new Collection(),

		/**
		*	Returns a factory that has been registered with the id passed as parameter.
		*	@static
		*	@method GetFactory
		*	@param id {String} Factory Id
		*	@return Object
		**/
		GetFactory: function(id) {
			return this.factories.find(function(f) { return (f.id === id); });
		},

		/**
		*	Register a new generic constructor function as Factory
		*	@static
		*	@method Register
		*	@param id {String} Factory Id
		*	@param constructor {Function} constructor Function
		*	@return Function
		**/
		Register: function(id, constructor) {
			if(!id || !constructor) return null;
			if(!this.getFactory(id)) this.factories.add({ id: id, create: constructor });
			return constructor;
		},

		/**
		*	UnRegister a existing factory
		*	@static
		*	@method Unregister
		*	@param id {String} Factory Id
		*	@return Function
		**/
		Unregister: function(id) {
			if(!id) return null;
			if(this.getFactory(id)) return this.factories.removeBy(function(f) { return (f.id === id); })[0];
		},

		/**
		*	Factory Method create
		*	@static
		*	@method Create
		*	@return Object
		**/
		Create: function(id) {
			var factory = this.getFactory(id);
			if(!factory) throw new FactoryException('UnregisteredFactory');
			return new factory.create(Array.prototype.slice.call(1, arguments));
		}

	}));

	return Factory;

});
