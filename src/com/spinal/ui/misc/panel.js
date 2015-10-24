/**
*	@module com.spinal.ui.misc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container', 'util/string'], function(Container, StringUtil) {

	/**
	*	Panel Class
	*	@namespace com.spinal.ui.misc
	*	@class com.spinal.ui.misc.Panel
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	**/
	var UIPanel = Spinal.namespace('com.spinal.ui.misc.Panel', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-panel panel',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'div',

		/**
		*	Panel's default title
		*	@private
		*	@property _title
		*	@type String
		**/
		_title: 'Default Title',

		/**
		*	Panel's default type
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
		*	@return {com.spinal.ui.misc.Panel}
		**/
		initialize: function(options) {
			options || (options = {});
			if(options.title) this._title = options.title;
			this._type = (options.type) ? options.type : UIPanel.TYPES.standard;
			var d = { tagName: 'div' };
			options.template =
				Spinal.html('tag', _.extend({ cls: 'panel-heading' }, d)) +
				Spinal.html('tag', _.extend({ cls: 'panel-body' }, d));
			UIPanel.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Target element in which subviews will be rendered into
		*	@public
		*	@method _targetEl
		*	@return Object
		**/
		_targetEl: function() {
			return this.$el.children('.panel-body');
		},

		/**
		*	Render Panel
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.misc.Panel}
		**/
		render: function(opts) {
			UIPanel.__super__.render.apply(this, arguments);
			this.title(this._title);
			this.type(this._type);
			return this;
		},

		/**
		*	Change the panel's title
		*	@public
		*	@chainable
		*	@method title
		*	@param content {String} panel's content
		*	@return {com.spinal.ui.misc.Panel}
		**/
		title: function(content) {
			if(!_.defined(content)) return this._title;
			this.$el.children('.panel-heading').html((this._title = content));
			return this;
		},

		/**
		*	Change panel's type
		*	@public
		*	@chainable
		*	@method type
		*	@param name {String} button's type
		*	@return {com.spinal.ui.misc.Panel}
		**/
		type: function(name) {
			if(!_.defined(name)) return this._type;
			this.$el.removeClass(this._type).addClass((this._type = name));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Panel',

		/**
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			standard: 'panel-default',
			primary: 'panel-primary',
			success: 'panel-success',
			info: 'panel-info',
			warning: 'panel-warning',
			danger: 'panel-danger'
		}

	}));

	return UIPanel;

});
