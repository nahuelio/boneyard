/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/context'], function(Spinal, Context) {

	/**
	*	BaseClass Bone Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.IoCProcessor
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
		*	Checks if the bone was succesufuly created
		*	@public
		*	@method isCreated
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isCreated: function(bone) {
			return (bone && bone._$created);
		},

		/**
		*	Checks if the bone completed the ready phase
		*	@public
		*	@method isReady
		*	@param bone {Object} current bone to be evaluated
		*	@return Boolean
		**/
		isReady: function(bone) {
			return (bone && bone._$ready);
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
				if(_.isObject(bone) || _.isArray(bone))
					this.constructor.__super__.execute.apply(this, [this.handleNotation, bone]);
				if(_.isString(bone) && this.constructor.__super__.matchNotation.call(this.constructor.__super__, bone))
					console.log('Bone Ref -> ', bone);
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
		execute: function(predicate, bone) {
			if(!predicate || !_.isFunction(predicate)) return [];
			var matched = [], context = (bone) ? bone : this.ctx.spec;
			for(var bId in context) {
				if(predicate.call(this, context[bId], bId)) {
					matched.push(context[bId]);
					break;
				}
			}
			return matched;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneProcessor',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event created
			**/
			plugin: 'com:spinal:ioc:context:bone:plugin',
			/**
			*	@event created
			**/
			created: 'com:spinal:ioc:context:bone:created',
			/**
			*	@event ready
			**/
			ready: 'com:spinal:ioc:context:bone:ready'
		}

	}));

	return BoneProcessor;

});
