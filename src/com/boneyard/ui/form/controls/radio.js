/**
*	@module com.boneyard.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/form/controls/input', 'util/string'], function(Input, StringUtil) {

	/**
	*	Class Radio
	*	@namespace com.boneyard.ui.form.controls
	*	@class com.boneyard.ui.form.controls.Radio
	*	@extends com.boneyard.ui.form.controls.Input
	*
	*	@requires com.boneyard.ui.form.controls.Input
	*	@requires com.boneyard.util.StringUtil
	**/
	var UIRadio = Boneyard.namespace('com.boneyard.ui.form.controls.Radio', Input.inherit({

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
		className: 'ui-radio',

		/**
		*	Input's type
		*	@private
		*	@property _type
		*	@type String
		**/
		_type: Input.TYPES.radio,

		/**
		*	Radio's default value
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
		*	@return com.boneyard.ui.form.controls.Radio
		**/
		initialize: function(opts) {
			opts || (opts = {});
			delete opts.placeholder;
			UIRadio.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Radio
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.form.controls.Radio
		**/
		render: function(opts) {
			UIRadio.__super__.render.apply(this, arguments);
			this.value(this._value);
			return this;
		},

		/**
		*	Update Radio
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model} model reference
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.form.controls.Radio
		**/
		update: function(model, value, opts) {
			if(_.isBoolean(value)) this.value(value);
			return UIRadio.__super__.update.apply(this, arguments);
		},

		/**
		*	Change the Radio's value
		*	@public
		*	@chainable
		*	@method value
		*	@param [val] {Boolean} Radio's value
		*	@return Boolean
		**/
		value: function(val) {
			if(!_.defined(val)) return this._value;
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
			this.trigger(UIRadio.EVENTS.click, { view: this });
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Radio'

	}));

	return UIRadio;

});
