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
			_b: 'bone!',
			_r: 'bone-ref!',
			_d: '!'
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		initialize: function(engine) {
			if(!engine) throw new ContextException('EngineNotDeclared');
			this._engine = engine;
			return BoneProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Default Spec root filtering method useful to dicard bones from the main spec
		*	suitable for matching specific processor behaviors.
		*	@private
		*	@method _root
		*	@return Object
		**/
		_root: function() {
			return this._engine.root;
		},

		/**
		*	Check if expr matches the annotation passed as parameter
		*	If the annotation is omitted, the annotation declared in this processor will be used.
		*	@public
		*	@method validate
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		validate: function(expr) {
			if(!expr || !_.isString(expr)) return false;
			var ev = (Engine.PREFIX + expr);
			return ((ev.indexOf(this.annotations._b) !== -1) || (ev.indexOf(this.annotations._r) !== -1));
		},

		/**
		*	Check if the bone is an instance of a Backbone class
		*	@public
		*	@method isBackboneClass
		*	@param bone {Object} bone reference
		*	@return Boolean
		**/
		isBackboneClass: function(bone) {
			if(_.isUndefined(bone)) return false;
			return (bone instanceof Backbone.Model ||
				bone instanceof Backbone.Collection ||
				bone instanceof Backbone.View ||
				bone instanceof Backbone.Router);
		},

		/**
		*	Check if a complex dependency make reference to a function of the dependency
		*	@public
		*	@method isDependencyRef
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isDependencyRef: function(expr) {
			if(!expr) return false;
			return ((Engine.PREFIX + expr).indexOf(this.annotations._r) !== -1);
		},

		/**
		*	Checks if the expression is a module bone dependency
		*	@public
		*	@method isModuleDependency
		*	@param expr {String} expression to be evaluated
		*	@return Boolean
		**/
		isModuleDependency: function(expr) {
			if(_.isUndefined(expr) || _.isNull(expr) || !_.isString(expr)) return null;
			return (this._engine.isModule(this.getDependency(expr).bone));
		},

		/**
		*	Extracts and returns the dependent bone id from the expression passed by parameter
		*	@public
		*	@method getDependencyId
		*	@param expr {String} dependency expression to be evaluated
		*	@param [delimiter] {String} optional delimiter that identifies a bone reference
		*	@return String
		**/
		getDependencyId: function(expr, delimiter) {
			if(_.isUndefined(expr) || _.isNull(expr) || !_.isString(expr)) return null;
			var pos = expr.indexOf((delimiter && delimiter !== '') ? delimiter : this.annotations._d);
			return (pos > 0) ? expr.substring((pos+1), expr.length) : null;
		},

		/**
		*	Retrieves dependent bone from the spec by the expression passed as parameter
		*	@public
		*	@method getDependency
		*	@param expr {String} expression to be evaluated
		*	@param [delimiter] {String} optional delimiter that identifies a bone reference
		*	@return Object
		**/
		getDependency: function(expr, delimiter) {
			var dep = this.getComplexDependency(expr, delimiter);
			return (dep) ? { bone: this._engine.getBone(dep.id), method: dep.method } : null;
		},

		/**
		*	Retrieves a complex dependency (if exists) and return the structure suitable for processing
		*	Example of a complex dependency: '$bone!mybone.mybonemethod'
		*	Outputs: ['mybone', 'mybonemethod']
		*	@public
		*	@method getComplexDependency
		*	@param expr {String} expression to be evaluated
		*	@param [delimiter] {String} optional delimiter that identifies a bone reference
		*	@return Array
		**/
		getComplexDependency: function(expr, delimiter) {
			var depId = this.getDependencyId.apply(this, arguments), complex = null;
			if(!depId) return null;
			return ((complex = depId.split('.')).length > 1) ? { id: complex[0], method: complex[1] } : { id: depId };
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
			var bones = [], context = (bone) ? bone : this._root();
			for(var id in context) {
				var r = predicate.call(this, context[id], id, (bone) ? context : null);
				if(r) { bones.push(r) } else { break; }
			}
			return _.compact(_.flatten(bones));
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
