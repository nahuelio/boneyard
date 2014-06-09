/**
*	@module com/spinal/ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/factories/factory',
		'util/adt/collection'], function(Spinal, Factory, Collection) {

	/**
	*	IOC Context Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.Context
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.factories.Factory
	*	@requires com.spinal.util.adt.Collection
	**/
	var Context = Spinal.namespace('com.spinal.ioc.Context', Factory.inherit({

		/**
		*	Nuts
		*	@public
		*	@property nuts
		*	@type com.spinal.util.adt.Collection
		**/
		nuts: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param [opts] {Object} Initial Options
		*	@return {com.spinal.ioc.Context}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			this.nuts = new Collection();
			return Context.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves a Nut from the current context.
		*	@public
		*	@method getNut
		*	@param id {String} Nut Id
		*	@return Object
		**/
		getNut: function(id) {
			if(!id) return null;
			return this._nextNut(id);
		},

		/**
		*	Module Wire
		*	@public
		*	@chainable
		*	@method wire
		*	@param spec {Object} context specification to be wired
		*	@return {com.spinal.ioc.Context}
		**/
		wire: function(spec) {
			// TODO: Implement Context Hierarchery
			return this;
		},

		/**
		*	Context Specification Create
		*	@public
		*	@chainable
		*	@method create
		*	@return Object
		**/
		create: function() {
			this.trigger(Context.EVENTS.created, { ctx: this });
			return this;
		},

		/**
		*	Context Specification Ready
		*	@public
		*	@chainable
		*	@method ready
		*	@return Object
		**/
		ready: function() {
			this.trigger(Context.EVENTS.ready, { ctx: this });
			return this;
		},

		/**
		*	Tries to retrieve a nut
		*	@private
		*	@method _nextNut
		*	@param id {String} Nut Id
		*	@return Object
		**/
		_nextNut: function(id) {
			/**var ite = this.nuts.iterator();
			// FIXME: Chain of Responsability (depends strategy choosen to decorate contexts)
			while(ite.hasNext()) {
				var nut = ite.next();
			}**/
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Context',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event created
			**/
			created: 'com:spinal:ioc:context:created',
			/**
			*	@event ready
			**/
			ready: 'com:spinal:ioc:context:ready'
		},

		/**
		*	Static IoC Initializer
		*	@static
		*	@method Run
		*	@return com.spinal.ioc.Context
		**/
		Run: function() {
			var $mainSpec = $('html').find('script[data-main-spec]'),
				spec = ($mainSpec.length === 1) ? $mainSpec.data('main-spec') : '';
			Spinal.applicationContext = new Context(spec);
			return Context;
		}

	}));

	return Context;

});
