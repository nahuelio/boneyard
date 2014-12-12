/**
*	@module com.spinal.ui.basic
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/basic/paragraph'], function(Paragraph) {

	/**
	*	Header Class
	*	@namespace com.spinal.ui.basic
	*	@class com.spinal.ui.basic.Header
	*	@extends com.spinal.ui.basic.Paragraph
	*
	*	@requires com.spinal.ui.basic.Paragraph
	**/
	var UIHeader = Spinal.namespace('com.spinal.ui.basic.Header', Paragraph.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-header',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'h',

		/**
		*	Header's default heading
		*	@public
		*	@property tagName
		*	@type String
		**/
		_heading: '1',

		/**
		*	Constructor
		*	@method constructor
		*	@param [options] {Object} View Options
		**/
		constructor: function(options) {
			options || (options = {});
			if(options.heading) this._heading = options.heading;
			this.tagName = (this.tagName + this._heading);
			UIHeader.__super__.constructor.apply(this, arguments);
		},

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return {com.spinal.ui.basic.Header}
		**/
		initialize: function(options) {
			options || (options = {});
			UIHeader.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Header'

	}));

	return UIHeader;

});
