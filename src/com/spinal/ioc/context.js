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
	*
	*	Processor's Composition (Order of execution)
	*
	*	1) IoCProcessor -> Builds bones structure
	*	2) BoneProcessor -> Solves Bones references and module requires (String parsing logic).
	*	3) Create -> Instanciate Modules
	*	4) Ready -> Calls operations on modules already instanciated by the context.
	*	5) Destroy -> Create delayed behaviors when modules are destroyed (Behavioral control).
	*		Destroy might be not necessary; AOP can offer a better solution (subject to be deleted).
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
		*	Register Processors
		*	@public
		*	@method processors
		**/
		processors: function() {
			var commands
			_.each(arguments, function(Processor) {
				Processor.Register(this);
				this[Processor.NAME] = this.create(Processor.NAME, { context: this });
			}, this);
			this.execute = _.compose(this.BoneProcessor.execute, this.CreateProcessor.execute,
				this.ReadyProcessor.execute, this.DestroyProcessor);
			this.parse = _.wrap(this.execute, _.bind(this.parse, this));
		},

		/**
		*	Context Wiring
		*	@public
		*	@chainable
		*	@method wire
		*	@param spec {Object} context specification to be wired
		*	@param callback {Function} callback function to be called after autowiring.
		*	@return {com.spinal.ioc.Context}
		**/
		wire: function(spec, callback) {
			if(!spec) { callback(this); return this; }
			if(!_.isObject(spec)) throw new ContextException('InvalidSpecFormat');
			require(Context.PROCESSORS, _.bind(function() {
				this.processors.apply(this, arguments);
				callback(this.parse(spec));
			}, this));
			return this;
		},

		/**
		*	Context Parser
		*	@public
		*	@method parse
		*	@param spec {Object} context spec to be wired
		*	@return {com.spinal.ioc.Context}
		**/
		parse: function(execute, spec) {
			this.excecute(spec);
			this.trigger(Context.EVENTS.initialized, this);
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
			*	@event initialized
			**/
			initialized: 'com:spinal:ioc:context:initialized'
		},

		/**
		*	@static
		*	@property PROCESSORS
		*	@type Array
		**/
		PROCESSORS: [
			'ioc/processor/bone',
			'ioc/processor/create',
			'ioc/processor/ready',
			'ioc/processor/destroy'
		],

		/**
		*	Static IoC Initializer
		*	@static
		*	@method Initialize
		*	@param spec {Object} Default spec
		*	@param callback {Function} callback pass to the wire
		*	@return com.spinal.ioc.Context
		**/
		Initialize: function(spec, callback) {
			if(arguments.length === 1 && _.isFunction(spec)) return new Context().wire(null, spec);
			return new Context().wire(spec, callback);
		}

	}));

	return Context;

});
