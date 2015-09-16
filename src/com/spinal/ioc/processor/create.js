/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/bone',
	'ioc/engine/annotation/annotation',
	'util/exception/processor'], function(BoneProcessor, Annotation, ProcessorException) {

	/**
	*	Create Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.processor.BoneProcessor
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	*	@requires com.spinal.util.exception.ProcessorException
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', BoneProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		initialize: function() {
			return CreateProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves dependency positions inside the processors factory for the current bone managed by this injector
		*	@public
		*	@method getPositions
		*	@param dependencies {Array} bone resource dependencies
		*	@return Array
		**/
		getPositions: function(dependencies) {
			return this.getFactory().findPositionsBy(function(res) { return _.contains(dependencies, res.id); });
		},

		/**
		*	Add the module into the async factory resource collection
		*	@public
		*	@method enqueue
		*	@param bone {Object} bone data structure
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		enqueue: function(bone) {
			var injector = Annotation.newInjector(bone, this.getEngine()), callback = _.bind(this.create, this, injector);
			this.getFactory().push({ path: bone.getModule(), id: bone.getId(), callback: callback });
			if(injector.dependencies.length > 0) this.getFactory().swap(this.sort(_.pluck(injector.dependencies, 'id')));
			return this;
		},

		/**
		*	Returns Sorting Comparator that resolves resource ordering based on dependency priorities
		*	determined by this injector
		*	@public
		*	@method sort
		*	@param dependencies {Array} bone resource dependencies
		*	@return Function
		**/
		sort: function(dependencies) {
			return _.bind(function(maxp, m, ix) {
				return (this.bone.id === m.id && ix <= maxp) ? maxp : ix;
			}, this, _.max(this.getPositions(dependencies));
		},

		/**
		*	Default bone load handler that creates an instance of the module by passing the parameters to
		*	the constructor function (including dependencies if they exists).
		*	@public
		*	@method create
		*	@throws {com.spinal.util.error.types.ProcessorException}
		*	@param injector {com.spinal.}
		*	@param path {String} bone's resource path to pass to factory to create an instance
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		create: function(injector, path) {
			if(!injector || !path) throw new ProcessorException('CreateModuleException');
			injector.assign(this.getFactory().create(path, injector.bone.getParams()));
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
			if(bone.isModule()) return this.enqueue(bone);
			Annotation.newInjector(bone, this.getEngine()).resolve();
			return this;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			CreateProcessor.__super__
				.execute.call(this, this.process, this.getSpecs().allBones())
				.getFactory().load(_.bind(this.done, this, CreateProcessor.NAME));
			return this;
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
