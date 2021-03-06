/**
*	@module com.boneyard.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/view', 'util/string'], function(View, StringUtil) {

	/**
	*	Class Input
	*	@namespace com.boneyard.ui.form.controls
	*	@class com.boneyard.ui.form.controls.Input
	*	@extends com.boneyard.ui.View
	*
	*	@requires com.boneyard.ui.View
	*	@requires com.boneyard.util.StringUtil
	**/
	var UIInput = Boneyard.namespace('com.boneyard.ui.form.controls.Input', View.inherit({

		/**
		*	Events
		*	@public
		*	@property events
		*	@type Object
		**/
		events: {
			'keyup': '_onKeyup',
			'keydown': '_onKeydown',
			'focus': '_onFocus',
			'blur': '_onBlur'
		},

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-input form-control',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'input',

		/**
		*	Input's default value
		*	@private
		*	@property _value
		*	@type String
		**/
		_value: '',

		/**
		*	Input's default type
		*	@private
		*	@property _type
		*	@type String
		**/
		_type: 'text',

		/**
		*	Input's default name
		*	@private
		*	@property _name
		*	@type String
		**/
		_name: null,

		/**
		*	Input's placeholder
		*	@private
		*	@property _placeholder
		*	@type String
		**/
		_placeholder: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return com.boneyard.ui.form.controls.Input
		**/
		initialize: function(options) {
			options || (options = {});
			if(this._type) this.$el.attr('type', this._type);
			_.extend(this, StringUtil.toPrivate(_.pick(options, 'name', 'value', 'placeholder')));
			UIInput.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Input
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.form.controls.Input
		**/
		render: function(opts) {
			UIInput.__super__.render.apply(this, arguments);
			this.name(this._name);
			this.placeholder(this._placeholder);
			this.value(this._value);
			return this;
		},

		/**
		*	Update Input
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model} model reference
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.form.controls.Input
		**/
		update: function(model, value, opts) {
			if(_.isString(value)) this.value(value);
			return UIInput.__super__.update.apply(this, arguments);
		},

		/**
		*	Change the Input's name
		*	@public
		*	@chainable
		*	@method name
		*	@param n {String} Input's name
		*	@return com.boneyard.ui.form.controls.Input
		**/
		name: function(n) {
			if(!_.defined(n)) return this._name;
			this.$el.attr('name', (this._name = n));
			return this;
		},

		/**
		*	Change the Input's value
		*	@public
		*	@chainable
		*	@method value
		*	@param val {String} Input's value
		*	@return com.boneyard.ui.form.controls.Input
		**/
		value: function(val) {
			if(!_.defined(val)) return this._value;
			this.$el.val((this._value = val));
			return this;
		},

		/**
		*	Change the Input's placeholder
		*	@public
		*	@chainable
		*	@method placeholder
		*	@param ph {String} Input's placeholder
		*	@return String
		**/
		placeholder: function(ph) {
			if(!_.defined(ph)) return this._placeholder;
			this.$el.attr('placeholder', (this._placeholder = ph));
			return this;
		},

		/**
		*	Input's Key up handler
		*	@private
		*	@method _onKeyup
		*	@param e {Object} event reference
		**/
		_onKeyup: function(e) {
			this._value = e.currentTarget.value;
			this.trigger(UIInput.EVENTS.keyup, e, this);
		},

		/**
		*	Input's Key down handler
		*	@private
		*	@method _onKeydown
		*	@param e {Object} event reference
		**/
		_onKeydown: function(e) {
			this.trigger(UIInput.EVENTS.keydown, e, this);
		},

		/**
		*	Input's Focus handler
		*	@private
		*	@method _onFocus
		*	@param e {Object} event reference
		**/
		_onFocus: function(e) {
			this.trigger(UIInput.EVENTS.focus, e, this);
		},

		/**
		*	Input's Foucs out handler
		*	@private
		*	@method _onBlur
		*	@param e {Object} event reference
		**/
		_onBlur: function(e) {
			this.trigger(UIInput.EVENTS.blur, e, this);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Input',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event keyup
			**/
			keyup: 'com:boneyard:ui:view:keyup',
			/**
			*	@event keydown
			**/
			keydown: 'com:boneyard:ui:view:keydown',
			/**
			*	@event focus
			**/
			focus: 'com:boneyard:ui:view:focus',
			/**
			*	@event blur
			**/
			blur: 'com:boneyard:ui:view:blur'
		},

		/**
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			text: 'text',
			radio: 'radio',
			checkbox: 'checkbox',
			password: 'password',
			hidden: 'hidden',
			number: 'number', // Not Supported yet
			email: 'email', // Not Supported yet
			date: 'date' // Not Supported yet
		}

	}));

	return UIInput;

});
