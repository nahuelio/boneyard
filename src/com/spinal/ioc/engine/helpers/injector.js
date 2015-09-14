/**
*	@module com.spinal.ioc.engine.helpers
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/bone'], function(BoneProcessor) {

	/**
	*	Class Injector
	*	@namespace com.spinal.ioc.engine.helpers
	*	@class com.spinal.ioc.engine.helpers.Injector
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var Injector = Spinal.namespace('com.spinal.ioc.engine.helpers.Injector', Spinal.SpinalClass.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param processor {com.spinal.ioc.processor.BoneProcessor} processor reference
		*	@param bone {Object} bone reference
		*	@return com.spinal.ioc.helpers.Injector
		**/
		initialize: function(processor, bone) {
			this._validate.apply(this, arguments);
			this.processor = processor;
			this.bone = bone;
			this.dependencies = this.retrieve();
			return Injector.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Perform constructor parameters validation
		*	@private
		*	@throws Error
		*	@method _validate
		*	@param processor {com.spinal.ioc.processor.BoneProcessor} processor reference
		*	@param bone {Object} bone reference
		*	@return Boolean
		**/
		_validate: function(processor, bone) {
			if(!processor || !(processor instanceof BoneProcessor))
				throw new Error('Injector requires a processor in order to perform injections');
			if(!bone || !_.isObject(bone))
				throw new Error('Injector requires bone metadata information in order to perform injections');
			return true;
		},

		/**
		*	Validates dependency data integrity
		*	The following rules are evaluated
		*	- Dependency metadata must not be null or undefined
		*	- Dependency must contain the following properties:
		*		1) source - current bone in which the dependent bone has to be injected
		*		2) id - id of the dependent bone used to query the context to retrieved
		*		3) property - source property in which bone (id) must be injected injector
		*	- Dependent bone id must be not null or undefined
		*	- Current bone property must be declared
		*	@public
		*	@method valid
		*	@param dependency {Object} dependency to be evaluated
		*	@return Boolean
		**/
		valid: function(dependency) {
			return (_.defined(dependency) &&
				_.intersection(_.keys(dependency), ['source', 'id', 'property']).length === 3 &&
				_.defined(dependency.id) &&
				_.defined(dependency.source[dependency.property]));
		},

		/**
		*	Retrieves dependency metadata information
		*	@public
		*	@method metadata
		*	@param value {Object} dependency expresion or value
		*	@param key {String} value key
		*	@param source {Object} source bone reference
		*	@return Object
		**/
		metadata: function(value, key, source) {
			var result = this.processor.resolve(value, key, source), dependencyId = this.processor.getDependencyId(value);
			if(!result && !dependencyId)
				throw new Error('Injector could not resolve or retrieve dependency metadata on expression ' + value);
			return (!result && dependencyId) ? { source: source, id: dependencyId, property: key } : null;
		},

		/**
		*	Parses bone's dependencies declarations from this injector inpecting bone $params and retrieves
		*	a mapper array to be used when injection phase executes. This method uses recursion.
		*	@public
		*	@method retrieve
		*	@param [params] {String} params found on nested structure
		*	@return Array
		**/
		retrieve: function(parent) {
			var params = (parent) ? parent.params : this.getParams();
			return _.compact(_.flatten(_.map(params, function(value, key, source) {
				if(_.isArray(value) || _.isObject(value)) return this.retrieve({ params: value });
				var dependency = this.metadata.call(this, value, key, source);
				return this.valid(dependency) ? dependency : null;
			}, this)));
		},

		/**
		*	Retrieves dependency mapper and resolves dependency injection on the current bone
		*	@public
		*	@method inject
		*	@return com.spinal.ioc.helpers.Injector
		**/
		inject: function() {
			_.each(this.dependencies, function(d) { d.source[d.property] = this.processor._engine.getBone(d.id) }, this);
			return this;
		},

		/**
		*	Retrieves dependency positions inside the processors factory for the current bone managed by this injector
		*	@public
		*	@method positions
		*	@return Array
		**/
		positions: function() {
			return _.map(_.pluck(this.dependencies, 'id'), function(id) {
				return this.getFactory().findPosBy(function(resource) { return (resource.id === id); });
			}, this);
		},

		/**
		*	Returns Sorting Comparator that resolves resource ordering based on dependency priorities
		*	determined by this injector
		*	@public
		*	@method sort
		*	@return Function
		**/
		sort: function() {
			if(this.dependencies.length === 0) return function() {};
			var dpos = this.positions();
			return _.bind(function(maxp, m, ix) {
				return (this.bone.id === m.id && ix <= maxp) ? maxp : ix;
			}, this, _.max(dpos));
		},

		/**
		*	Retrieves Processor's factory
		*	@public
		*	@method getFactory
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		getFactory: function() {
			return this.processor.factory();
		},

		/**
		*	Retrieves Bone's params
		*	@public
		*	@method getParams
		*	@return Object
		**/
		getParams: function() {
			return this.bone.$params;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Injector'

	}));

	return Injector;

});
