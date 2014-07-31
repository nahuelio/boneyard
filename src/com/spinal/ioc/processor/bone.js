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
		*	Supported Notations
		*	@public
		*	@property notations
		*	@type Array
		**/
		notations: ['bone'],

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
			this.notationRE = this._regexp();
			return this;
		},

		/**
		*	Create RegExp used by this processor
		*	@private
		*	@method _regexp
		*	@return RegExp
		**/
		_regexp: function() {
			return new RegExp('\\' + Context.PREFIX + '(' + this.notations.join('|') + ')(\!{1})', 'i');
		},

		/**
		*	Validates if the current processor supports the notation passed as parameter
		*	@public
		*	@method matchNotation
		*	@param notation {String} notation to be evaluated
		*	@return Boolean
		**/
		matchNotation: function(notation) {
			if(!this.notationRE) this.notationRE = this._regexp();
			return this.notationRE.test(notation);
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
		*	Handler when a module depends on a bone of 'String' type in order to be instanciated.
		*	@public
		*	@method handleDependency
		*	@param id {Object} current bone id
		*	@param bone {Object} current bone to evaluate
		*	@param [parentBone] {Object} parent bone ref
		*	@return Object
		**/
		handleDependency: function(bone, id, parentBone) {
			if(!bone) throw new ProcessorException('BoneNotFound');
			if(!this.ctx.query.isModule(bone)) return (parentBone.parent[id] = bone);
		},

		/**
		*	Handles specifc notation with the current processor.
		*	@public
		*	@method handleNotation
		*	@param id {Object} current bone id
		*	@param bone {Object} current bone to evaluate
		*	@return Object
		**/
		handleNotation: function(bone, id) {
			var result = this.matchNotation(id);
			if(!result) {
				if(_.isObject(bone) || _.isArray(bone)) {
					this.constructor.__super__.execute.apply(this, [this.handleNotation, bone, id]);
				} else if(this.constructor.__super__.matchNotation.call(this.constructor.__super__, bone)) {
					this.handleDependency.apply(this, arguments);
				}
			}
			return result;
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
