/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/factories/factory',
		'util/adt/stack'], function(Spinal, Factory, Stack) {

	/**
	*	BoneFactory Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.BoneFactory
	*	@extends com.spinal.core.SpinalClass
	**/
	var BoneFactory = Spinal.namespace('com.spinal.ioc.BoneFactory', Factory.inherit({

		/**
		*	Module Stack
		*	@public
		*	@property stack
		*	@type {com.spinal.util.adt.Stack}
		**/
		stack: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.ioc.BoneFactory}
		**/
		initialize: function() {
			this.stack = new Stack();
			return BoneFactory.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Adds a new module into the queue
		*	@public
		*	@chainable
		*	@method add
		*	@param id {String} module name
		*	@param module {String} require module id
		*	@return {com.spinal.ioc.BoneFactory}
		**/
		add: function(id, module) {
			this.stack.push({ id: id, module: module})
			return this;
		},

		/**
		*	Loads and Registers a list of modules into the factory.
		*	@public
		*	@method Register
		*	@param modules {Array} array of module ids to load before register them.
		*	@param [callback] {Function} Optional Callback
		*	@return Function
		**/
		register: function(modules, callback) {
			if(!modules || !_.isArray(modules)) return null;
			return require(modules, _.bind(function() {
				var constructors = Array.prototype.slice.call(arguments);
				_.each(constructors, function(c) { BoneFactory.__super__.register.apply(this, [c.NAME, c]); }, this);
				callback(constructors);
			}, this));
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneFactory'

	}));

	return BoneFactory;

});
