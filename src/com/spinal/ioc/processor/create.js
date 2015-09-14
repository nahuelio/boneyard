/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/bone',
	'ioc/helpers/injector',
	'util/exception/processor'], function(BoneProcessor, Injector, ProcessorException) {

	/**
	*	Create Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.processor.BoneProcessor
	*	@requires com.spinal.ioc.helpers.Injector
	*	@requires com.spinal.util.exception.ProcessorException
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', BoneProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		initialize: function() {
			return CreateProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Add the module into the async factory resource collection
		*	@public
		*	@method enqueue
		*	@param bone {Object} bone data structure
		*	@return Object
		**/
		enqueue: function(bone) {
			var injector = new Injector(this, bone), callback = _.bind(this.create, this, injector);
			this.getFactory().push({ path: bone.$module, id: bone.id, callback: callback }).swap(injector.sort());
			return bone;
		},

		/**
		*	Default bone load handler that creates an instance of the module by passing the parameters to
		*	the constructor function (including dependencies if they exists).
		*	@public
		*	@method create
		*	@throws {com.spinal.util.error.types.ProcessorException}
		*	@param injector {com.spinal.ioc.helpers.Injector} injector reference
		*	@param path {String} bone's resource path to pass to factory to create an instance
		*	@return Object
		**/
		create: function(injector, path) {
			if(!injector || !path) throw new ProcessorException('CreateModuleException');
			return this.getEngine().create(injector.inject());
		},

		/**
		*	Evaluates and process all bones inside the spec and return them one by one.
		*	@public
		*	@method process
		*	@param bone {Object} bone reference to be evaluated
		*	@param id {String} bone id to be evaluated
		*	@param [parent] {Object} optional parent bone (when nesting through arrays or objects)
		*	@return Boolean
		**/
		process: function(bone, id, parent) {
			if(this.getSpecs().isModule(bone)) {
				return this.enqueue(_.extend({ id: id }, bone));
			} else if((_.isObject(bone) || _.isArray(bone)) && !this.getSpecs().isNative(bone)) {
				return CreateProcessor.__super__.execute.call(this, this.process, bone, id);
			}
			return _.defined(parent) ? this.resolve(bone, id, parent) : bone;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function() {
			var bones = CreateProcessor.__super__.execute.call(this, this.process);
			this.getFactory().load(_.bind(this.done, this, CreateProcessor.NAME, bones));
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
