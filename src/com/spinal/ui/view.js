/**
*	@module com/spinal/ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal', 'libs/bootstrap'], function(Spinal) {

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
		template: _.template('<div class="{{className}}"></div>'),

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
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'com:spinal:ui:view',

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		method: 'appendTo',

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param attrs {Object} view options
		*	@return {com.spinal.ui.View}
		**/
		initialize: function(attrs) {
			View.__super__.initialize.apply(this, arguments);
			this._valid(attrs);
			if(!attrs.model) this.model = new Backbone.Model();
			if(attrs.method) this.method = attrs.method;
			if(attrs.tpl) this.template = _.template($('<div/>').append($(attrs.tpl).addClass('{{className}}')).html());
			this.succesor = attrs.succesor;
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
			attrs || (attrs = {});
			var err;
			if(!attrs.succesor) throw new Error(this.toString() + ' requires a \'succesor\' attribute passed to the constructor.');
			if(!(attrs.succesor instanceof Backbone.View)) err = ' \'succesor\' must be an instance of Backbone.View.';
			if(attrs.model && !(attrs.model instanceof Backbone.Model)) err = ' \'model\' must be an instance of Backbone.Model.';
			if(attrs.method && !(View.RENDER[attrs.method])) err = ' unsupported render \'method -> ' + attrs.method + '\'.';
			if(attrs.method && attrs.method === View.RENDER.html) err = ' html render method is unsupported for instances of View Class.';
			if(err) throw new Error(this.toString() + err);
			return true;
		},

		/**
		*	Render View
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		render: function(opts) {
			opts || (opts = {});
			this.clear();
			var m = this.method;
			if(opts.method && _.contains(_.values(View.RENDER), opts.method)) {
				m = opts.method;
				if(opts.method === View.RENDER.html || opts.method === View.RENDER.append) m = View.RENDER.appendTo;
				if(opts.method === View.RENDER.prepend) m = View.RENDER.prependTo;
			}
			var tpl = this.template(_.extend({ className: this.className }, this.model.toJSON()));
			this.setElement($(tpl)[m](this.succesor.$el));
			if(!opts.silent) this.trigger(View.EVENTS.rendered, { view: this });
			return this;
		},

		/**
		*	Update View
		*	@public
		*	@chainable
		*	@method update
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		update: function(opts) {
			if(!opts || !opts.silent) this.trigger(View.EVENTS.updated, { view: this });
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
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		show: function(opts) {
			if(this.$el) this.$el.show();
			if(!opts || !opts.silent) this.trigger(View.EVENTS.shown, { view: this });
			return this;
		},

		/**
		*	Hide View
		*	@public
		*	@chainable
		*	@method hide
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		hide: function(opts) {
			if(this.$el) this.$el.hide();
			if(!opts || !opts.silent) this.trigger(View.EVENTS.hidden, { view: this });
			return this;
		},

		/**
		*	Enable View
		*	@public
		*	@chainable
		*	@method enable
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		enable: function(opts) {
			if(this.$el) this.$el.enable();
			if(!opts || !opts.silent) this.trigger(View.EVENTS.enabled, { view: this });
			return this;
		},

		/**
		*	Disable View
		*	@public
		*	@chainable
		*	@method disable
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		disable: function(opts) {
			if(this.$el) this.$el.disable();
			if(!opts || !opts.silent) this.trigger(View.EVENTS.disabled, { view: this });
			return this;
		},

		/**
		*	Clear View
		*	@public
		*	@chainable
		*	@method clear
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		clear: function(opts) {
			if(this.$el) {
				this.$el.remove();
				if(!opts || !opts.silent) this.trigger(View.EVENTS.cleared, { view: this });
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
		*	@property RENDER
		*	@type Object
		**/
		RENDER: {
			/**
			*	@property APPEND
			*	@type String
			**/
			append: 'append',
			/**
			*	@property PREPEND
			*	@type String
			**/
			prepend: 'prepend',
			/**
			*	@property APPENDTO
			*	@type String
			**/
			appendTo: 'appendTo',
			/**
			*	@property PREPENDTO
			*	@type String
			**/
			prependTo: 'prependTo',
			/**
			*	@property HTML
			*	@type String
			**/
			html: 'html',
		},

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event shown
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
