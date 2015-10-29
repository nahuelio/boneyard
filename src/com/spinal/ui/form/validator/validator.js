/**
*	@module com.spinal.ui.form.validator
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
	'util/adt/collection'], function(Spinal, Collection) {

	/**
	*	Class Validator
	*	@namespace com.spinal.ui.form.validator
	*	@class com.spinal.ui.form.validator.Validator
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spianl.util.adt.Collection
	**/
	var Validator = Spinal.namespace('com.spinal.ui.form.validator.Validator', Spinal.SpinalClass.inherit({

		/**
		*	Rules collection
		*	@public
		*	@property rules
		*	@type com.spinal.util.adt.Collection
		**/
		rules: null,

		/**
		*	Model
		*	@public
		*	@property model
		*	@type Object
		**/
		model: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param [attrs] {Object} constructor attributes
		*	@return com.spinal.ui.View
		**/
		initialize: function(attrs) {
			attrs || (attrs = {});
			Validator.__super__.initialize.apply(this, arguments);
			if(attrs.rules) this.rules.set(attrs.rules, { silent: true });
			return this;
		},

		/**
		*	Sets validator model in which validation strategy will operate
		*	@public
		*	@method set
		*	@param model {Object} model reference
		*	@return com.spinal.ui.form.validator.Validator
		**/
		set: function(model) {
			model || (model = {});
			this.model = model;
			return this;
		},

		/**
		*	Add a new rule to this validator
		*	@public
		*	@chainable
		*	@method add
		*	@param rule {Object} rule to be added
		*	@return com.spinal.ui.form.validator.Validator
		**/
		add: function(rule) {
			this.rules.add(rule);
			return this;
		},

		/**
		*	Remove an existing rule from this validator
		*	@public
		*	@method remove
		*	@param rule {Object} rule to be removed
		*	@return com.spinal.ui.form.validator.Validator
		**/
		remove: function(rule) {
			this.rules.removeBy(function(r) { return (r.field === rule.field); });
			return this;
		},

		/**
		*	Default Validator Strategy that evaluates rules defined against the current model set on this validator.
		*	@public
		*	@method validate
		*	@return Boolean
		**/
		validate: function() {
			return this.trigger(Validator.EVENTS.validate, this);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Validator',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event validate
			**/
			validate: 'com:spinal:ui:form:validator:validate'
		},

		/**
		*	@static
		*	@property RULE
		*	@type Object
		**/
		RULE: {
			required: 'required',
			email: 'email',
			currency: 'currency',
			onlyLetters: 'onlyLetters',
			onlyNumbers: 'onlyNumbers',
			onlyAlphanumeric: 'onlyAlphanumeric'
		}

	}));

	return Validator;

});
