/**
*	@module com.spinal.ui.misc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container'], function(Container) {

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
		*	Panel's template
		*	@public
		*	@property template
		*	@type Function
		**/
		template: Spinal.app.html_tpl('spinal.basic.div', { _$: { cls: 'panel-heading' }}) +
			Spinal.app.html_tpl('spinal.basic.div', { _$: { cls: 'panel-body' }}),

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
			UIPanel.__super__.initialize.apply(this, arguments);
			return this;
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
			// TODO: Change Render method to render view's collection into to div.panel-body
			UIPanel.__super__.render.apply(this, arguments);
			return this.title().type();
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
			this._title = (content) ? content : this._title;
			this.$el.children('.panel-heading').html(this._title);
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
			this.$el.removeClass(this._type);
			this._type = (name && name !== this._type) ? name : this._type;
			this.$el.addClass(this._type);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'UIPanel',

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
