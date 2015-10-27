/**
*	@module com.spinal.ui.form
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container',
	'ui/form/mapper/form-mapper',
	'util/exception/ui',
	'util/string'], function(Container, FormMapper, UIException, StringUtil) {

	/**
	*	Form Class
	*	@namespace com.spinal.ui.form
	*	@class com.spinal.ui.form.Form
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	*	@requires com.spinal.ui.form.mapper.FormMapper
	*	@requires com.spianl.util.exception.UIException
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
			if(opts.mapper && !(opts.mapper instanceof FormMapper)) throw new UIException('InvalidMapperType');
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'action', 'name', 'mapper', 'options', 'validator')));
			UIForm.__super__.initialize.apply(this, arguments);
			return (this._mapper || (this._mapper instanceof FormMapper)) ? this.mapper() : this;
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
		*	Default Form's factory mapper that pulls dependencies and instanciate controls on demand before render
		*	@public
		*	@chainable
		*	@method create
		*	@return com.spinal.ui.form.Form
		**/
		mapper: function() {
			this._mapper.defaults()
				.source(_.bind(this.create, this), this.resolve())
				.load(_.bind(this.update, this));
			return this;
		},

		/**
		*	Optionally wraps form's component inside a fieldset and optionally adds a label.
		*	@public
		*	@chainable
		*	@method wrap
		*	@param opts {Object} options
		*	@return com.spinal.ui.form.Form
		**/
		wrap: function(opts) {
			var container = (opts.fieldset) ? this.add(this._mapper.create('Fieldset', opts.fieldset)) : this;
			if(opts.label) container.add(this._mapper.create('Label', opts.label));
			return container;
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
		create: function(params, id, factory) {
			params.options || (params.options = {});
			return this.wrap(params.options).add(this._mapper.create(id, _.omit(params.options)));
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
		*	Render Form
		*	@public
		*	@override
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
			UIForm.__super__.update.apply(this, arguments);
			// FIXME: Must be a different way, quick fix for Reverse the stack order!!
			this.views.collection.reverse();
			this.invoke('render', opts);
			return this;
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
