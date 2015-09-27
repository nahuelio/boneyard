/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/processor',
	'util/exception/ioc/processor'], function(Processor, ProcessorException) {

	/**
	*	Create Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.Processor
	*
	*	@requires com.spinal.ioc.processor.Processor
	*	@requires com.spinal.util.exception.ProcessorException
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', Processor.inherit({

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
		*	Retrieves dependency positions of a bone passed by parameter from the factory
		*	@public
		*	@method getPositions
		*	@param bone {com.spinal.ioc.engine.annotation.Bone} bone annotation reference
		*	@return Array
		**/
		getPositions: function(bone) {
			var dependencies = bone.getDependencies().map(function(dependency) { return dependency.getId(); });
			return this.getFactory().findPositionsBy(function(res) { return _.contains(dependencies, res.id); });
		},

		/**
		*	Add the module into the async factory resource collection
		*	@public
		*	@method enqueue
		*	@param bone {com.spinal.ioc.engine.annotation.Bone} bone annotation reference
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		enqueue: function(bone) {
			this.getFactory().push({ path: bone.getModule(), id: bone.getId(), callback: _.bind(this.create, this, bone) });
			if(bone.getDependencies().length > 0) this.getFactory().swap(this.sort(bone));
			return this;
		},

		/**
		*	Returns Sorting Comparator that resolves resources order inside the factory based on bone dependencies
		*	@public
		*	@method sort
		*	@param bone {com.spinal.ioc.engine.annotation.Bone} bone annotation reference
		*	@return Function
		**/
		sort: function(bone) {
			return _.bind(function(maxp, m, ix) {
				return (this.bone.id === m.id && ix <= maxp) ? maxp : ix;
			}, this, _.max(this.getPositions(bone)));
		},

		/**
		*	Default bone load handler that creates an instance of the module by passing the parameters to
		*	the constructor function (including dependencies if they exists).
		*	@public
		*	@method create
		*	@throws {com.spinal.util.error.types.ProcessorException}
		*	@param bone {com.spinal.ioc.engine.annotation.Bone} bone annotation reference
		*	@param path {String} bone's resource path to pass to factory to create an instance
		*	@return com.spinal.ioc.processor.CreateProcessor
		**/
		create: function(bone, path) {
			if(!bone || !path) throw new ProcessorException('CreateModuleException');
			bone.getInjector().assign(this.getFactory().create(path, bone.getParams()));
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
			bone.isModule() ? this.enqueue(bone) : bone.injector.resolve();
			return this;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			CreateProcessor.__super__.execute.call(this, this.process, this.getEngine().allBones())
			this.getFactory().load(_.bind(this.done, this, CreateProcessor.NAME));
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
			console.log('CREATE DONE LOADING: ', arguments);
			// Execute dependencies on hold, try to query
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
