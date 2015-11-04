/**
*	@module com.boneyard.ui.basic
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/view', 'util/string'], function(View, StringUtil) {

	/**
	*	Class Paragraph
	*	@namespace com.boneyard.ui.basic
	*	@class com.boneyard.ui.basic.Paragraph
	*	@extends com.boneyard.ui.View
	*
	*	@requires com.boneyard.ui.View
	**/
	var UIParagraph = Boneyard.namespace('com.boneyard.ui.basic.Paragraph', View.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-paragrah',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'p',

		/**
		*	Paragraph's default content
		*	@private
		*	@property _content
		*	@type String
		**/
		_content: '',

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return com.boneyard.ui.basic.Paragraph
		**/
		initialize: function(options) {
			options || (options = {});
			if(options.content) this._content = options.content;
			UIParagraph.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Paragraph
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.basic.Paragraph
		**/
		render: function(opts) {
			UIParagraph.__super__.render.apply(this, arguments);
			this.content(this._content);
			return this;
		},

		/**
		*	Update Paragraph
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model} model reference
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.basic.Paragraph
		**/
		update: function(model, value, opts) {
			if(_.isString(value)) this.text(value);
			return UIParagraph.__super__.update.apply(this, arguments);
		},

		/**
		*	Change the paragraph's content
		*	@public
		*	@chainable
		*	@method content
		*	@param c {String} paragraph's content
		*	@return com.boneyard.ui.basic.Paragraph
		**/
		content: function(c) {
			if(!_.defined(c)) return this._content;
			this.$el.html((this._content = c));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Paragraph'

	}));

	return UIParagraph;

});
