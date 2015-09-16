/**
*	@module com.spinal.ioc.engine
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/spec',
		'ioc/engine/annotation/plugins',
		'util/adt/collection',
		'util/factories/async-factory',
		'util/adt/iterator'], function(Spec, Plugins, Collection, AsyncFactory, Iterator) {

	/**
	*	Class Engine
	*	@namespace com.spinal.ioc.engine
	*	@class com.spinal.ioc.engine.Engine
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.annotation.Spec
	*	@requires com.spinal.ioc.engine.annotation.Plugins
	*	@requires com.spinal.util.adt.Collection
	*	@requires com.spinal.util.factories.AsyncFactory
	*	@requires com.spinal.util.adt.Iterator
	**/
	var Engine = Spinal.namespace('com.spinal.ioc.engine.Engine', Spinal.SpinalClass.inherit({

		/**
		*	Specs collection
		*	@public
		*	@property specs
		*	@type com.spinal.util.adt.Collection
		**/
		specs: new Collection([], { interface: Spec }),

		/**
		*	Plugins
		*	@public
		*	@property plugins
		*	@type com.spinal.ioc.engine.annotation.Plugins
		**/
		plugins: new Plugins(),

		/**
		*	Asynchronous Processor Factory
		*	@public
		*	@property factory
		*	@type com.spinal.util.AsyncFactory
		**/
		factory: new AsyncFactory(),

		/**
		*	Processors Iterator
		*	@public
		*	@property processors
		*	@type com.spinal.util.adt.Iterator
		**/
		processors: new Iterator(),

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.engine.Engine
		**/
		initialize: function() {
			this.wire = _.wrap(this.wire, this.setup);
			this.unwire = _.wrap(this.unwire, this.setup);
			return Engine.__super__.initialize.apply(this, arguments);;
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
		*	@return com.spinal.ioc.engine.Engine
		**/
		setup: function(method, spec, callback) {
			if(!this.processors.isEmpty()) method(spec, callback);
			this.factory.push(Engine.PROCESSORS).load(_.bind(this.ready, this, method, spec, callback));
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
		*	@return com.spinal.ioc.engine.Engine
		**/
		ready: function(method, spec, callback) {
			this.processors.set(Engine.PROCESSORS);
			this.trigger(Engine.EVENTS.ready, this);
			(spec) ? method(spec, callback) : callback(this);
			return this;
		},

		/**
		*	Default Processor's execute Handler
		*	@public
		*	@chainable
		*	@method execute
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.engine.Engine
		**/
		execute: function(callback) {
			if(!this.processors.hasNext()) {
				this.processors.rewind();
				callback(this);
				return this;
			}
			this.factory.create(iterator.next().path, this)
				.once(BoneProcessor.EVENTS.done, _.bind(this.execute, this, callback))
				.execute();
			return this;
		},

		/**
		*	Adds and wire a new spec supplied by a given context
		*	@public
		*	@chainable
		*	@method wire
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.engine.Engine
		**/
		wire: function(spec, callback) {
			var specs = this.addSpec(spec);
			return this.execute(callback).trigger(Engine.EVENTS.wire, specs);
		},

		/**
		*	Removes an existing spec associated with a context
		*	@public
		*	@chainable
		*	@disabled
		*	@method remove
		*	@param spec {Object} spec reference
		*	@param [callback] {Function} callback reference
		*	@return com.spinal.ioc.engine.Engine
		**/
		unwire: function(spec, callback) {
			return this.trigger(Engine.EVENTS.unwire, this.removeSpec(spec));
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
			var detected = this.plugins.extract(spec);
			if(detected.length > 0) this.trigger(Engine.EVENTS.plugins, detected);
			return spec;
		},

		/**
		*	Add a new spec and dependent specs if found and return them as array.
		*	This method uses recursion.
		*	@public
		*	@method addSpec
		*	@param spec
		*	@return Array
		**/
		addSpec: function(spec) {
			var sp = this.extractPlugins(this.specs.add(spec));
			return _.flatten(sp.hasDependencies() ? _.map(sp.getDependencies(), this.addSpec) : [sp]);
		},

		/**
		*	Removes an existing spec and dependent specs if found and return them as array
		*	This method uses recursion.
		*	@public
		*	@method removeSpec
		*	@param spec
		*	@return Array
		**/
		removeSpec: function(spec) {
			var sp = this.specs.remove(spec);
			return _.flatten(sp.hasDependencies() ? _.map(sp.getDependencies(), this.removeSpec) : [sp]);
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
			var all = _.pluck(this.allSpecs(), 'bones');
			return _.reduce(all, function(prev, curr) { return _.extend(prev.toJSON(), curr.toJSON()); } all[0]);
		},

		/**
		*	Retrieves a bone by a given id
		*	@public
		*	@method bone
		*	@param id {String} bone id
		*	@return Object
		**/
		bone: function(id) {
			return _.find(this.allSpecs(), function(spec) { return spec.getBone(id); }, this);
		},

		/**
		*	Filters out bone by type
		*	@public
		*	@method bonesByType
		*	@param type {String} bone type
		*	@return Array
		**/
		bonesByType: function(type) {
			return _.flatten(_.filter(this.allSpecs(), function(spec) { return spec.getBonesByType(type); }));
		},

		/**
		*	Filters out bone by class constructor
		*	@public
		*	@method bonesByClass
		*	@param clazz {Function} constructor function reference
		*	@return Array
		**/
		bonesByClass: function(clazz) {
			return _.flatten(_.filter(this.allSpecs(), function(spec) { return spec.getBonesByClass(clazz); }));
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
			*	@event ready
			**/
			ready: 'com:spinal:ioc:engine:ready'
		},

		/**
		*	@static
		*	@property PROCESSORS
		*	@type Array
		**/
		PROCESSORS: [
			{ path: 'ioc/processor/create' },
			{ path: 'ioc/processor/ready' },
			{ path: 'ioc/processor/plugin' }
		]

	}));

	return Engine;

});
