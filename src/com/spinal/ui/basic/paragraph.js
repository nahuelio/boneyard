/**
*	@module com.spinal.ui.basic
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/view', 'util/string'], function(View, StringUtil) {

	/**
	*	Paragraph Class
	*	@namespace com.spinal.ui.basic
	*	@class com.spinal.ui.basic.Paragraph
	*	@extends com.spinal.ui.View
	*
	*	@requires com.spinal.ui.View
	**/
	var UIParagraph = Spinal.namespace('com.spinal.ui.basic.Paragraph', View.inherit({

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
		*	@return {com.spinal.ui.basic.Paragraph}
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
		*	@return {com.spinal.ui.basic.Paragraph}
		**/
		render: function(opts) {
			UIParagraph.__super__.render.apply(this, arguments);
			this.content(this._content);
			return this;
		},

		/**
		*	Change the paragraph's content
		*	@public
		*	@chainable
		*	@method content
		*	@param c {String} paragraph's content
		*	@return {com.spinal.ui.basic.Paragraph}
		**/
		content: function(c) {
			if(!StringUtil.defined(c)) return this._content;
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
