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
		*	Events
		*	@public
		*	@property events
		*	@type Object
		**/
		events: {
			'click': '_onClick',
			'keyup': '_onKeyUp',
			'keydown': '_onKeyDown',
			'focusIn': '_onFocus',
			'focusOut': '_onBlur'
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
		_type: null,

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
			_.extend(this, StringUtil.toPrivate(_.pick(options, 'name', 'value', 'placeholder')));
			this._type = (options.type) ? options.type : UIInput.TYPES.text;
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
			return this.type().name().placeholder().value();
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
			this._name = (n && n !== '') ? n : this._name;
			this.$el.attr('name', this._name);
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
			this._value = (val) ? val : this._value;
			this.$el.val(this._value);
			return this;
		},

		/**
		*	Change the Input's placeholder
		*	@public
		*	@chainable
		*	@method placeholder
		*	@param ph {String} Input's placeholder
		*	@return {com.spinal.ui.form.controls.Input}
		**/
		placeholder: function(ph) {
			this._placeholder = (ph) ? ph : this._placeholder;
			this.$el.attr('placeholder', this._placeholder);
			return this;
		},

		/**
		*	Change Input's type
		*	@public
		*	@chainable
		*	@method type
		*	@param type {String} Input's type
		*	@return {com.spinal.ui.form.controls.Input}
		**/
		type: function(type) {
			this._type = (type && type !== '' && type !== this._type) ? type : this._type;
			this.$el.attr('type', this._type);
			return this;
		},

		/**
		*	Click Handler
		*	@private
		*	@method _onClick
		*	@param e {Object} event reference
		**/
		_onClick: function(e) { this.trigger(UIInput.EVENTS.click, this); },

		/**
		*	KeyUp Handler
		*	@private
		*	@method _onKeyUp
		*	@param e {Object} event reference
		**/
		_onKeyUp: function(e) { this.trigger(UIInput.EVENTS.keyup, this); },

		/**
		*	KeyDown Handler
		*	@private
		*	@method _onKeyDown
		*	@param e {Object} event reference
		**/
		_onKeyDown: function(e) { this.trigger(UIInput.EVENTS.keydown, this); },

		/**
		*	Focus Handler
		*	@private
		*	@method _onFocus
		*	@param e {Object} event reference
		**/
		_onFocus: function(e) { this.trigger(UIInput.EVENTS.focus, this); },

		/**
		*	Blur Handler
		*	@private
		*	@method _onBlur
		*	@param e {Object} event reference
		**/
		_onBlur: function(e) { this.trigger(UIInput.EVENTS.blur, this); }

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
			*	@event click
			**/
			click: 'com:spinal:ui:view:form:controls:input:click',
			/**
			*	@event keyup
			**/
			keyup: 'com:spinal:ui:view:form:controls:input:keyup',
			/**
			*	@event keydown
			**/
			keydown: 'com:spinal:ui:view:form:controls:input:keydown',
			/**
			*	@event focus
			**/
			focus: 'com:spinal:ui:view:form:controls:input:focus',
			/**
			*	@event blur
			**/
			blur: 'com:spinal:ui:view:form:controls:input:blur'
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
