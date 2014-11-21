/**
*	@module com.spinal.ioc.processor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/context',
		'ioc/processor/bone',
		'ioc/engine'], function(Context, BoneProcessor, Engine) {

	/**
	*	Ready Processor
	*	@namespace com.spinal.ioc.processor
	*	@class com.spinal.ioc.processor.ReadyProcessor
	*	@extends com.spinal.ioc.processor.BoneProcessor
	*
	*	@requires com.spinal.ioc.Context
	*	@requires com.spinal.ioc.processor.BoneProcessor
	**/
	var ReadyProcessor = Spinal.namespace('com.spinal.ioc.processor.ReadyProcessor', BoneProcessor.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.processor.ReadyProcessor}
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
			if(!_.isArray(exprs)) return {};
			return _.map(exprs, function(expr) {
				return (this.validate(expr) && (bone = this.getDependency(expr))) ? bone : expr;
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
			return _.compact(_.map(exprs, function(expr) {
				if(this.validate(expr) && (info = this.getDependencyId(expr).split('.'))) {
					if(info.length > 1 && (bone = this._engine.getBone(info[0]))) {
						bone[info[1]].apply(bone, this._inject(_.flatten(params)));
						return expr;
					}
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
			if(actions.length === 0) return [];
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
			var actions = (!this._engine.ready()) ? this.process(this._engine.root.$ready) : [];
			this.trigger(ReadyProcessor.EVENTS.processed, { type: ReadyProcessor.NAME, actions: actions });
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
