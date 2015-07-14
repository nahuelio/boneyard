/**
*	@module com.spinal.ui.form
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container',
	'util/factories/async-factory',
	'util/string'], function(Container, AsyncFactory, StringUtil) {

	/**
	*	Form Class
	*	@namespace com.spinal.ui.form
	*	@class com.spinal.ui.form.Form
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	*	@requires com.spinal.util.factories.AsyncFactory
	*	@requires com.spinal.util.StringUtil
	**/
	var UIForm = Spinal.namespace('com.spinal.ui.form.Form', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-form',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'form',

		/**
		*	Default Form's action
		*	@private
		*	@property _action
		*	@type String
		**/
		_action: '#',

		/**
		*	Default Form's extra options
		*	@private
		*	@property _options
		*	@type Object
		**/
		_options: {
			/**
			*	Default Form's submit method
			*	@private
			*	@property _method
			*	@type String
			**/
			_method: 'GET',

			/**
			*	Default Form's encoding type
			*	@private
			*	@property _options._enctype
			*	@type String
			**/
			_enctype: 'application/x-www-form-urlencoded',

			/**
			*	Default Form's accept charset
			*	@private
			*	@property _options._acceptCharset
			*	@type String
			**/
			_acceptCharset: null,

			/**
			*	Default Form's autocomplete
			*	@private
			*	@property _options._autocomplete
			*	@type String
			**/
			_autocomplete: 'on',

			/**
			*	Default Form's No validate
			*	@private
			*	@property _options._novalidate
			*	@type String
			**/
			_novalidate: false,

			/**
			*	Default Form's Target
			*	@private
			*	@property _options._target
			*	@type String
			**/
			_target: '_self'
		},

		/**
		*	Default Form's name
		*	@private
		*	@property _name
		*	@type String
		**/
		_name: null,

		/**
		*	Form's Async Factory
		*	@private
		*	@property _factory
		*	@type {com.spinal.util.factories.AsyncFactory}
		**/
		_factory: null,

		/**
		*	Form's validator
		*	@private
		*	@property _validator
		*	@type {com.spinal.util.Validator}
		**/
		_validator: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return {com.spinal.ui.form.Form}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'action', 'name', 'factory', 'options', 'validator')));
			if(!this._factory) this._factory = new AsyncFactory();
			UIForm.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Default Form's create strategy
		*	@public
		*	@chainable
		*	@method create
		*	@return {com.spinal.ui.form.Form}
		**/
		create: function() {
			if(!_.defined(this.collection)) return this;
			// this.collection.each(function(model))
			return this;
		},

		/**
		*	Validates Form current state
		*	@public
		*	@method validate
		*	@return Boolean
		**/
		validate: function() {
			return (this._validator) ? this._validator.validate() : true;
		},

		/**
		*	Before Render Handler
		*	@public
		*	@chainable
		*	@method beforeRender
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		beforeRender: function() {
			UIForm.__super__.beforeRender.apply(this, arguments);
			return this.create();
		},

		/**
		*	Render Form
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.form.Form}
		**/
		render: function(opts) {
			UIForm.__super__.render.apply(this, arguments);
			this.name(this._name);
			this.action(this._action);
			this.validator(this._validator);
			return this;
		},

		/**
		*	After Render Handler
		*	This method will execute after the model has been projected into the template and added into the $el.
		*	@public
		*	@method afterRender
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		afterRender: function(opts) {
			if(_.defined(this.collection)) { this.listenTo(this.collection, 'reset', this.render); }
			return UIForm.__super__.afterRender.apply(this, arguments);
		},

		/**
		*	Update Form
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model}
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.form.Form}
		**/
		update: function(model, value, opts) {
			return UIForm.__super__.update.apply(this, arguments);
		},

		/**
		*	Change the form's name
		*	@public
		*	@chainable
		*	@method name
		*	@param name {String} form's name
		*	@return {com.spinal.ui.form.Form}
		**/
		name: function(name) {
			if(!_.defined(name)) return this._name;
			this.$el.attr('name', (this._name = name));
			return this;
		},

		/**
		*	Change the form's action
		*	@public
		*	@chainable
		*	@method action
		*	@param action {String} form's action
		*	@return {com.spinal.ui.form.Form}
		**/
		action: function(action) {
			if(!_.defined(action)) return this._action;
			this.$el.attr('action', (this._action = action));
			return this;
		},

		/**
		*	Change the form's validator
		*	@public
		*	@chainable
		*	@method validator
		*	@param validator {com.spinal.util.Validator} form's validator
		*	@return {com.spinal.ui.form.Form}
		**/
		validator: function(validator) {
			if(!_.defined(validator)) return this._validator;
			this._validator = validator;
			return this;
		},

		/**
		*	Default Form's submission strategy
		*	@public
		*	@overridable
		*	@method submit
		*	@return {com.spinal.ui.form.Form}
		**/
		submit: function() {
			// TODO: Thoughts??
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Form',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event validate
			**/
			validate: 'com:spinal:ui:form:validate'
		}

	}));

	return UIForm;

});
