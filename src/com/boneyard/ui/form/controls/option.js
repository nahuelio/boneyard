/**
*	@module com.boneyard.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/view', 'util/string'], function(View, StringUtil) {

	/**
	*	Class Option
	*	@namespace com.boneyard.ui.form.controls
	*	@class com.boneyard.ui.form.controls.Option
	*	@extends com.boneyard.ui.View
	*
	*	@requires com.boneyard.ui.View
	**/
	var UIOption = Boneyard.namespace('com.boneyard.ui.form.controls.Option', View.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-option',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'option',

		/**
		*	Option's default value
		*	@private
		*	@property _value
		*	@type String
		**/
		_value: '',

		/**
		*	Option's default text
		*	@private
		*	@property _text
		*	@type String
		**/
		_text: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return com.boneyard.ui.form.controls.Option
		**/
		initialize: function(options) {
			options || (options = {});
			if(options.value) this._value = options.value;
			if(options.text) this._text = options.text;
			UIOption.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Option
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.form.controls.Option
		**/
		render: function(opts) {
			UIOption.__super__.render.apply(this, arguments);
			this.value(this._value);
			this.text(this._text);
			return this;
		},

		/**
		*	Update Option
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model} model reference
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		*	@requires com.boneyard.ui.form.controls.Option
		**/
		update: function(model, value, opts) {
			if(_.isString(value)) this.text(value);
			return UIOption.__super__.update.apply(this, arguments);
		},

		/**
		*	Change the Option's text
		*	@public
		*	@chainable
		*	@method text
		*	@param txt {String} Option's text
		*	@return com.boneyard.ui.form.controls.Option
		**/
		text: function(txt) {
			if(!_.defined(txt)) return this._text;
			this.$el.html((this._text = txt));
			return this;
		},

		/**
		*	Change the Option's value
		*	@public
		*	@chainable
		*	@method value
		*	@param val {String} Option's value
		*	@return com.boneyard.ui.form.controls.Option
		**/
		value: function(val) {
			if(!_.defined(val)) return this._value;
			this.$el.val((this._value = val));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Option'

	}));

	return UIOption;

});
