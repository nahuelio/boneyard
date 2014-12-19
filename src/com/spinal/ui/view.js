/**
*	@module com.spinal.ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/string',
		'util/exception/ui',
		'templates/spinal',
		'libs/bootstrap'], function(Spinal, StringUtil, UIException) {

	/**
	*	Define a generic view interface that extends classic Backbone.View
	*	@namespace com.spinal.ui
	*	@class com.spinal.ui.View
	*	@extends Spinal.Backbone.View
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.util.StringUtil
	*	@requires com.spinal.util.exception.UIException
	*	@requires templates.spinal
	*	@requires libs.bootstrap
	**/
	var View = Spinal.namespace('com.spinal.ui.View', Spinal.Backbone.View.inherit({

		/**
		*	Identifier
		*	@public
		*	@property id
		*	@type String
		**/
		id: null,

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
		className: 'ui-view',

		/**
		*	Render Method
		*	@public
		*	@property method
		*	@type String
		**/
		method: 'append',

		/**
		*	Successor Reference
		*	@private
		*	@property _successor
		*	@type {com.spinal.ui.View}
		**/
		_successor: null,

		/**
		*	Theme Class name
		*	@private
		*	@property _theme
		*	@type String
		**/
		_theme: null,

		/**
		*	Constructor
		*	@method constructor
		*	@param [options] {Object} View Options
		**/
		constructor: function(options) {
			options || (options = {});
			Backbone.View.apply(this, arguments);
			this.id = (options.id) ? options.id : (this.$el.attr('id')) ? this.$el.attr('id') : null;
			if(options.autoId) this.id = StringUtil.uuid();
			this.$el.attr('id', this.id);
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param options {Object} view options
		*	@return {com.spinal.ui.View}
		**/
		initialize: function(options) {
			options || (options = {});
			this._valid(options);
			if(options.el) this.$el.addClass(this.className);
			if(options.theme) { this._theme = options.theme; this.$el.addClass(this._theme); }
			if(options.method) this.method = options.method;
			this.template = this._compile((options.template) ? options.template : this.template);
			return this;
		},

		/**
		*	Validates parameters passed to the contructor function of this class.
		*	@private
		*	@method _valid
		*	@param attrs {Object} attributes
		*	@return Boolean
		**/
		_valid: function(attrs) {
			attrs || (attrs = {});
			if(attrs.id && !_.isString(attrs.id)) throw new UIException('InvalidIDType');
			if(attrs.model && !(attrs.model instanceof Backbone.Model)) throw new UIException('InvalidModelType');
			if(attrs.method && !(View.RENDER[attrs.method])) throw new UIException('UnsupportedRenderMethod', { method: 'non-existent-method' });
			return true;
		},

		/**
		*	Default before render hook
		*	@private
		*	@method _beforeRender
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		_beforeRender: function(opts) {
			if(!this._successor) throw new UIException('SuccessorNotSpecified');
			if(!(this._successor instanceof Spinal.com.spinal.ui.Container)) throw new UIException('InvalidSuccessorType');
			if(this.id && !this._successor.findById(this.id)) throw new UIException('UIStackViolation', {
				viewId: 'view-error', succesorId: 'container-declared-inline'
			});
			return this;
		},

		/**
		*	Compiles and build the template function used by this view
		*	@private
		*	@method _compile
		*	@param tpl {Function} template to be included as child inside the original view root DOM element
		*	@return Function
		**/
		_compile: function(tpl) {
			tpl || (tpl = '');
			if(_.isFunction(tpl)) return tpl;
			return _.template(tpl);
		},

		/**
		*	Change Theme set in this view
		*	@public
		*	@method theme
		*	@param themeName {String} theme name
		*	@return {com.spinal.ui.View}
		**/
		theme: function(themeName) {
			if(!themeName || !_.isString(themeName)) return this;
			this.$el.removeClass(this._theme).addClass(themeName);
			this._theme = themeName;
			return this;
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
			this._beforeRender(arguments).detach();
			var m = (opts.method && (View.RENDER[opts.method])) ? opts.method : this.method,
				data = (!this.model) ? ((this._successor.model) ? this._successor.model.toJSON() : {}) : this.model.toJSON();
			this._successor._targetEl()[m]((this.template) ? this.$el.append(this.template(data)) : this.$el);
			if(!opts.silent) this.trigger(View.EVENTS.rendered, { view: this });
			this.delegateEvents();
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
		*	Perform a look up of the closest successor in the view hierarchery using the id passed as parameter.
		*	If the successor is not found, the method will give up returning null.
		*	@public
		*	@chainable
		*	@method lookup
		*	@param id {String} Successor id
		*	@return {com.spinal.ui.View}
		**/
		lookup: function(id) {
			if(!id) return null;
			return this._next(id);
		},

		/**
		*	Add CSS class to the $el element
		*	@public
		*	@chainable
		*	@method addClass
		*	@param className {String} CSS class name
		*	@return {com.spinal.ui.View}
		**/
		addClass: function(className) {
			if(!className) return this;
			this.$el.addClass(className);
			return this;
		},

		/**
		*	Removes CSS class from the $el element
		*	@public
		*	@chainable
		*	@method removeClass
		*	@param className {String} CSS class name
		*	@return {com.spinal.ui.View}
		**/
		removeClass: function(className) {
			if(!className) return this;
			this.$el.removeClass(className);
			return this;
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
			this.$el.show();
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
			this.$el.hide();
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
			this.$el.removeAttr('disabled');
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
			this.$el.attr('disabled', 'true');
			if(!opts || !opts.silent) this.trigger(View.EVENTS.disabled, { view: this });
			return this;
		},

		/**
		*	Detach View
		*	@public
		*	@method detach
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		detach: function(opts) {
			View.__super__.remove.apply(this, arguments);
			if(!opts || !opts.silent) this.trigger(View.EVENTS.detached, { view: this });
			return this;
		},

		/**
		*	Try to Retrieve next successor if possible (Chain of Responsability)
		*	@private
		*	@method _next
		*	@param id {String} Successor id
		*	@return {com.spinal.ui.View}
		**/
		_next: function(id) {
			if(this.id && this.id === id) return this;
			if(this._successor) return this._successor.lookup(id);
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
			*	@event detached
			**/
			detached: 'com:spinal:ui:view:detached'
		}

	}));

	return View;

});
