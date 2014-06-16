/**
*	@module com/spinal/ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/string',
		'util/factories/factory',
		'util/adt/collection'], function(Spinal, StringUtils, Factory, Collection) {

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
		*	Identifier
		*	@public
		*	@property id
		*	@type String
		**/
		id: StringUtils.uuid(),

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
			return Context.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves a Bone from the current context.
		*	@public
		*	@method getBone
		*	@param id {String} Bone Id
		*	@return Object
		**/
		getBone: function(id) {
			if(!id) return null;
			return this.bones.find(function(bone) { return (bone.id === id); });
		},

		/**
		*	Retrieves the bone's type by id in the current context.
		*	@public
		*	@method getBoneType
		*	@param id {String} Bone Id
		*	@return Object
		**/
		getBoneType: function(id) {
			var bone = this.getBone(id);
			return (bone) ? bone.toString() : null;
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
			if(!spec) return this;
			if(_.isObject(spec)) return this.parse(spec);
			//TODO: Create ContextException -> throw new ContextException('InvalidSpec');
			return null;
		},

		/**
		*	Context Parser
		*	@public
		*	@method parse
		*	@param spec {Object} context spec to be wired
		*	@return {com.spinal.ioc.Context}
		**/
		parse: function(spec) {
			this.bones.each(function() {
				console.log(arguments);
			}, this);
			this.trigger(Context.EVENTS.initialized, this);
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
			*	@event initialized
			**/
			initialized: 'com:spinal:ioc:context:initialized'
		},

		/**
		*	@static
		*	@property PROCESSORS
		*	@type Array
		**/
		PROCESSESORS: [
			'ioc/processor/bone',
			'ioc/processor/create',
			'ioc/processor/ready',
			'ioc/processor/destroy'
		],

		/**
		*	Static IoC Initializer
		*	@static
		*	@method Initialiaze
		*	@return com.spinal.ioc.Context
		**/
		Initialize: function() {
			return new Context().wire(arguments);
		}

	}));

	return Context;

});
