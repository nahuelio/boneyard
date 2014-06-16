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
			return new factory.create(Array.prototype.slice.call(1, arguments));
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
