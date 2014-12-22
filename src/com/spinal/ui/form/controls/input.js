/**
*	@module com.spinal.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/view', 'util/string'], function(View, StringUtil) {

	/**
	*	Input Class
	*	@namespace com.spinal.ui.form.controls
	*	@class com.spinal.ui.form.controls.Input
	*	@extends com.spinal.ui.View
	*
	*	@requires com.spinal.ui.View
	*	@requires com.spinal.util.StringUtil
	**/
	var UIInput = Spinal.namespace('com.spinal.ui.form.controls.Input', View.inherit({

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
		*	@return {com.spinal.ui.form.controls.Input}
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
		*	@return {com.spinal.ui.form.controls.Input}
		**/
		render: function(opts) {
			UIInput.__super__.render.apply(this, arguments);
			this.name(this._name);
			this.placeholder(this._placeholder);
			this.value(this._value);
			return this;
		},

		/**
		*	Change the Input's name
		*	@public
		*	@chainable
		*	@method name
		*	@param n {String} Input's name
		*	@return {com.spinal.ui.form.controls.Input}
		**/
		name: function(n) {
			if(!StringUtil.defined(n)) return this._name;
			this.$el.attr('name', (this._name = n));
			return this;
		},

		/**
		*	Change the Input's value
		*	@public
		*	@chainable
		*	@method value
		*	@param val {String} Input's value
		*	@return {com.spinal.ui.form.controls.Input}
		**/
		value: function(val) {
			if(!StringUtil.defined(val)) return this._value;
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
			if(!StringUtil.defined(ph)) return this._placeholder;
			this.$el.attr('placeholder', (this._placeholder = ph));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'UIInput',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event keyup
			**/
			keyup: 'com:spinal:ui:view:keyup',
			/**
			*	@event keydown
			**/
			keydown: 'com:spinal:ui:view:keydown',
			/**
			*	@event focus
			**/
			focus: 'com:spinal:ui:view:focus',
			/**
			*	@event blur
			**/
			blur: 'com:spinal:ui:view:blur'
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
			number: 'number',
			date: 'date'
		}

	}));

	return UIInput;

});
