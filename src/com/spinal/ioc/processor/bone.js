/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/context',
		'util/exception/processor'], function(Spinal, Context, ProcessorException) {

	/**
	*	BaseClass Bone Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.util.exception.ProcessorException
	**/
	var BoneProcessor = Spinal.namespace('com.spinal.ioc.processor.BoneProcessor', Spinal.SpinalClass.inherit({

		/**
		*	Context Reference
		*	@public
		*	@property ctx
		*	@type {com.spinal.ioc.Context}
		**/
		ctx: null,

		/**
		*	Supported Notation Regular Expression
		*	@public
		*	@property notationRE
		*	@type RegExp
		**/
		notationRE: new RegExp('\\' + Context.PREFIX + '(bone)(\!{1})', 'i'),

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param ctx {com.spinal.ioc.Context} Context Reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		initialize: function(ctx) {
			if(!ctx) throw new ContextException('UndefinedContext');
			this.ctx = ctx;
			return this;
		},

		/**
		*	Validates if the current processor supports the notation passed as parameter
		*	@public
		*	@method matchNotation
		*	@param notation {String} notation to be evaluated
		*	@param re {RegExp} RegExp used to evaluate notation
		*	@return Boolean
		**/
		matchNotation: function(notation, re) {
			if(!notation) return false;
			return re.test(notation);
		},

		/**
		*	Extract dependent bone id from the String notation and return it.
		*	@public
		*	@method getDependency
		*	@param notation {String} bone dependency notation
		*	@return String
		**/
		getDependency: function(notation) {
			if(!notation || !_.isString(notation)) return null;
			var pos = notation.search(/\!{1}/i);
			return (pos > 0) ? notation.substring((pos+1), notation.length) : null;

		},

		/**
		*	Process notation when a module depends on a bone of 'String' type in order to be instanciated.
		*	@public
		*	@method process
		*	@param bone {Object} current bone to evaluate
		*	@param id {String} current bone id
		*	@param [parentBone] {Object} parent bone ref
		*	@return Object
		**/
		process: function(bone, id, parentBone) {
			if(!bone) throw new ProcessorException('BoneNotFound');
			if(!this.ctx.query.isModule(bone)) return (parentBone.parent[id] = bone);
		},

		/**
		*	Validates the notation and handles it accordingly to the processor.
		*	@public
		*	@method handleNotation
		*	@param id {Object} current bone id
		*	@param bone {Object} current bone to evaluate
		*	@return Object
		**/
		handleNotation: function(bone, id) {
			return this.matchNotation(id, this.notationRE);
		},

		/**
		*	Filters out and call the predicate function over the notations supported by the processor.
		*	If bone parameter is passed, the predicate function will be evaluated inside the bone context.
		*	@public
		*	@method execute
		*	@param predicate {Function} predicate function that filters out bones that are suitable to be processed
		*	@param [bone] {Object} Bone context in which the execution will be narrowed down
		*	@return Array
		**/
		execute: function(predicate, bone, id) {
			if(!predicate || !_.isFunction(predicate)) return false;
			var result = false, context = (bone) ? bone : this.ctx.spec;
			if(!bone) this.matches = [];
			for(var bId in context) {
				result = predicate.call(this, context[bId], bId, { parent: context, id: id });
				if(result) { this.matches.push(id); break; }
			}
			return (!bone) ? this.matches : result;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneProcessor'

	}));

	return BoneProcessor;

});
