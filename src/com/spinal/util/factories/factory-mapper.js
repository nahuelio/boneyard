/**
*	@module com.spinal.util.factories
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/factories/async-factory'], function(AsyncFactory) {

	/**
	*	Class FactoryMapper
	*	@namespace com.spinal.util.factories
	*	@class com.spinal.util.factories.FactoryMapper
	*	@extends com.spinal.util.factories.AsyncFactory
	**/
	var FactoryMapper = Spinal.namespace('com.spinal.util.factories.FactoryMapper', AsyncFactory.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param [opts] {Object} options
		*	@return {com.spinal.util.factories.FactoryMapper}
		**/
		initialize: function(opts) {
			return FactoryMapper.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Validate key value pair data structure
		*	@private
		*	@method _validate
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function}
		*	@return Boolean
		**/
		_validate: function(key, value, callback) {
			return (_.defined(key) && _.defined(value) && key !== '' && _.defined(callback) && _.isFunction(callback));
		},

		/**
		*	Feed the mapper with model data as an entry point to evaluate mapping rules
		*	@public
		*	@chainable
		*	@method source
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@param model {Object} data model reference
		*	@return com.spinal.util.factories.FactoryMapper
		**/
		source: function(callback, model) {
			for(var key in model) {
				var value = model[key];
				if(!this._validate(key, value, callback)) continue;
				if(this.byKey(key, value, callback)) continue;
				this.byType(key, value, callback);
			}
			return this;
		},

		/**
		*	Resolves strategy by key
		*	@public
		*	@method byKey
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return com.spinal.util.factories.FactoryMapper
		**/
		byKey: function(key, value, callback) {
			return (this[key] && _.isFunction(this[key])) ? this[key].apply(this, arguments) : null;
		},

		/**
		*	Resolves strategy by type
		*	@public
		*	@method byType
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return com.spinal.util.factories.FactoryMapper
		**/
		byType: function(key, value, callback) {
			var type = typeof(value);
			if(_.isObject(value)) type = 'object';
			if(_.isArray(value)) type = 'array';
			return this[type].apply(this, arguments);
		},

		/**
		*	Inserts a resource into the factory stack
		*	@public
		*	@override
		*	@chainable
		*	@method push
		*	@param resource {Object} resource
		*	@return {com.spinal.util.factories.AsyncFactory}
		**/
		push: function(resource, callback) {
			resource.callback = _.partial(callback, _.clone(resource.params));
			delete resource.params;
			return FactoryMapper.__super__.push.call(this, resource);
		},

		/**
		*	Default Components
		*	@public
		*	@chainable
		*	@method defaults
		*	@param [callback] {Function} optional callback for defaults
		*	@return com.spinal.ui.form.mapper.FactoryMapper
		**/
		defaults: function(callback) {
			return this;
		},

		/**
		*	Default String type handler
		*	@public
		*	@method string
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return Object
		**/
		string: function(key, value, callback) {
			return this;
		},

		/**
		*	Default Number type handler
		*	@public
		*	@method number
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return Object
		**/
		number: function(key, value, callback) {
			return this;
		},

		/**
		*	Default Boolean type handler
		*	@public
		*	@method boolean
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return Object
		**/
		boolean: function(key, value, callback) {
			return this;
		},

		/**
		*	Default Object type handler
		*	@public
		*	@method object
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return com.spinal.util.factories.FactoryMapper
		**/
		object: function(key, value, callback) {
			return this.source(callback, value);
		},

		/**
		*	Default Array type handler
		*	@public
		*	@method array
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return com.spinal.util.factories.FactoryMapper
		**/
		array: function(key, value, callback) {
			return this.source(callback, value);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'FactoryMapper'

	}));

	return FactoryMapper;

});
