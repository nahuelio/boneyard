/**
*	@module com.boneyard.ui.basic
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/view', 'util/string'], function(View, StringUtil) {

	/**
	*	Class Image
	*	@namespace com.boneyard.ui.basic
	*	@class com.boneyard.ui.basic.Image
	*	@extends com.boneyard.ui.View
	*
	*	@requires com.boneyard.ui.basic.View
	**/
	var UIImage = Boneyard.namespace('com.boneyard.ui.basic.Image', View.inherit({

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
		*	@return com.boneyard.ui.basic.Image
		**/
		initialize: function(options) {
			options || (options = {});
			if(options.src) this._src = options.src;
			if(options.alt) this._alt = options.alt;
			UIImage.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render View
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.basic.Image
		**/
		render: function(opts) {
			UIImage.__super__.render.apply(this, arguments);
			this.src(this._src);
			this.alt(this._alt);
			return this;
		},

		/**
		*	Update View
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model} model reference
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.basic.Image
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
		*	@return com.boneyard.ui.basic.Image
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
		*	@return com.boneyard.ui.basic.Image
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
