/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/processor',
	'ioc/engine/helpers/tsort'], function(Processor, TSort) {

	/**
	*	CreateProcessor Class
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.Processor
	*
	*	@requires com.spinal.ioc.processor.Processor
	*	@requires com.spinal.ioc.engine.helpers.TSort
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', Processor.inherit({

		/**
		*	Topological Dependency Graph
		*	@public
		*	@property graph
		*	@type com.spinal.ioc.helpers.TSort
		**/
		graph: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		initialize: function() {
			this.graph = new TSort();
			return CreateProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Add the module into the async factory resource collection
		*	@public
		*	@method enqueue
		*	@param bone {com.spinal.ioc.engine.annotation.Bone} bone annotation reference
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		enqueue: function(bone) {
			this.getFactory().push({ path: bone.getPath(), id: bone.getId(), callback: _.bind(this.create, this, bone) });
			return this;
		},

		/**
		*	Default bone load handler that creates an instance of the module by passing the parameters to
		*	the constructor function (including dependencies if they exists).
		*	@public
		*	@method create
		*	@param bone {com.spinal.ioc.engine.annotation.Bone} bone annotation reference
		*	@param path {String} bone's resource path to pass to factory to create an instance
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		create: function(bone, path) {
			bone.getInjector().resolve();
			return this;
		},

		/**
		*	Builds, sort and returns topological dependency graph for all bones dependencies.
		*	@public
		*	@method sort
		*	@param bones {Array} list of bones reference
		*	@return Array
		**/
		tsort: function() {
			return this.graph.reset().add(this.dependencies).sort();
		},

		/**
		*	Build and returns all bone dependency graph found in the current context
		*	@public
		*	@method dependencies
		*	@return Array
		**/
		dependencies: function() {
			var bones = this.getEngine().allBones();
			return [];
		},

		/**
		*	Evaluates and resolve possible dependencies on all bones
		*	@public
		*	@method process
		*	@param bone {com.spinal.ioc.engine.annotation.Bone} bone annotation reference
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		process: function(bone) {
			bone.isModule() ? this.enqueue(bone) : bone.getInjector().resolve();
			return this;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		execute: function() {
			CreateProcessor.__super__.execute.call(this, this.getEngine().allBones(), this.process);
			this.getFactory().load(_.bind(this.done, this, CreateProcessor.NAME));
			return this;
		},

		/**
		*	Resolves all bone dependencies that were set as 'on hold' via injector.
		*	This method will assume that all bone modules were loaded and instanciated.
		*	@public
		*	@method resolve
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		resolve: function() {
			var bones = this.tsort();
			console.log('ORDER: ', _.invoke(bones, 'getId'));
			_.each(bones, function(bone) { bone.getInjector().resolve(this.getFactory()); }, this);
			return this;
		},

		/**
		*	Processor done handler
		*	@public
		*	@override
		*	@method done
		*	@param type {String} Processor type
		*	@return com.spinal.ioc.processor.BoneProcessor
		**/
		done: function(type) {
			console.log('------------------------------------------------------------------------------------------');
			this.resolve();
			return CreateProcessor.__super__.done.apply(this, arguments);
		}

	}, {

		/**
		*	Class Name
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'CreateProcessor'

	}));

	return CreateProcessor;

});
