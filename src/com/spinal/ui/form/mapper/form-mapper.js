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
		*	@return com.spinal.ui.form.mapper.FactoryMapper
		**/
		defaults: function() {
			this.push({ path: 'ui/form/controls/fieldset' })
				.push({ path: 'ui/basic/label' });
			return this;
		},

		/**
		*	String type handler
		*	@public
		*	@override
		*	@chainable
		*	@method string
		*	@param key {String} model key reference
		*	@param value {Object} model value reference
		*	@return Object
		**/
		string: function(key, value) {
			return {
				path: 'ui/form/controls/input',
				params: { autoId: true, name: key, value: value }
			};
		},

		/**
		*	Number type handler
		*	@public
		*	@override
		*	@chainable
		*	@method number
		*	@param key {String} model key reference
		*	@param value {Object} model value reference
		*	@return com.spinal.ui.form.mapper.FactoryMapper
		**/
		number: function(key, value) {
			return {
				path: 'ui/form/controls/input',
				params: { type: 'number', name: key, autoId: true, value: value }
			};
		},

		/**
		*	Boolean type handler
		*	@public
		*	@override
		*	@chainable
		*	@method boolean
		*	@param key {String} model key reference
		*	@param value {Object} model value reference
		*	@return com.spinal.ui.form.mapper.FactoryMapper
		**/
		boolean: function(key, value) {
			return {
				path: 'ui/form/controls/checkbox',
				params: { autoId: true, name: key, value: value }
			};
		},

		/**
		*	Default Object type handler
		*	@public
		*	@override
		*	@chainable
		*	@method object
		*	@param key {String} model key reference
		*	@param value {Object} model value reference
		*	@return com.spinal.util.factories.FactoryMapper
		**/
		object: function(key, value, callback) {
			return {
				path: 'ui/form/controls/' + value.type.toLowerCase(),
				params: _.omit(value, 'type')
			};
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
