/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ioc/engine',
		'util/exception/context',
		'util/exception/processor'], function(Spinal, Engine, ContextException, ProcessorException) {

	/**
	*	BaseClass Bone Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.util.exception.ContextException
	*	@requires com.spinal.util.exception.ProcessorException
	**/
	var BoneProcessor = Spinal.namespace('com.spinal.ioc.processor.BoneProcessor', Spinal.SpinalClass.inherit({

		/**
		*	Engine
		*	@private
		*	@property _engine
		*	@type {com.spinal.ioc.Engine}
		**/
		_engine: null,

		/**
		*	Supported annotations
		*	@public
		*	@property annotations,
		*	@type Object
		**/
		annotations: {
			_r: 'bone!'
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		*	@FIXME: Investigate why calling super, the structure gets messed up!!
		**/
		initialize: function(engine) {
			if(!engine) throw new ContextException('EngineNotDeclared');
			this._engine = engine;
			return this;
		},

		/**
		*	Check if expr matches the annotation passed as parameter
		*	If the annotation is omitted, the annotation declared in this processor will be used.
		*	@public
		*	@method validate
		*	@param expr {String} expression to be evaluated
		*	@param [annotation] {String} annotation used to be matched with the expression
		*	@return Boolean
		**/
		validate: function(expr, annotation) {
			if(!expr || !_.isString(expr)) return false;
			if(!annotation) annotation = this.annotations._r;
			return ((Engine.PREFIX + expr).indexOf(annotation) !== -1);
		},

		/**
		*	Checks if the expression is a module bone dependency
		*	@public
		*	@method isModuleDependency
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isModuleDependency: function(expr) {
			if(!expr || !_.isString(expr)) return false;
			return (this._engine.isModule(this.getDependency(expr)));
		},

		/**
		*	Extract dependent bone id from the expression and return it.
		*	@public
		*	@method getDependency
		*	@param expr {String} dependency expression
		*	@return String
		**/
		getDependency: function(expr) {
			if(!expr || !_.isString(expr)) return null;
			var pos = expr.indexOf('!');
			return (pos > 0) ? expr.substring((pos+1), expr.length) : null;
		},

		/**
		*	Filters out and call the predicate function over the notations supported by the processor.
		*	Predicate function must return the reference to the bone processed, otherwise the rest of the evaluations
		*	will be skipped.
		*	@public
		*	@method execute
		*	@param predicate {Function} predicate function that filters out bones that are suitable to be processed
		*	@param [bone] {Object} recursive context
		*	@return Array
		**/
		execute: function(predicate, bone) {
			if(!predicate || !_.isFunction(predicate)) return false;
			var bones = [], context = (bone) ? bone : this._engine.root;
			for(var id in context) {
				// console.log((bone) ? 'Sub Ite: ' : 'Ite: ', context[id]);
				var r = predicate.call(this, context[id], id, (bone) ? context : null);
				if(r) { bones.push(r) } else { break; }
			}
			return _.flatten(bones);
		}

	}, {

		/**
		*	Class Name
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneProcessor',

		/**
		*	BoneProcessor Events
		*	@static
		*	@property Object
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event processed
			**/
			processed: 'com:spinal:ioc:processor:processed'
		}

	}));

	return BoneProcessor;

});
