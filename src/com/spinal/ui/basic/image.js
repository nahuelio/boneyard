/**
*	@module com.spinal.ui.basic
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/view', 'util/string'], function(View, StringUtil) {

	/**
	*	Image Class
	*	@namespace com.spinal.ui.basic
	*	@class com.spinal.ui.basic.Image
	*	@extends com.spinal.ui.View
	*
	*	@requires com.spinal.ui.basic.View
	**/
	var UIImage = Spinal.namespace('com.spinal.ui.basic.Image', View.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-image',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'img',

		/**
		*	Image's default src
		*	@private
		*	@property _src
		*	@type String
		**/
		_src: null,

		/**
		*	Image's default src
		*	@private
		*	@property _src
		*	@type String
		**/
		_alt: '',

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return {com.spinal.ui.basic.Image}
		**/
		initialize: function(options) {
			options || (options = {});
			if(options.src) this._src = options.src;
			if(options.alt) this._alt = options.alt;
			UIImage.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Image
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.basic.Image}
		**/
		render: function(opts) {
			UIImage.__super__.render.apply(this, arguments);
			this.src(this._src);
			this.alt(this._alt);
			return this;
		},

		/**
		*	Update Image
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model}
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		**/
		update: function(model, value, opts) {
			if(_.isString(value)) this.src(value);
			return UIImage.__super__.update.apply(this, arguments);
		},

		/**
		*	Change the image's src
		*	@public
		*	@chainable
		*	@method src
		*	@param src {String} image's src
		*	@return {com.spinal.ui.basic.Image}
		**/
		src: function(src) {
			if(!_.defined(src)) return this._src;
			this.$el.attr('src', (this._src = src));
			return this;
		},

		/**
		*	Change the image's alt
		*	@public
		*	@chainable
		*	@method alt
		*	@param alt {String} image's alt
		*	@return {com.spinal.ui.basic.Image}
		**/
		alt: function(alt) {
			if(!_.defined(alt)) return this._alt;
			this.$el.attr('alt', (this._alt = alt));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Image'

	}));

	return UIImage;

});
