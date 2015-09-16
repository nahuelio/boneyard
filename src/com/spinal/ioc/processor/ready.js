/**
*	FIXME: Start refactoring this code!!!
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/processor/bone'], function(BoneProcessor) {

	/**
	*	Ready Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.ReadyProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var ReadyProcessor = Spinal.namespace('com.spinal.ioc.processor.ReadyProcessor', BoneProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.spinal.ioc.processor.ReadyProcessor
		**/
		initialize: function() {
			return ReadyProcessor.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Process and resolves possible dependencies on the expression's param list via injection
		*	@private
		*	@method _inject
		*	@param exprs {Array} param expressions
		*	@return Object
		*/
		_inject: function(exprs) {
			if(!_.isArray(exprs) || !_.isObject(exprs)) return exprs;
			return _.map(exprs, function(expr, k) {
				if(_.isArray(expr)) return _.flatten(this._inject(expr));
				if(this.validate(expr) && (d = this.getDependency(expr))) {
					return ((d.method) ? (!this.isDependencyRef(expr) ? d.bone[d.method]() : d.bone[d.method]) : d.bone);
				}
				return expr;
			}, this);
		},

		/**
		*	Resolves and processes actions declared in module's ready section by parsing expression as methods
		*	and params to be passed to the result of those methods
		*	@private
		*	@method _resolve
		*	@param exprs {Array} action expressions
		*	@param params {Array} params
		*	@return Array
		**/
		_resolve: function(exprs, params) {
			return _.compact(_.map(exprs, function(expr, ix) {
				if(this.validate(expr) && (d = this.getDependency(expr))) {
					return (d.method) ? d.bone[d.method].apply(d.bone, this._inject(params[ix])) : null;
				}
			}, this));
		},

		/**
		*	Evaluates and process all actions inside the root spec and return them one by one.
		*	@public
		*	@method process
		*	@param actions {Array} array of actions declared in $ready annotation
		*	@return Boolean
		**/
		process: function(actions) {
			if(!actions || actions.length === 0) return [];
			return _.compact(_.map(actions, function(action) {
				if(!_.isObject(action) || action._$ready) return null;
				return (this._resolve(_.keys(action), _.values(action)) && (action._$ready = true));
			}, this));
		},

		/**
		*	Execute Processor
		*	@public
		*	@method execute
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
		**/
		execute: function() {
			// FIXME: Here Merge All Readies of all bones to pull them as actions
			var actions = (!this.getEngine().ready()) ? this.process(this._engine.root.$ready) : [];
			this.complete(ReadyProcessor.NAME, actions);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ReadyProcessor'

	}));

	return ReadyProcessor;

});
