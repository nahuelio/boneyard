/**
*	@module com.spinal.ioc.engine
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/helpers/spec',
		'ioc/engine/annotation/plugin',
		'util/adt/collection',
		'util/factories/async-factory',
		'util/adt/iterator',
		'util/object'], function(Spec, Plugin, Collection, AsyncFactory, Iterator, ObjectUtil) {

	/**
	*	Class Engine
	*	@namespace com.spinal.ioc.engine
	*	@class com.spinal.ioc.engine.Engine
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.annotation.Spec
	*	@requires com.spinal.ioc.engine.annotation.Plugin
	*	@requires com.spinal.util.adt.Collection
	*	@requires com.spinal.util.factories.AsyncFactory
	*	@requires com.spinal.util.adt.Iterator
	*	@requires com.spinal.util.ObjectUtil
	**/
	var Engine = Spinal.namespace('com.spinal.ioc.engine.Engine', Spinal.SpinalClass.inherit({

		/**
		*	Specs collection
		*	@public
		*	@property specs
		*	@type com.spinal.util.adt.Collection
		**/
		specs: new Collection(null, { interface: Spec }),

		/**
		*	Plugins
		*	@public
		*	@property plugins
		*	@type com.spinal.util.adt.Collection
		**/
		plugins: new Collection(null, { interface: Plugin }),

		/**
		*	Asynchronous Processor Factory
		*	@public
		*	@property factory
		*	@type com.spinal.util.AsyncFactory
		**/
		factory: null,

		/**
		*	Processors Iterator
		*	@public
		*	@property processors
		*	@type com.spinal.util.adt.Iterator
		**/
		processors: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.engine.Engine
		**/
		initialize: function() {
			this.factory = new AsyncFactory();
			this.processors = new Iterator();
			this.wire = _.wrap(this.wire, this.setup);
			this.unwire = _.wrap(this.unwire, this.setup);
			return Engine.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves engine's asynchronous factory
		*	@public
		*	@method getFactory
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		getFactory: function() {
			return this.factory;
		},

		/**
		*	Setup Engine's processors
		*	@public
		*	@chainable
		*	@method processor
		*	@param method {Function} wire or unwire method reference
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@param ctx {com.spinal.ioc.Context} context reference
		*	@return com.spinal.ioc.engine.Engine
		**/
		setup: function(method, spec, callback, ctx) {
			if(!this.processors.isEmpty()) {
				method.call(this, spec, callback, ctx);
				return this;
			}
			this.getFactory().set(Engine.PROCESSORS).load(_.bind(this.ready, this, method, spec, callback, ctx));
			return this;
		},

		/**
		*	Default Setup Engine Handler
		*	@public
		*	@chainable
		*	@method ready
		*	@param method {Function} wire or unwire method reference
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@param ctx {com.spinal.ioc.Context} context reference
		*	@return com.spinal.ioc.engine.Engine
		**/
		ready: function(method, spec, callback, ctx) {
			this.processors.set(Engine.PROCESSORS);
			this.trigger(Engine.EVENTS.ready, this);
			(spec) ? method.call(this, spec, callback, ctx) : this.done(callback, ctx);
			return this;
		},

		/**
		*	Default Processor's execute Handler
		*	@public
		*	@chainable
		*	@method execute
		*	@param [callback] {Function} callback reference
		*	@param ctx {com.spinal.ioc.Context} context reference
		*	@param type {String} method type
		*	@return com.spinal.ioc.engine.Engine
		**/
		execute: function(callback, ctx, type) {
			if(!this.processors.hasNext()) return this.done(callback, ctx, type);
			var processor = this.getFactory().create(this.processors.next().path, this);
			processor.once(processor.constructor.EVENTS.done, _.bind(this.execute, this, callback, ctx, type)).execute();
			return this;
		},

		/**
		*	Adds and wire a new spec supplied by a given context
		*	@public
		*	@chainable
		*	@method wire
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@param ctx {com.spinal.ioc.Context} context reference
		*	@return com.spinal.ioc.engine.Engine
		**/
		wire: function(spec, callback, ctx) {
			this.addSpec(spec);
			return this.execute(callback, ctx, Engine.EVENTS.wire);
		},

		/**
		*	Removes an existing spec associated with a context
		*	@public
		*	@chainable
		*	@disabled
		*	@method remove
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@param ctx {com.spinal.ioc.Context} context reference
		*	@return com.spinal.ioc.engine.Engine
		**/
		unwire: function(spec, callback, ctx) {
			return this.trigger(Engine.EVENTS.unwire, this.removeSpec(spec));
		},

		/**
		*	Default Finish Operation Handler
		*	@public
		*	@method
		*	@param callback {Function} callback reference
		*	@param ctx {com.spinal.ioc.Context} context reference
		*	@param type {String} method type
		*	@return com.spinal.ioc.engine.Engine
		**/
		done: function(callback, ctx, type) {
			this.processors.rewind();
			if(callback && _.isFunction(callback)) callback(ctx);
			return this.trigger(type, this.specs);
		},

		/**
		*	Extracts Plugins if they are found
		*	@public
		*	@chainable
		*	@method extractPlugins
		*	@param spec {com.spinal.ioc.engine.annotation.Spec} spec annotation
		*	@return Object
		**/
		extractPlugins: function(spec) {
			var detected = ObjectUtil.objToArr(Plugin.only(spec));
			if(detected.length > 0) this.plugins.set(detected);
			return spec;
		},

		/**
		*	Predicate strategy that check if a given spec exists in the collection.
		*	Will return true if predicate logical operation is positive, otherwise returns false.
		*	@public
		*	@method exists
		*	@param current {com.spinal.ioc.engine.helpers.Spec} current spec inside the collection
		*	@param spec {Object} spec reference to be evaluated
		*	@return Boolean
		**/
		exists: function(spec, current) {
			return (spec.$id === current._$id);
		},

		/**
		*	Add a new spec and dependent specs if found and return them as array.
		*	This method uses recursion.
		*	@public
		*	@method addSpec
		*	@param spec {Object} spec reference
		*	@return Array
		**/
		addSpec: function(spec, ctx) {
			if(this.specs.containsBy(this.exists, spec)) return [];
			var sp = this.specs.add(this.extractPlugins(spec), { silent: true }), ctx = (ctx) ? ctx : [];
			ctx.push(sp);
			if(sp.hasSpecs()) _.flatten(_.map(sp.getSpecs(), function(psp) { return this.addSpec(psp, ctx); }, this));
			return ctx;
		},

		/**
		*	Removes an existing spec and dependent specs if found and return them as array
		*	This method uses recursion.
		*	@public
		*	@method removeSpec
		*	@param spec
		*	@return Array
		**/
		removeSpec: function(spec, ctx) {
			if(!this.specs.containsBy(this.exists, spec)) return [];
			var sp = this.specs.removeBy(_.bind(this.exists, this, spec), { silent: true })[0], ctx = (ctx) ? ctx : [];
			ctx.push(sp);
			if(sp.hasSpecs()) _.flatten(_.map(sp.getSpecs(), function(psp) { return this.removeSpec(psp, ctx); }, this));
			return ctx;
		},

		/**
		*	Perform a spec look up by a given id
		*	@public
		*	@method spec
		*	@param id {String} spec id
		*	@return com.spinal.ioc.engine.annotation.Spec
		**/
		spec: function(id) {
			return this.specs.find(function(spec) { return spec.getId() === id; });
		},

		/**
		*	Retrieves all specs in JSON format
		*	@public
		*	@method allSpecs
		*	@return Array
		**/
		allSpecs: function() {
			return this.specs.collection;
		},

		/**
		*	Retrieves all bones of all specs
		*	@public
		*	@method allBones
		*	@return Array
		**/
		allBones: function() {
			return _.flatten(_.map(_.pluck(this.allSpecs(), 'bones'), function(bones) { return bones.collection; }));
		},

		/**
		*	Retrieves all actions of all specs
		*	@public
		*	@method allActions
		*	@return Array
		**/
		allActions: function() {
			return _.flatten(_.map(_.pluck(this.allSpecs(), 'actions'), function(actions) { return actions.collection; }));
		},

		/**
		*	Retrieves a bone by a given id
		*	@public
		*	@method bone
		*	@param id {String} bone id
		*	@return Object
		**/
		bone: function(id) {
			var bone = _.find(this.allBones(), function(bone) { return (bone.getId() === id); }, this);
			return (bone) ? bone : null;
		},

		/**
		*	Filters out bone by type
		*	@public
		*	@method bonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		bonesByType: function(type) {
			return _.flatten(_.map(this.allSpecs(), function(spec) { return spec.getBonesByType(type); }));
		},

		/**
		*	Filters out bone by class constructor
		*	@public
		*	@method bonesByClass
		*	@param clazz {Function} constructor function reference
		*	@return Array
		**/
		bonesByClass: function(clazz) {
			return _.flatten(_.map(this.allSpecs(), function(spec) { return spec.getBonesByClass(clazz); }));
		},


	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Engine',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event wire
			**/
			wire: 'com:spinal:ioc:engine:spec:wire',

			/**
			*	@event unwire
			**/
			unwire: 'com:spinal:ioc:engine:spec:unwire',

			/**
			*	@event plugin
			**/
			plugin: 'com:spinal:ioc:engine:plugin',

			/**
			*	@event action
			**/
			action: 'com:spinal:ioc:engine:action'
		},

		/**
		*	@static
		*	@property PROCESSORS
		*	@type Array
		**/
		PROCESSORS: [
			{ path: 'ioc/processor/create' },
			{ path: 'ioc/processor/action' },
			{ path: 'ioc/processor/plugin' }
		]

	}));

	return Engine;

});
