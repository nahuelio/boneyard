/**
*	@module com.spinal.ui.form.validator
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/adt/collection'], function(Collection) {

	/**
	*	Class Validator
	*	@namespace com.spinal.ui.form.validator
	*	@class com.spinal.ui.form.validator.Validator
	*	@extends com.spinal.core.SpinalClass
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spianl.util.adt.Collection
	**/
	var Validator = Spinal.namespace('com.spinal.ui.form.validator.Validator', Collection.inherit({

		/**
		*	Model
		*	@public
		*	@property model
		*	@type Object
		**/
		model: null,

		/**
		*	List of failures
		*	@public
		*	@property failures
		*	@type Array
		**/
		failures: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param [initial] {Array} constructor attributes
		*	@param [opts] {Object} addtional options
		*	@return com.spinal.ui.form.validator.Validator
		**/
		initialize: function(initial, opts) {
			opts || (opts = {});
			opts.interface = null;
			return Validator.__super__.initialize.apply(this, [initial, opts]);
		},

		/**
		*	Validate that the element is an Object.
		*	@private
		*	@override
		*	@method _valid
		*	@param rule {Object} rule to be evaluated.
		*	@return Boolean
		**/
		_valid: function(rule) {
			return (Validator.__super__._valid.apply(this, arguments) &&
				_.defined(rule.name) && _.defined(rule.type) &&
				_.defined(Validator.RULE[rule.type]));
		},

		/**
		*	Retrieves result information based on the latest evaluation
		*	@public
		*	@method getResult
		*	@return Object
		**/
		getResult: function() {
			return { success: (this.failures.length === 0), failures: this.failures };
		},

		/**
		*	Sets validator model in which validation strategy will operate into.
		*	@public
		*	@chainable
		*	@method setModel
		*	@param model {Array} model reference
		*	@return com.spinal.ui.form.validator.Validator
		**/
		setModel: function(model) {
			this.model = (_.defined(model) && _.isArray(model)) ? model : [];
			this.failures = [];
			return this.trigger(Validator.EVENTS.clear, this);
		},

		/**
		*	Retrieves a field from the model by a given rule name
		*	@public
		*	@method getRulesByFieldName
		*	@param name {Object} rule name
		*	@return Array
		**/
		getFieldByName: function(name) {
			return _.find(this.model, function(field) { return (field.name === name); });
		},

		/**
		*	Returns an object if the current model property being evaluated passes the validation against the matching
		*	rule (if exists), otherwise it returns false.
		*	returns false.
		*	@public
		*	@method isValid
		*	@param model {Array} model reference
		*	@param field {Object} current field reference to be evaluated
		*	@return Object
		**/
		isValid: function(rule) {
			var field = this.getFieldByName(rule.name);
			if(!_.defined(field)) return null;
			var res = this[rule.type] ? this[rule.type](field) : null;
			return _.defined(res) ? this[(res) ? 'onValid' : 'onInvalid'](rule) : null;
		},

		/**
		*	Default Valid Handler
		*	@public
		*	@method onValid
		*	@param rule {Object} rule reference
		**/
		onValid: function(rule) {
			this.trigger(Validator.EVENTS.valid, rule);
			return null;
		},

		/**
		*	Default Invalid Handler
		*	@public
		*	@method onInvalid
		*	@param rule {Object} rule reference
		*	@return Object
		**/
		onInvalid: function(rule) {
			this.trigger(Validator.EVENTS.invalid, rule);
			return rule;
		},

		/**
		*	Default Validator Strategy that evaluates rules defined against the current model set on this validator.
		*	@public
		*	@method validate
		*	@param [callback] {Object} optional callback
		*	@return Boolean
		**/
		validate: function(callback) {
			this.failures = _.compact(this.map(this.isValid, this));
			return this.done(callback);
		},

		/**
		*	Default validation finish strategy that fires up validate event on this validator
		*	@public
		*	@method done
		*	@param [callback] {Object} optional callback
		*	@return Boolean
		**/
		done: function(callback) {
			var result = this.getResult();
			this.trigger(Validator.EVENTS.validate, this);
			if(_.defined(callback) && _.isFunction(callback)) callback(result);
			return result.success;
		},

		/**
		*	Required Strategy
		*	@public
		*	@method required
		*	@param field {Object} model field reference
		*	@return Object
		**/
		required: function(field) {
			return _.defined(field.value) && field.value !== '';
		},

		/**
		*	Email Strategy
		*	@public
		*	@method email
		*	@param field {Object} model field reference
		*	@return Object
		**/
		email: function(field) {
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    		return re.test(field.value);
		},

		/**
		*	Currency Strategy
		*	@public
		*	@method currency
		*	@param field {Object} model field reference
		*	@return Object
		**/
		currency: function(field) {
			var re = /^(?!0\.00)[1-9]\d{0,2}(,\d{3})*(\.\d\d)?$/;
			return re.test(field.value);
		},

		/**
		*	Only Letters Strategy
		*	@public
		*	@method onlyLetters
		*	@param field {Object} model field reference
		*	@return Object
		**/
		onlyLetters: function(field) {
			var re = /^[a-zA-Z]+$/;
			return re.test(field.value);
		},

		/**
		*	Only Numbers Strategy
		*	@public
		*	@method onlyNumbers
		*	@param field {Object} model field reference
		*	@return Object
		**/
		onlyNumbers: function(field) {
			var re = /^[0-9]+$/;
			return re.test(field.value);
		},

		/**
		*	Only Alphanumberic Strategy
		*	@public
		*	@method onlyAlphanumeric
		*	@param field {Object} model field reference
		*	@return Object
		**/
		onlyAlphanumeric: function(field) {
			var re = /^[0-9a-zA-Z]+$/;
			return re.test(field.value);
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
			validate: 'com:spinal:ui:form:validator:validate',

			/**
			*	@event valid
			**/
			valid: 'com:spinal:ui:form:validator:rule:valid',

			/**
			*	@event invalid
			**/
			invalid: 'com:spinal:ui:form:validator:rule:invalid',

			/**
			*	@event clear
			**/
			clear: 'com:spinal:ui:form:validator:clear'
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
