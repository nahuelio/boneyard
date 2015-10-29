/**
*	@module com.spinal.ui.form
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container',
	'ui/form/mapper/form-mapper',
	'ui/form/validator/validator',
	'util/exception/ui/ui',
	'util/string'], function(Container, FormMapper, Validator, UIException, StringUtil) {

	/**
	*	Form Class
	*	@namespace com.spinal.ui.form
	*	@class com.spinal.ui.form.Form
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	*	@requires com.spinal.ui.form.mapper.FormMapper
	*	@requires com.spinal.ui.form.validator.Validator
	*	@requires com.spianl.util.exception.ui.UIException
	*	@requires com.spinal.util.StringUtil
	**/
	var UIForm = Spinal.namespace('com.spinal.ui.form.Form', Container.inherit({

		/**
		*	Form Events
		*	@public
		*	@property events
		*	@type Object
		**/
		events: {
			'submit': 'submit'
		},

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
			*	@property _enctype
			*	@type String
			**/
			_enctype: 'application/x-www-form-urlencoded',

			/**
			*	Default Form's accept charset
			*	@private
			*	@property _acceptCharset
			*	@type String
			**/
			_acceptCharset: null,

			/**
			*	Default Form's autocomplete
			*	@private
			*	@property _autocomplete
			*	@type String
			**/
			_autocomplete: 'on',

			/**
			*	Default Form's No validate
			*	@private
			*	@property _novalidate
			*	@type String
			**/
			_novalidate: false,

			/**
			*	Default Form's Target
			*	@private
			*	@property _target
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
		*	Form validator
		*	@private
		*	@property _validator
		*	@type com.spinal.ui.form.validator.Validator
		**/
		_validator: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return com.spinal.ui.form.Form
		**/
		initialize: function(opts) {
			opts || (opts = {});
			UIForm.__super__.initialize.apply(this, arguments);
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'action', 'name', 'mapper', 'options', 'validator')));
			return this.validator().mapper();
		},

		/**
		*	Validates parameters passed to the contructor function of this class.
		*	@private
		*	@override
		*	@method _valid
		*	@param attrs {Object} attributes
		*	@return Boolean
		**/
		_valid: function(attrs) {
			if(attrs.mapper && !(attrs.mapper instanceof FormMapper)) throw new UIException('InvalidMapperType');
			if(attrs.validator && !(attrs.validator instanceof Validator)) throw new UIException('InvalidValidatorType');
			return UIForm.__super__._valid.apply(this, arguments);
		},

		/**
		*	Resolves and retrieves a json representation of the form model
		*	@public
		*	@method resolve
		*	@return Object
		**/
		resolve: function() {
			return this.model ? this.model.toJSON() : this.collection ? this.collection.toJSON() : null;
		},

		/**
		*	Default Form factory mapper setup that pulls dependencies and instanciate controls on demand.
		*	@public
		*	@chainable
		*	@method create
		*	@return com.spinal.ui.form.Form
		**/
		mapper: function() {
			if(!_.defined(this._mapper)) return this;
			this._mapper.source(this.resolve(), _.bind(this.create, this)).load(_.bind(this.update, this));
			return this;
		},

		/**
		*	Default Form validator setup that will trigger validation on form submit action.
		*	@public
		*	@chainable
		*	@method create
		*	@return com.spinal.ui.form.Form
		**/
		validator: function() {
			if(!_.defined(this._validator)) return this;
			this.listenTo(this._validator, Validator.EVENTS.validate, this.onValidate);
			return this;
		},

		/**
		*	Default create handler that adds controls to this form
		*	@public
		*	@method create
		*	@param params {Object} additional parameters
		*	@param id {String} factory id of the control
		*	@param controls {Array} collection of factory ids
		*	@return com.spinal.ui.form.Form
		**/
		create: function(params, path) {
			params || (params = {});
			return this.wrap(params.options).add(this._mapper.create(path, _.omit(params, 'options')));
		},

		/**
		*	Decorate component by wraping it in a fieldset and adding a label if these options are defined
		*	otherwise, the decorator will return the current form reference.
		*	@public
		*	@chainable
		*	@method wrap
		*	@param opts {Object} options
		*	@return com.spinal.ui.Container
		**/
		wrap: function(opts) {
			opts || (opts = {});
			var ref = (opts.fieldset) ? this.fieldset(this, opts.fieldset) : this;
			if(opts.label) this.label(ref, opts.label);
			return ref;
		},

		/**
		*	Add a fieldset to this form and returns the reference
		*	@public
		*	@method fieldset
		*	@param container {com.spinal.ui.Container} container reference in which the fieldset will be added
		*	@param params {Object} fieldset parameters
		*	@return com.spinal.ui.form.controls.Fieldset
		**/
		fieldset: function(container, params) {
			return container.add(this._mapper.create('ui/form/controls/fieldset', params));
		},

		/**
		*	Add a Label to this form and returns the reference
		*	@method label
		*	@param container {com.spinal.ui.Container} container reference in which the fieldset will be added
		*	@param params {Object} label parameters
		*	@return com.spinal.ui.basic.Label
		**/
		label: function(container, params) {
			return container.add(this._mapper.create('ui/basic/label', params));
		},

		/**
		*	Render View
		*	@public
		*	@override
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return com.spinal.ui.form.Form
		**/
		render: function(opts) {
			UIForm.__super__.render.apply(this, arguments);
			this.name(this._name);
			this.action(this._action);
			return this;
		},

		/**
		*	Update Form
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model} model reference
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		*	@return com.spinal.ui.form.Form
		**/
		update: function(model, value, opts) {
			UIForm.__super__.update.apply(this, arguments);
			this.invoke('render', opts);
			return this;
		},

		/**
		*	Change the form's name
		*	@public
		*	@chainable
		*	@method name
		*	@param name {String} form name
		*	@return com.spinal.ui.form.Form
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
		*	@param action {String} form action
		*	@return com.spinal.ui.form.Form
		**/
		action: function(action) {
			if(!_.defined(action)) return this._action;
			this.$el.attr('action', (this._action = action));
			return this;
		},

		/**
		*	Validates Form current state
		*	@public
		*	@method validate
		*	@return Boolean
		**/
		validate: function() {
			return _.defined(this._validator) ? this._validator.set(this.resolve()).validate() : true;
		},

		/**
		*	Default Form submit strategy
		*	@public
		*	@method submit
		*	@param e {Object} event reference
		*	@return com.spinal.ui.form.Form
		**/
		submit: function(e) {
			if(!this.validate()) e.preventDefault();
			return this;
		},

		/**
		*	Default Validate Handler
		*	@public
		*	@method onValidate
		*	@param validator {com.spinal.ui.form.validator.Validator} validator reference
		*	@return	com.spinal.ui.form.Form
		**/
		onValidate: function(validator) {
			return this.trigger(UIForm.EVENTS.validate, validator);
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
