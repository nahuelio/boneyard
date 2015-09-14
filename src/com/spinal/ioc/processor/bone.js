/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine',
		'ioc/engine/annotation/annotation',
		'util/exception/ioc/processor'], function(Engine, Annotation, ProcessorException) {

	/**
	*	BaseClass Bone Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.BoneProcessor
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.engine.Engine
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	*	@requires com.spinal.util.exception.ProcessorException
	**/
	var BoneProcessor = Spinal.namespace('com.spinal.ioc.processor.BoneProcessor', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.processor.BoneProcessor}
		**/
		initialize: function(engine) {
			this.engine = engine;
			this.proxify(this.getEngine().query, 'isNative');
			this.proxify(Annotation, 'validate');
			return BoneProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves unique instance of engine associated with this processor
		*	@public
		*	@method getEngine
		*	@return com.spinal.ioc.engine.Engine
		**/
		getEngine: function() {
			return this.engine;
		},

		/**
		*	Retrieves Engine's async factory
		*	@public
		*	@method getFactory
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		getFactory: function() {
			return this.getEngine().getFactory();
		},

		/**
		*	Retrieves Engine's spec collection
		*	@public
		*	@method getSpecs
		*	@return com.spinal.ioc.engine.helpers.SpecCollection
		**/
		getSpecs: function() {
			return this.getEngine().specs;
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
			return _.isString(expr) ? this._engine.isModule(this.getDependency(expr).bone) : false;
		},

		/**
		*	Standard Injection resolution
		*	@public
		*	@method resolve
		*	@param expr {String} expression used for resolve direct references
		*	@param key {String} property key of parent one used to extract dependency.
		*	@param parent {Object} parent bone reference
		*	@return Object
		**/
		resolve: function(expr, key, parent) {
			if(!_.defined(expr) || !parent) return null;
			if(!this.validate(expr)) return expr; // Not a bone expression, the expression value is simply a constant.
			if(!this.isModuleDependency(expr)) return (parent[key] = this.getDependency(expr).bone);
			return false;
		},

		/**
		*	Extracts and returns the dependent bone id from the expression passed by parameter
		*	@public
		*	@method getDependencyId
		*	@param expr {String} dependency expression to be evaluated
		*	@return String
		**/
		getDependencyId: function(expr) {
			if(!_.defined(expr) || !_.isString(expr)) return null;
			var pos = expr.indexOf(this.annotations._d);
			return (pos > 0) ? expr.substring((pos+1), expr.length) : null;
		},

		/**
		*	Retrieves dependent bone from the spec by the expression passed as parameter
		*	@public
		*	@method getDependency
		*	@param expr {String} expression to be evaluated
		*	@return Object
		**/
		getDependency: function(expr) {
			var dep = this.getComplexDependency(expr);
			return (dep) ? { bone: this._engine.getBone(dep.id), method: dep.method } : null;
		},

		/**
		*	Retrieves a complex dependency (if exists) and return the structure suitable for processing
		*	Example of a complex dependency: '$bone!mybone.mybonemethod'
		*	Outputs: ['mybone', 'mybonemethod']
		*	@public
		*	@method getComplexDependency
		*	@param expr {String} expression to be evaluated
		*	@return Array
		**/
		getComplexDependency: function(expr) {
			var depId = this.getDependencyId(expr), complex = null;
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
			var bones = [], context = (bone) ? bone : this.root();
			for(var id in context) {
				var r = predicate.call(this, context[id], id, (bone) ? context : null);
				if(r) { bones.push(r) } else { break; }
			}
			return _.compact(_.flatten(bones));
		},

		/**
		*	Default processor done handler
		*	@public
		*	@method done
		*	@param bones {Array} collection of bones processed by the current processor
		*	@return com.spinal.ioc.processor.BoneProcessor
		**/
		done: function(type, bones) {
			this.trigger(BoneProcessor.EVENTS.done, { type: type, bones: bones });
			return this;
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
			*	@event done
			**/
			done: 'com:spinal:ioc:processor:done'
		}

	}));

	return BoneProcessor;

});
