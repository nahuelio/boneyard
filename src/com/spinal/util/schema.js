/**
*	@module com.spinal.util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Define a Generic Schema definition structure to validate and parse model data
	*	@namespace com.spinal.util
	*	@class com.spinal.util.Schema
	*	@extends Backbone.Model
	**/
	var Schema = Spinal.namespace('com.spinal.util.Schema', Backbone.Model.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.mvc.Model}
		**/
		initialize: function() {
			return Schema.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Schema Set checks schema data types before taking the properties
		*	@public
		*	@method parse
		*	@param key {Object} Key String or Object (hashmap) to be set as properties.
		*	@param value {Object} Value to be set for the key property specified in p
		*	@return Object
		**/
		parse: function(key, value) {
			var attrs = {};
			if(_.isString(key)) attrs[key] = value;
			if(_.isObject(key)) attrs = key;
			_.each(attrs, _.bind(function(v, k) {
				var m = ('_' + attrs[k]); attrs[v] = (attrs[k] && this[m]) ? this[m](v) : v;
			}, this));
			return attrs;
		},

		/**
		*	Boolean data type parser
		*	@private
		*	@method _boolean
		*	@param value {Object} value to be transform
		*	@return Boolean
		**/
		_boolean: function(value) {
			return (value === 'true') ? true : (value === 'false') ? false : value;
		},

		/**
		*	Integer data type parser
		*	@private
		*	@method _int
		*	@param value {Object} value to be transform
		*	@return Number
		**/
		_int: function(value) {
			return parseInt(value, 10);
		},

		/**
		*	Float data type parser
		*	@private
		*	@method _float
		*	@param value {Object} value to be transform
		*	@return Number
		**/
		_float: function(value) {
			return parseFloat(value);
		},

		/**
		*	String data type parser
		*	@private
		*	@method _string
		*	@param value {Object} value to be transform
		*	@return String
		**/
		_string: function(value) {
			return value.toString();
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Schema'

	}));

	return Schema;

});
