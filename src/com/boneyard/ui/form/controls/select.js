/**
*	@module com.boneyard.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container',
		'ui/form/controls/option',
		'util/string'], function(Container, Option, StringUtil) {

	/**
	*	Class Select
	*	@namespace com.boneyard.ui.form.controls
	*	@class com.boneyard.ui.form.controls.Select
	*	@extends com.boneyard.ui.Container
	*
	*	@requires com.boneyard.ui.Container
	*	@requires com.boneyard.ui.form.controls.Option
	**/
	var UISelect = Boneyard.namespace('com.boneyard.ui.form.controls.Select', Container.inherit({

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
		*	@return com.boneyard.ui.form.controls.Select
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
		*	@return com.boneyard.ui.form.controls.Select
		**/
		render: function(opts) {
			UISelect.__super__.render.apply(this, arguments);
			this.name(this._name);
			return this;
		},

		/**
		*	Update Container
		*	@public
		*	@chaniable
		*	@method update
		*	@param model {Backbone.Model} model reference
		*	@param value {Object} value that has changed
		*	@return com.boneyard.ui.form.controls.Select
		**/
		update: function(model, opts) {
			return UISelect.__super__.update.apply(this, arguments);
		},

		/**
		*	Change the Select's name
		*	@public
		*	@chainable
		*	@method name
		*	@param n {String} Select's name
		*	@return com.boneyard.ui.form.controls.Select
		**/
		name: function(n) {
			if(!_.defined(n)) return this._name;
			this.$el.attr('name', (this._name = n));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Select',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event changed
			**/
			changed: 'com:boneyard:ui:view:form:controls:select:changed'
		}

	}));

	return UISelect;

});
