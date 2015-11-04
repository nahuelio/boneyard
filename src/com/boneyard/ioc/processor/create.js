/**
*	@module com.boneyard.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/processor',
	'ioc/engine/helpers/tsort'], function(Processor, TSort) {

	/**
	*	Class CreateProcessor
	*	@namespace com.boneyard.ioc.processor
	*	@class com.boneyard.ioc.processor.CreateProcessor
	*	@extends com.boneyard.ioc.processor.Processor
	*
	*	@requires com.boneyard.ioc.processor.Processor
	*	@requires com.boneyard.ioc.engine.helpers.TSort
	**/
	var CreateProcessor = Boneyard.namespace('com.boneyard.ioc.processor.CreateProcessor', Processor.inherit({

		/**
		*	Topological Dependency Graph
		*	@public
		*	@property graph
		*	@type com.boneyard.ioc.helpers.TSort
		**/
		graph: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.boneyard.ioc.processor.CreateProcessor
		**/
		initialize: function() {
			this.graph = new TSort();
			return CreateProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Add the module into the async factory resource collection
		*	@public
		*	@method enqueue
		*	@param bone {com.boneyard.ioc.engine.annotation.Bone} bone annotation reference
		*	@return com.boneyard.ioc.processor.CreateProcessor
		**/
		enqueue: function(bone) {
			this.getFactory().push({ path: bone.getPath(), callback: _.bind(this.onLoad, this, bone) });
			return this;
		},

		/**
		*	Default bone load handler that executes bone dependency resolve via injector.
		*	@public
		*	@method onLoad
		*	@param bone {com.boneyard.ioc.engine.annotation.Bone} bone annotation reference
		*	@return com.boneyard.ioc.processor.CreateProcessor
		**/
		onLoad: function(bone) {
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
			this.graph.reset();
			this.bones().forEach(_.bind(this.dependencies, this));
			return this.graph.sort();
		},

		/**
		*	Default bone's dependency handler that builds up the current bone and his dependencies with the following
		*	format:
		*		<h5>Example</h5>
		*		// Given a bone with id 'boneA' with dependencies 'boneB' and 'boneC'
		*		this.dependencies(bone);
		*		// Outputs: ['boneA', 'boneB', 'boneC']
		*	@public
		*	@method dependencies
		*	@param bone {com.boneyard.ioc.engine.annotation.Bone} bone reference
		*	@return Array
		**/
		dependencies: function(bone) {
			return this.graph.add([bone.getId()].concat(bone.getDependencies().invoke('getId')));
		},

		/**
		*	Evaluates and resolve possible dependencies on all bones
		*	@public
		*	@method process
		*	@param bone {com.boneyard.ioc.engine.annotation.Bone} bone annotation reference
		*	@return com.boneyard.ioc.processor.CreateProcessor
		**/
		process: function(bone) {
			bone.isModule() ? this.enqueue(bone) : bone.getInjector().resolve();
			return this;
		},

		/**
		*	Retrieves a list of bone annotations that have not been resolved
		*	@public
		*	@method bones
		*	@return Array
		**/
		bones: function() {
			return _.filter(this.getEngine().allBones(), function(bone) { return !bone.isCreated(); });
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return com.boneyard.ioc.processor.CreateProcessor
		**/
		execute: function() {
			CreateProcessor.__super__.execute.call(this, this.bones(), this.process);
			this.getFactory().load(_.bind(this.done, this, CreateProcessor.NAME));
			return this;
		},

		/**
		*	Resolves all bone dependencies that were set as 'on hold' via injector.
		*	This method will assume that all bone modules were loaded and instanciated.
		*	@public
		*	@method resolve
		*	@return com.boneyard.ioc.processor.CreateProcessor
		**/
		resolve: function() {
			this.tsort().forEach(_.bind(function(id) {
				var bone = this.getEngine().bone(id), injector = bone.getInjector();
				injector.resolve(this.getFactory());
				injector.create(bone.getPath(), bone.getParams());
			}, this));
			return this;
		},

		/**
		*	Processor done handler
		*	@public
		*	@override
		*	@method done
		*	@param type {String} Processor type
		*	@return com.boneyard.ioc.processor.BoneProcessor
		**/
		done: function(type) {
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
