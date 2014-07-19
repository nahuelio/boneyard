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

		injectDependency: function(module, c) {
			console.log('InjectDependency()', module);
		},

		/**
		*	Check if there are dependencies (via constructor params) passed as parameter.
		*	@public
		*	@method hasDependencies
		*	@param params {Object} constructor params to evaluate
		*	@return Boolean
		**/
		hasDependencies: function(params) {
			return (_.filter(params, function(v, k) { return this.getDependency(v); }, this).length > 0);
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
			var depId = this.getDependency(bone), dep = (depId) ? this.ctx.query.findBoneById(depId) : null;
			if(dep && parentBone && _.isObject(dep)) {
				if(dep.$module && !this.ctx.query.isCreated(dep)) {
					var mBone = this.ctx.query.findBoneById(parentBone.id);
					return Context.BoneFactory.add({
						id: parentBone.id, class: mBone.$module.class,
						dependebcy: dep, success: this.injectDependecy
					});
				}
			}
			return CreateProcessor.__super__.handleDependency.apply(this, [dep, id, parentBone]);
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
				(bone.params && this.hasDependencies(bone.params)) ?
					CreateProcessor.__super__.execute.call(this, this.handleNotation, bone.params, parentBone.id) :
					Context.BoneFactory.add({ id: parentBone.id, class: bone.class });
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
			var result = CreateProcessor.__super__.execute.call(this, this.handleNotation, bone, id);
			Context.BoneFactory.load(_.bind(function() {
				this.ctx.trigger(Context.EVENTS.created, result);
			}, this));
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
