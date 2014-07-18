/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
	'util/error/types/processor-exception',
	'ioc/processor/bone'], function(Context, ProcessorException, BoneProcessor) {

	/**
	*	Create Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.CreateProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var CreateProcessor = Spinal.namespace('com.spinal.ioc.processor.CreateProcessor', BoneProcessor.inherit({

		/**
		*	Supported Notations
		*	@public
		*	@property notations
		*	@type Array
		**/
		notations: ['module'],

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
		*	Create RegExp used by this processor
		*	@private
		*	@method _regexp
		*	@return RegExp
		**/
		_regexp: function() {
			return new RegExp('\\' + Context.PREFIX + '(' + this.notations.join('|') + ')$', 'i');
		},

		/**
		*	Handler when a module depends on a bone of '$module' type in order to be instanciated.
		*	@public
		*	@method handleDependency
		*	@param id {Object} current bone id
		*	@param bone {Object} current bone to evaluate
		*	@param [parentBone] {Object} parent bone ref
		*	@return Object
		**/
		handleDependency: function(bone, id, parentBone) {
			var dependencyId = this.getDependency(bone),
				dependency = (dependencyId) ? this.ctx.query.findBoneById(dependencyId) : null;
			if(dependency && parentBone && _.isObject(dependency) && !this.ctx.query.isCreated(dependency)) {
				parentBone.parent[id] = dependencyId;
				console.log('[' + parentBone.parent.id + '] depends on -> [' + dependencyId + ']');
				return parentBone.parent;
			}
			return CreateProcessor.__super__.handleDependency.apply(this, [dependency, id, parentBone]);
		},

		/**
		*	Handles specific notation with the current processor.
		*	@public
		*	@method handleNotation
		*	@param bone {Object} current bone to evaluate
		*	@param id {Object} current bone id
		*	@param [parentBone] {Object} parent bone ref
		*	@return Boolean
		**/
		handleNotation: function(bone, id, parentBone) {
			var result = CreateProcessor.__super__.handleNotation.apply(this, arguments);
			if(result) {
				if(!bone.class) throw new ProcessorException('InvalidModuleDeclaration');
				if(bone.params) CreateProcessor.__super__.execute.call(this, this.handleNotation, bone.params, parentBone.id);
				// if bone.params doesn't have a dependent, enqueue the load operation for the module.
				// That means that handle Notation should return something to evaluate that case!
			}
			return result;
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@param [bone] {Object} Bone context in which the execution will be narrowed down
		*	@param [id] {Object} Bone Id of the context
		*	@return {com.spinal.ioc.processor.CreateProcessor}
		**/
		execute: function(bone, id) {
			this.ctx.notify(CreateProcessor.EVENTS.created,
				CreateProcessor.__super__.execute.call(this, this.handleNotation, bone, id));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'CreateProcessor'

	}));

	return CreateProcessor;

});
