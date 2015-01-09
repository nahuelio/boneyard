/**
*	@module com.spinal.ui.basic
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/basic/paragraph', 'util/string'], function(Paragraph, StringUtil) {

	/**
	*	Link Class
	*	@namespace com.spinal.ui.basic
	*	@class com.spinal.ui.basic.Link
	*	@extends com.spinal.ui.basic.Paragraph
	*
	*	@requires com.spinal.ui.basic.Paragraph
	**/
	var UILink = Spinal.namespace('com.spinal.ui.basic.Link', Paragraph.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-link',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'a',

		/**
		*	Link's default href
		*	@public
		*	@property _href
		*	@type String
		**/
		_href: '#',

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return {com.spinal.ui.basic.Link}
		**/
		initialize: function(options) {
			options || (options = {});
			if(options.href) this._href = options.href;
			UILink.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Link
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.basic.Link}
		**/
		render: function(opts) {
			UILink.__super__.render.apply(this, arguments);
			this.href(this._href);
			return this;
		},

		/**
		*	Change the link's href
		*	@public
		*	@chainable
		*	@method href
		*	@param uri {String} link's URI
		*	@return {com.spinal.ui.basic.Link}
		**/
		href: function(uri) {
			if(!_.defined(uri)) return this._href;
			this.$el.attr('href', (this._href = uri));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Link'

	}));

	return UILink;

});
