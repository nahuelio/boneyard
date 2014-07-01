/**
*	@module com/spinal/ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/string',
		'ioc/bone-factory',
		'util/adt/collection'], function(Spinal, StringUtils, BoneFactory, Collection) {

	/**
	*	IOC Context Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.Context
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.ioc.BoneFactory
	*	@requires com.spinal.util.adt.Collection
	**/
	var Context = Spinal.namespace('com.spinal.ioc.Context', Spinal.SpinalClass.inherit({

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
		*	Bone Factory instance
		*	@public
		*	@property boneFactory
		*	@type com.spinal.ioc.BoneFactory
		**/
		boneFactory: null,

		/**
		*	Supported Notations
		*	@public
		*	@property notations
		*	@type Array
		**/
		notations: ['specs'],

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
		*	Validate notation for the current context or processor
		*	@private
		*	@method _valid
		*	@param notation {String} Notation name
		*	@return Boolean
		**/
		_valid: function(notation) {
			return !(!notation || !_.isString(notation) || notation === '' || !_.contains(this.notations, notation));
		},

		/**
		*	Builds bone structure hierarchy recursively
		*	@private
		*	@method _build
		*	@param ctx {com.spinal.ioc.Context} current context
		*	@param spec {Object} Spec to process
		*	@return {com.spinal.ioc.context}
		**/
		_build: function(ctx, spec) {
			var depSpecs = ctx.lookup('specs', spec);
			if(depSpecs && _.isArray(depSpecs)) {
				_.each(depSpecs, function(spec) {
					this._build(new Context())
				}, this);
			} else {
				this.bones.add(spec);
			}
			return this;
		},

		/**
		*	Processors loaded callback
		*	@private
		*	@method _onProcessorsLoaded
		*	@param processors {Array} Array of Processor Modules
		*	@param [callback] {Function} Optional Callback
		**/
		_onProcessorsLoaded: function(spec, callback, processors) {
			_.each(processors, function(p) { Context[p.NAME] = this.invoke('create', p.NAME, this).execute(spec); }, this);
			if(callback && _.isFunction(callback)) callback(this);
			this.trigger(Context.EVENTS.initialized, this);
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
		*	Perform a look up by notation in the current context (or in the spec passed as parameter, if exists).
		*	@public
		*	@method lookup
		*	@param notation {String} Notation name
		*	@param [spec] {Object} Optional Spec in which the lookup will be perform
		*	@return Object
		**/
		lookup: function(notation, spec) {
			if(!spec || !_.isObject(spec) || !this._valid(notation)) return null;
			return _.find(spec, function(value, name) {
				return (name === (Context.NOTATION_PREFIX + notation));
			}, this);
		},

		/**
		*	Bone Factory invoke method wrapper
		*	@public
		*	@method invoke
		*	@param methodName {String} Bone factory method
		*	@return Object
		**/
		invoke: function(methodName) {
			if(!methodName) return null;
			var args = Array.prototype.slice.apply(arguments, 1);
			return (Context.BoneFactory[methodName]) ? Context.BoneFactory[methodName](args) : null;
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
			Context.boneFactory.register(Context.PROCESSORS, _.bind(this._onProcessorsLoaded, this, spec, callback));
			this._build(this, spec);
			return this;
		},

		/**
		*	Notifies current context that a bone has been affected
		*	@public
		*	@method notify
		*	@param eventType {String} Bone Event Type
		*	@param data {Object} data passed from the original event
		**/
		notify: function(eventType, data) {
			this.trigger(Context.EVENTS.changed, { type: eventType, data: data });
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
			initialized: 'com:spinal:ioc:context:initialized',
			/**
			*	@event changed
			**/
			changed: 'com:spinal:ioc:context:changed'
		},

		/**
		*	@static
		*	@property NOTATION_PREFIX
		*	@type String
		**/
		NOTATION_PREFIX: '$',

		/**
		*	Processors List used by the context
		*	@static
		*	@property PROCESSORS
		*	@type Array
		**/
		PROCESSORS: [
			'ioc/processor/create',
			'ioc/processor/ready',
			'ioc/processor/destroy'
		],

		/**
		*	@static
		*	@property BoneFactory
		*	@type {com.spinal.ioc.BoneFactory}
		**/
		BoneFactory: new BoneFactory(),

		/**
		*	Static IoC Initializer
		*	@static
		*	@method Initialize
		*	@param spec {Object} Default spec
		*	@param callback {Function} callback pass to the wire
		*	@return com.spinal.ioc.Context
		**/
		Initialize: function(spec, callback) {
			return (arguments.length === 1 && _.isFunction(spec)) ?
				new Context().wire(null, spec) :
				new Context().wire(spec, callback);
		}

	}));

	return Context;

});
