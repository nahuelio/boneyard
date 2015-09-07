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
		*	@param collection {Array} collection of data reference
		*	@return com.spinal.util.factories.FactoryMapper
		**/
		source: function(callback, collection) {
			for(var key in collection) {
				var value = collection[key];
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
			if(_.isObject(value) || _.isArray(value)) type = 'compound';
			return this[type].apply(this, arguments);
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
			return this.push({
				id: 'Input',
				path: 'ui/form/controls/input',
				callback: _.partial(callback, { autoId: true, name: key, value: value })
			});
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
			return this.push({
				id: 'InputNumber',
				path: 'ui/form/controls/input',
				callback: _.partial(callback, { type: 'number', name: key, autoId: true, value: value })
			});
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
			return this.push({
				id: 'Checkbox',
				path: 'ui/form/controls/checkbox',
				callback: _.partial(callback, { autoId: true, name: key, value: value })
			});
		},

		/**
		*	Default Compound type handler (Array or Object)
		*	@public
		*	@method compound
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return com.spinal.util.factories.FactoryMapper
		**/
		compound: function(key, value, callback) {
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
