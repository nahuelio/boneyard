/**
*	@module com.spinal.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/factories/factory'], function(Spinal, Factory) {

	/**
	*	BoneFactory Class
	*	@namespace com.spinal.ioc
	*	@class com.spinal.ioc.BoneFactory
	*	@extends com.spinal.core.SpinalClass
	**/
	var BoneFactory = Spinal.namespace('com.spinal.ioc.BoneFactory', Factory.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.ioc.BoneFactory}
		**/
		initialize: function() {
			return BoneFactory.__super__.initialize.apply(this, arguments);
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
			return require([modules], _.bind(this._onModulesLoaded, this, callback));
		},

		/**
		*	Modules Loaded Handler
		*	@private
		*	@method _onModulesLoaded
		*	@param callback {Function} module loaded callback
		**/
		_onModulesLoaded: function(callback) {
			var modules = Array.prototype.slice.call(arguments, 1);
			_.each(modules, function(module) { BoneFactory.__super__.register.apply(module.NAME, module); }, this);
			if(callback && _.isFunction(callback)) callback(modules);
			this.trigger(BoneFactory.EVENTS.loaded, { modules: modules });
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'BoneFactory',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event loaded
			**/
			loaded: 'com:spinal:ioc:bonefactory:modules:loaded'
		}

	}));

	return BoneFactory;

});
