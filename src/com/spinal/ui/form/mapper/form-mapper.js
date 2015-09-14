/**
*	@module com.spinal.ui.form.mapper
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/factories/factory-mapper'], function(FactoryMapper) {

	/**
	*	Class FormMapper
	*	@namespace com.spinal.ui.form.mapper
	*	@class com.spinal.ui.form.mapper.FormMapper
	*	@extends com.spinal.ui.form.mapper.FactoryMapper
	**/
	var FormMapper = Spinal.namespace('com.spinal.ui.form.mapper.FormMapper', FactoryMapper.inherit({

		/**
		*	Default Components
		*	@public
		*	@override
		*	@chainable
		*	@method defaults
		*	@param [callback] {Function} optional callback for defaults
		*	@return com.spinal.ui.form.mapper.FactoryMapper
		**/
		defaults: function(callback) {
			this.push({ id: 'Fieldset', path: 'ui/form/controls/fieldset' }, callback);
			this.push({ id: 'Label', path: 'ui/basic/label' }, callback);
			return this;
		},

		/**
		*	String type handler
		*	@public
		*	@override
		*	@chainable
		*	@method string
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return com.spinal.ui.form.mapper.FactoryMapper
		**/
		string: function(key, value, callback) {
			return this.push({
				id: 'Input',
				path: 'ui/form/controls/input',
				params: { autoId: true, name: key, value: value }
			});
		},

		/**
		*	Number type handler
		*	@public
		*	@override
		*	@chainable
		*	@method number
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return com.spinal.ui.form.mapper.FactoryMapper
		**/
		number: function(key, value, callback) {
			return this.push({
				id: 'Input',
				path: 'ui/form/controls/input',
				params: { type: 'number', name: key, autoId: true, value: value }
			}, callback);
		},

		/**
		*	Boolean type handler
		*	@public
		*	@override
		*	@chainable
		*	@method boolean
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return com.spinal.ui.form.mapper.FactoryMapper
		**/
		boolean: function(key, value, callback) {
			return this.push({
				id: 'Checkbox',
				path: 'ui/form/controls/checkbox',
				params: { autoId: true, name: key, value: value }
			}, callback);
		},

		/**
		*	Default Object type handler
		*	@public
		*	@override
		*	@chainable
		*	@method object
		*	@param key {String} model's key reference
		*	@param value {Object} model's value reference
		*	@param callback {Function} function to be called on every dependency instance resolution
		*	@return com.spinal.util.factories.FactoryMapper
		**/
		object: function(key, value, callback) {
			return this.push({
				id: value.type,
				path: 'ui/form/controls/' + value.type.toLowerCase(),
				params: _.omit(value, 'type')
			}, callback);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'FormMapper'

	}));

	return FormMapper;

});
