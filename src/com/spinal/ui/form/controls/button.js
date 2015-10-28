/**
*	@module com.spinal.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/view', 'util/string'], function(View, StringUtil) {

	/**
	*	Button Class
	*	@namespace com.spinal.ui.form.controls
	*	@class com.spinal.ui.form.controls.Button
	*	@extends com.spinal.ui.View
	*
	*	@requires com.spinal.ui.View
	**/
	var UIButton = Spinal.namespace('com.spinal.ui.form.controls.Button', View.inherit({

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
		className: 'ui-button btn',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'button',

		/**
		*	Button's default text
		*	@private
		*	@property _text
		*	@type String
		**/
		_text: 'default',

		/**
		*	Button's default style
		*	@private
		*	@property _style
		*	@type String
		**/
		_style: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return com.spinal.ui.form.controls.Button
		**/
		initialize: function(options) {
			options || (options = {});
			if(options.text) this._text = options.text;
			this._style = (options.style) ? options.style : UIButton.TYPES.standard;
			UIButton.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Button
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.form.controls.Button}
		**/
		render: function(opts) {
			UIButton.__super__.render.apply(this, arguments);
			this.text(this._text);
			this.style(this._style);
			return this;
		},

		/**
		*	Update Button
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model}
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		**/
		update: function(model, value, opts) {
			if(_.isString(value)) this.text(value);
			return UIButton.__super__.update.apply(this, arguments);
		},

		/**
		*	Change the button's text
		*	@public
		*	@chainable
		*	@method text
		*	@param content {String} button's content
		*	@return {com.spinal.ui.form.controls.Button}
		**/
		text: function(content) {
			if(!_.defined(content)) return this._text;
			this.$el.html((this._text = content));
			return this;
		},

		/**
		*	Change button's style
		*	@public
		*	@chainable
		*	@method style
		*	@param name {String} button's style
		*	@return {com.spinal.ui.form.controls.Button}
		**/
		style: function(name) {
			if(!_.defined(name)) return this._style;
			this.$el.removeClass(this._style).addClass((this._style = name));
			return this;
		},

		/**
		*	Click Handler
		*	@private
		*	@method _onClick
		*	@param e {Object} event reference
		**/
		_onClick: function(e) {
			this.trigger(UIButton.EVENTS.clicked, this);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Button',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event clicked
			**/
			clicked: 'com:spinal:ui:view:form:controls:button:clicked'
		},

		/**
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			standard: 'btn-default',
			primary: 'btn-primary',
			success: 'btn-success',
			info: 'btn-info',
			warning: 'btn-warning',
			danger: 'btn-danger',
			link: 'btn-link'
		}

	}));

	return UIButton;

});
