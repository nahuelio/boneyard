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
	*
	*	Life cycle phases of a Bone (Component) inside a context:
	*
	*	1) $create (Context will register the constructor function as a Factory and instanciate)
	*		a) $module -> AMD module path that points to the module
	*		b) $params -> Arguments to pass to the constructor function
	*	2) $ready -> Bone was fully created and ready to use.
	*	3) $destroy -> Bone was destroyed inside the context allowing to execute code before (after)
	*	a component die.
	**/
	var Context = Spinal.namespace('com.spinal.ioc.Context', Factory.inherit({

		/**
		*	Bones
		*	@public
		*	@property bones
		*	@type com.spinal.util.adt.Collection
		**/
		bones: null,

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
			this.bones = new Collection();
			// if(opts.spec && _.isString(opts.spec)) this.getFactory('BoneLoader').execute(opts.spec);
			return Context.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves a Bone from the current context.
		*	@public
		*	@method getBone
		*	@param id {String} Nut Id
		*	@return Object
		**/
		getBone: function(id) {
			if(!id) return null;
			return this.bones.find(function(bone) { return (bone.id === id); });
		},

		/**
		*	Context Wiring
		*	@public
		*	@chainable
		*	@method wire
		*	@param spec {Object} context specification to be wired
		*	@return {com.spinal.ioc.Context}
		**/
		wire: function(spec) {

			return this;
		},

		/** Bone Life Cycle Events **/

		/**
		*	Context Specification Create
		*	@public
		*	@chainable
		*	@method create
		*	@return Object
		**/
		create: function() {
			this.trigger(Context.EVENTS.created, { bone: this });
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
			this.trigger(Context.EVENTS.ready, { bone: this });
			return this;
		},

		/**
		*	Destroy bone inside this context
		*	@public
		*	@chainable
		*	@method destroy
		*	@return Object
		**/
		destroy: function() {
			this.trigger(Context.EVENTS.destroyed, { bone: this });
			return this;
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
			created: 'com:spinal:ioc:context:bone:created',
			/**
			*	@event ready
			**/
			ready: 'com:spinal:ioc:context:bone:ready',
			/**
			*	@event destroyed
			**/
			destroyed: 'com:spinal:ioc:context:bone:destroyed'
		},

		/**
		*	Static IoC Initializer
		*	@static
		*	@method Create
		*	@return com.spinal.ioc.Context
		**/
		Create: function() {
			var $mainSpec = $('html').find('script[data-main-spec]'),
				spec = ($mainSpec.length === 1) ? { spec: $mainSpec.data('main-spec') } : '';
			return new Context(spec);
		}

	}));

	return Context;

});
