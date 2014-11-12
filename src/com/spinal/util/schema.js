/**
*	@module com.spinal.util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	// TODO: Review the implementation of this
	/**
	*	Define a generic model structure based on Backbone.Model
	*	@namespace com.spinal.mvc
	*	@class com.spinal.mvc.Model
	*	@extends Spinal.Backbone.Model
	**/
	var Model = Spinal.namespace('com.spinal.util.Model', Spinal.Backbone.Model.inherit({

		/**
		*	Model Schema
		*	@public
		*	@property schema
		*	@type Object
		**/
		schema: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.mvc.Model}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			this.schema = (opts.schema) ? opts.schema : {};
			Model.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Model Set checks schema data types before taking the properties
		*	@public
		*	@method set
		*	@param key {Object} Key String or Object (hashmap) to be set as properties.
		*	@param val {Object} Value to be set for the key property specified in p
		*	@return Object
		**/
		set: function(key, val, options) {
			var attrs;
			if(typeof key === 'object') {
				attrs = key; options = val;
			} else {
				(attrs = {})[key] = val;
			}
			_.each(attrs, _.bind(function(v, k) {
				try {
					switch (this.schema[k]) {
						case 'boolean':
							attrs[k] = v === 'true' ? true : v === 'false' ? false : v;
							break;
						case 'int':
							attrs[k] = parseInt(v, 10);
							break;
						case 'float':
							attrs[k] = parseFloat(v);
							break;
						case 'string':
							attrs[k] = v.toString();
							break;
						default:
							attrs[k] = v;
							break;
					}
				} catch (ex) {
					// Throw a custom exception ???
				}
			}, this));
			return Model.__super__.set.apply(this, [attrs, options]);
		},

		/**
		*	String representation of an instance of this class
		*	@public
		*	@method toString
		*	@return String
		**/
		toString: function() {
			return '[object Model]';
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Model'

	}));

	return Model;

});
