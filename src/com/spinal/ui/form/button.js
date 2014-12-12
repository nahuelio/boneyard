/**
*	@module com.spinal.ui.form
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/view'], function(View) {

	/**
	*	Button Class
	*	@namespace com.spinal.ui.form
	*	@class com.spinal.ui.form.Button
	*	@extends com.spinal.ui.View
	*
	*	@requires com.spinal.ui.View
	**/
	var UIButton = Spinal.namespace('com.spinal.ui.form.Button', View.inherit({

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
		*	Button's default type
		*	@private
		*	@property _type
		*	@type String
		**/
		_type: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return {com.spinal.ui.form.Button}
		**/
		initialize: function(options) {
			options || (options = {});
			if(options.text) this._text = options.text;
			this._type = (options.type) ? options.type : UIButton.TYPES.standard;
			UIButton.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Button
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.form.Button}
		**/
		render: function(opts) {
			UIButton.__super__.render.apply(this, arguments);
			return this.text().type();
		},

		/**
		*	Change the button's text
		*	@public
		*	@chainable
		*	@method text
		*	@param content {String} button's content
		*	@return {com.spinal.ui.form.Button}
		**/
		text: function(content) {
			this._text = (content) ? content : this._text;
			this.$el.html(this._text);
			return this;
		},

		/**
		*	Change button's type
		*	@public
		*	@chainable
		*	@method type
		*	@param name {String} button's type
		*	@return {com.spinal.ui.form.Button}
		**/
		type: function(name) {
			this.$el.removeClass(this._type);
			this._type = (name && name !== this._type) ? name : this._type;
			this.$el.addClass(this._type);
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
		NAME: 'UIButton',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event shown
			**/
			clicked: 'com:spinal:ui:view:form:button'
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
