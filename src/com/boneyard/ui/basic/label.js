/**
*	@module com.boneyard.ui.basic
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/basic/paragraph', 'util/string'], function(Paragraph, StringUtil) {

	/**
	*	Class Label
	*	@namespace com.boneyard.ui.basic
	*	@class com.boneyard.ui.basic.Label
	*	@extends com.boneyard.ui.basic.Paragraph
	*
	*	@requires com.boneyard.ui.basic.Paragraph
	**/
	var UILabel = Boneyard.namespace('com.boneyard.ui.basic.Label', Paragraph.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-label',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'label',

		/**
		*	Label's default heading
		*	@public
		*	@property tagName
		*	@type String
		**/
		_afor: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return com.boneyard.ui.basic.Label
		**/
		initialize: function(options) {
			options || (options = {});
			if(options.afor) this._afor = options.afor;
			UILabel.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render View
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.basic.Label
		**/
		render: function(opts) {
			UILabel.__super__.render.apply(this, arguments);
			this.afor(this._afor);
			return this;
		},

		/**
		*	Change the label's for attribute
		*	@public
		*	@chainable
		*	@method content
		*	@param _for {String} label's content
		*	@return com.boneyard.ui.basic.Paragraph
		**/
		afor: function(_for) {
			if(!_.defined(_for)) return this._afor;
			this.$el.attr('for', (this._afor = _for));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Label'

	}));

	return UILabel;

});
