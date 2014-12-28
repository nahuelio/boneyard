/**
*	@module com.spinal.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/form/controls/input', 'util/string'], function(Input, StringUtil) {

	/**
	*	Checkbox Class
	*	@namespace com.spinal.ui.form.controls
	*	@class com.spinal.ui.form.controls.Checkbox
	*	@extends com.spinal.ui.form.controls.Input
	*
	*	@requires com.spinal.ui.form.controls.Input
	*	@requires com.spinal.util.StringUtil
	**/
	var UICheckbox = Spinal.namespace('com.spinal.ui.form.controls.Checkbox', Input.inherit({

		/**
		*	Events
		*	@public
		*	@property events
		*	@type Object
		**/
		events: {
			'click': '_onClick'
		},

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-checkbox',

		/**
		*	Input's type
		*	@private
		*	@property _type
		*	@type String
		**/
		_type: Input.TYPES.checkbox,

		/**
		*	Checkbox's default value
		*	@private
		*	@property _value
		*	@type String
		**/
		_value: false,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return {com.spinal.ui.form.controls.Checkbox}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			delete opts.placeholder;
			UICheckbox.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Checkbox
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.form.controls.Checkbox}
		**/
		render: function(opts) {
			UICheckbox.__super__.render.apply(this, arguments);
			this.value(this._value);
			return this;
		},

		/**
		*	Update Checkbox
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model}
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		**/
		update: function(model, value, opts) {
			if(_.isBoolean(value)) this.value(value);
			return UICheckbox.__super__.update.apply(this, arguments);
		},

		/**
		*	Change the Checkbox's value
		*	@public
		*	@chainable
		*	@method value
		*	@param [val] {Boolean} Checkbox's value
		*	@return Boolean
		**/
		value: function(val) {
			if(!StringUtil.defined(val)) return this._value;
			this.$el.prop('checked', (this._value = val));
			return this;
		},

		/**
		*	Click Handler
		*	@private
		*	@method _onClick
		*	@param e {Object} event reference
		**/
		_onClick: function(e) {
			this.value($(e.currentTarget).prop('checked'));
			this.trigger(UICheckbox.EVENTS.click, { view: this });
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Checkbox'

	}));

	return UICheckbox;

});
