/**
*	@module com/spinal/ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	Define a generic view interface that extends classic Backbone.View
	*	@namespace com.spinal.ui
	*	@class com.spinal.ui.View
	*	@extends Spinal.Backbone.View
	**/
	var View = Spinal.namespace('com.spinal.ui.View', Spinal.Backbone.View.inherit({

		/**
		*	Template
		*	@public
		*	@property template
		*	@type Function
		**/
		template: _.template('<div></div>'),

		/**
		*	Succesor
		*	@public
		*	@property succesor
		*	@type {com.spinal.ui.View}
		**/
		succesor: null,

		/**
		*	Events
		*	@public
		*	@property events
		*	@type Object
		**/
		events: {},

		/**
		*	Internal CSS className
		*	@private
		*	@property _className
		*	@type String
		**/
		_className: 'ui:view',

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ui.View}
		**/
		initialize: function(attrs) {
			View.__super__.initialize.apply(this, arguments);
			this._valid(attrs);
			if(attrs.tpl) this.template = _.template(attrs.tpl);
			this.setElement(this.template({}));
			return this;
		},

		/**
		*	Validate Parameters
		*	@private
		*	@method _valid
		*	@param attrs {Object} attributes
		*	@return Boolean
		**/
		_valid: function(attrs) {
			if(!attrs.succesor) throw new Error(this.toString() + ' \'succesor\' must be passed to to constructor.');
			if(attrs.succesor instanceof Backbone.View)
				throw new Error(this.toString() + ' \'succesor\' must be an instance of Backbone.View.');
			return true;
		},

		/**
		*	Render View
		*	@public
		*	@chainable
		*	@method render
		*	@return {com.spinal.ui.View}
		**/
		render: function() {
			this.clear();
			this.trigger(View.EVENTS.rendered, { view: this });
			return this;
		},

		/**
		*	Update View
		*	@public
		*	@chainable
		*	@method update
		*	@return {com.spinal.ui.View}
		**/
		update: function() {
			this.trigger(View.EVENTS.updated, { view: this });
			return this;
		},

		/**
		*	Lookup
		*	@public
		*	@chainable
		*	@method lookup
		*	@param id {String} Succesor id
		*	@return {com.spinal.ui.View}
		**/
		lookup: function(id) {
			return this._next(id);
		},

		/**
		*	Show View
		*	@public
		*	@chainable
		*	@method show
		*	@return {com.spinal.ui.View}
		**/
		show: function() {
			if(this.$el) this.$el.show();
			this.trigger(View.EVENTS.shown, { view: this });
			return this;
		},

		/**
		*	Hide View
		*	@public
		*	@chainable
		*	@method hide
		*	@return {com.spinal.ui.View}
		**/
		hide: function() {
			if(this.$el) this.$el.hide();
			this.trigger(View.EVENTS.hidden, { view: this });
			return this;
		},

		/**
		*	Enable View
		*	@public
		*	@chainable
		*	@method enable
		*	@return {com.spinal.ui.View}
		**/
		enable: function() {
			if(this.$el) this.$el.enable();
			this.trigger(View.EVENTS.enabled, { view: this });
			return this;
		},

		/**
		*	Disable View
		*	@public
		*	@chainable
		*	@method disable
		*	@return {com.spinal.ui.View}
		**/
		disable: function() {
			if(this.$el) this.$el.disable();
			this.trigger(View.EVENTS.disabled, { view: this });
			return this;
		},

		/**
		*	Clear View
		*	@public
		*	@chainable
		*	@method clear
		*	@param opts {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		clear: function(opts) {
			opts || (opts = {});
			if(this.$el) {
				this.$el.children().remove();
				if(!opts.silent) this.trigger(View.EVENTS.cleared, { view: this });
			}
			return this;
		},

		/**
		*	Try to Retrieve next succesor if possible (Chain of Responsability)
		*	@private
		*	@method _next
		*	@param id {String} Succesor id
		*	@return {com.spinal.ui.View}
		**/
		_next: function(id) {
			if(this.id === id) return this;
			if(this.successor) return this.successor.lookup(id);
			return null;
		},

		/**
		*	String representation of an instance of this class
		*	@public
		*	@method toString
		*	@return String
		**/
		toString: function() {
			return '[object View]';
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'View',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			* @event shown
			**/
			shown: 'com:spinal:ui:view:shown',
			/**
			*	@event hidden
			**/
			hidden: 'com:spinal:ui:view:hidden',
			/**
			*	@event enabled
			**/
			enabled: 'com:spinal:ui:view:enabled',
			/**
			*	@event disabled
			**/
			disabled: 'com:spinal:ui:view:disabled',
			/**
			*	@event rendered
			**/
			rendered: 'com:spinal:ui:view:rendered',
			/**
			*	@event updated
			**/
			updated: 'com:spinal:ui:view:updated',
			/**
			*	@event cleared
			**/
			cleared: 'com:spinal:ui:view:cleared'
		}

	}));

	return View;

});
