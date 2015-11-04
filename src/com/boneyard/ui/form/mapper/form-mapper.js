/**
*	@module com.boneyard.ui.form.mapper
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/factories/factory-mapper'], function(FactoryMapper) {

	/**
	*	Class FormMapper
	*	@namespace com.boneyard.ui.form.mapper
	*	@class com.boneyard.ui.form.mapper.FormMapper
	*	@extends com.boneyard.util.factories.FactoryMapper
	*
	*	@requires com.boneyard.util.factories.FactoryMapper
	**/
	var FormMapper = Boneyard.namespace('com.boneyard.ui.form.mapper.FormMapper', FactoryMapper.inherit({

		/**
		*	Default Components
		*	@public
		*	@override
		*	@chainable
		*	@method defaults
		*	@return com.boneyard.ui.form.mapper.FactoryMapper
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
		*	@param o {Object} single model property/value pair
		*	@return Object
		**/
		string: function(o) {
			return {
				path: 'ui/form/controls/input',
				params: { autoId: true, name: o.key, value: o.value }
			};
		},

		/**
		*	Number type handler
		*	@public
		*	@override
		*	@chainable
		*	@method number
		*	@param o {Object} single model property/value pair
		*	@return Object
		**/
		number: function(o) {
			return {
				path: 'ui/form/controls/input',
				params: { autoId: true, type: 'text', name: o.key, value: o.value }
			};
		},

		/**
		*	Boolean type handler
		*	@public
		*	@override
		*	@chainable
		*	@method boolean
		*	@param o {Object} single model property/value pair
		*	@return Object
		**/
		boolean: function(o) {
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
		*	@param o {Object} single model property/value pair
		*	@return Object
		**/
		object: function(o) {
			return {
				path: 'ui/form/controls/' + o.value.type.toLowerCase(),
				params: _.omit(o.value, 'type')
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
