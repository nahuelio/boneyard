/**
*	@module com.spinal.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container',
		'ui/form/controls/option'], function(Container, Option) {

	/**
	*	Select Class
	*	@namespace com.spinal.ui.form.controls
	*	@class com.spinal.ui.form.controls.Select
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	*	@requires com.spinal.ui.form.controls.Option
	**/
	var UISelect = Spinal.namespace('com.spinal.ui.form.controls.Select', Container.inherit({

		/**
		*	Events
		*	@public
		*	@property events
		*	@type Object
		**/
		events: {
			'change': '_onChange'
		},

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-select',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'select',

		/**
		*	Select's default name
		*	@private
		*	@property _name
		*	@type String
		**/
		_name: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param opts {Object} view options
		*	@return {com.spinal.ui.form.controls.Select}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			opts.interface = Option;
			if(opts.options && opts.options.length > 0) { opts.views = opts.options; delete opts.options; }
			UISelect.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Render Select
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.form.controls.Select}
		**/
		render: function(opts) {
			UISelect.__super__.render.apply(this, arguments);
			return this.name();
		},

		/**
		*	Change the Select's name
		*	@public
		*	@chainable
		*	@method name
		*	@param n {String} Select's name
		*	@return {com.spinal.ui.form.controls.Select}
		**/
		name: function(n) {
			this._name = (n && n !== '') ? n : this._name;
			this.$el.attr('name', this._name);
			return this;
		},

		/**
		*	Change Handler
		*	@private
		*	@method _onChange
		*	@param e {Object} event reference
		**/
		_onChange: function(e) {
			this.trigger(UISelect.EVENTS.changed, this);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'UISelect',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event changed
			**/
			changed: 'com:spinal:ui:view:form:controls:select:changed'
		}

	}));

	return UISelect;

});
