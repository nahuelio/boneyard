/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/processor'], function(Processor) {

	/**
	*	CreateProcessor Class
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.Processor
	*
	*	@requires com.spinal.ioc.processor.Processor
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', Processor.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		initialize: function() {
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
			bone.getInjector().assign(this.getFactory().create(path, bone.getParams())).resolve();
			return this;
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
		*	@method resolveOnHold
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		resolveOnHold: function() {
			this.getEngine().allBones().forEach(function(bone) { bone.getInjector().resolve(); });
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
			this.resolveOnHold();
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
