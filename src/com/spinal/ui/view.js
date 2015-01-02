/**
*	@module com.spinal.ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/string',
		'util/exception/ui',
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
	var View = Spinal.namespace('com.spinal.ui.View', Backbone.View.inherit({

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
		*	Parent Reference
		*	@private
		*	@property _parent
		*	@type {com.spinal.ui.View}
		**/
		_parent: null,

		/**
		*	Theme Class name
		*	@private
		*	@property _theme
		*	@type String
		**/
		_theme: null,

		/**
		*	Internal Compiled template
		*	@private
		*	@property _tpl
		*	@type Function
		**/
		_tpl: null,

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
			if(options.template) this._tpl = this._compile(options.template);
			return (options.attrs) ? this.addAttr(options.attrs) : this;
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
		*	Default Chain of responsability strategy that performs a look up from this view
		*	The default direction is "bottom-up"
		*	@private
		*	@method _next
		*	@param finder {Function} predicate function
		*	@return {com.spinal.ui.View}
		**/
		_next: function(finder) {
			return (this._parent) ? this._parent.lookup(finder) : null;
		},

		/**
		*	Default before render hook
		*	@private
		*	@method _beforeRender
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		_beforeRender: function(opts) {
			if(!this._parent) throw new UIException('SuccessorNotSpecified');
			if(!(this._parent instanceof Spinal.com.spinal.ui.Container)) throw new UIException('InvalidSuccessorType');
			if(this.id && !this._parent.findById(this.id)) throw new UIException('UIStackViolation', {
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
			if(!tpl || (!_.isString(tpl) && !_.isFunction(tpl))) return null;
			return (_.isString(tpl)) ? _.template(tpl) : tpl;
		},

		/**
		*	ListenTo strategy will override default functionality from backbone
		*	to automatically assing the current model as a target, only if parameter obj is omitted and model is defined.
		*	@public
		*	@method listenTo
		*	@param [obj] {Object} object to listen
		*	@param name {String} event name
		*	@param callback {Function} callback function
		*	@return {com.spinal.ui.View}
		**/
		listenTo: function(obj, name, callback) {
			if(arguments.length === 2 && this.model) { callback = name; name = obj; obj = this.model; }
			return View.__super__.listenTo.call(this, obj, name, callback);
		},

		/**
		*	Default strategy to setup data for templating
		*	@public
		*	@method data
		*	@param [o] {Object} default data to pass to the template
		*	@return Object
		**/
		data: function(o) {
			o || (o = {});
			return (this.model) ? this.model.toJSON() :
				((this._parent && this._parent.model) ? this._parent.model.toJSON() : o);
		},

		/**
		*	Default strategy to project model's data onto the template to generates HTML content
		*	@public
		*	@method template
		*	@param [tpl] {String} HTML template
		*	@param [data] {Object} template data
		*	@return String
		**/
		template: function(tpl, data) {
			if(_.isObject(tpl)) { data = tpl; tpl = null; }
			tpl = (tpl) ? this._compile(tpl) : this._tpl;
			return (tpl) ? this.$el.html(tpl(this.data(data))) : this.$el;
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
			var m = (opts.method && (View.RENDER[opts.method])) ? opts.method : this.method;
			this._parent._targetEl(this)[m](this.template(this._tpl));
			if(!opts.silent) this.trigger(View.EVENTS.render, { view: this });
			return this.delegateEvents();
		},

		/**
		*	Update View
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model}
		*	@param value {Object} value that has changed
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.View}
		**/
		update: function(model, value, opts) {
			if(!opts || !opts.silent) this.trigger(View.EVENTS.update, { view: this });
			return this;
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
		*	Perform a look up of a ancestor parent view inside the hierarchery by a predicate function passed as parameter.
		*	If the view is not found, the method will give up returning null (Chain of Responsability).
		*	Default strategy is 'bottom-up'.
		*	@public
		*	@chainable
		*	@method lookup
		*	@param finder {Function} predicate function
		*	@return {com.spinal.ui.View}
		**/
		lookup: function(finder) {
			if(!finder || !_.isFunction(finder)) return null;
			if(finder(this)) return this;
			return this._next.apply(this, arguments);
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
		*	Add new attribute or a group of attributes to the HTML element associated with this View
		*	This method works as a wrapper to call jquery's 'attr' function on the $el reference.
		*	@public
		*	@chainable
		*	@method addAttr
		*	@param key {Object} key name string or object (group of attributes)
		*	@param [value] {Object} value of the attribute of the key passed
		*	@return {com.spinal.ui.View}
		**/
		addAttr: function(key, value) {
			this.$el.attr.apply(this.$el, arguments);
			return this;
		},

		/**
		*	Removes an existing attribute form the HTML element associated with this View
		*	This method works as a wrapper to call jquery's 'removeAttr' function on the $el reference.
		*	@public
		*	@chainable
		*	@method removeAttr
		*	@param key {String} key of the attribute to be removed
		*	@return {com.spinal.ui.View}
		**/
		removeAttr: function(key) {
			this.$el.removeAttr.apply(this.$el, arguments);
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
			if(!opts || !opts.silent) this.trigger(View.EVENTS.show, { view: this });
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
			if(!opts || !opts.silent) this.trigger(View.EVENTS.hide, { view: this });
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
			if(!opts || !opts.silent) this.trigger(View.EVENTS.enable, { view: this });
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
			if(!opts || !opts.silent) this.trigger(View.EVENTS.disable, { view: this });
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
			if(!opts || !opts.silent) this.trigger(View.EVENTS.detach, { view: this });
			return this;
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
			*	@event click
			**/
			click: 'com:spinal:ui:view:click',
			/**
			*	@event show
			**/
			show: 'com:spinal:ui:view:show',
			/**
			*	@event hide
			**/
			hide: 'com:spinal:ui:view:hide',
			/**
			*	@event enable
			**/
			enable: 'com:spinal:ui:view:enable',
			/**
			*	@event disable
			**/
			disable: 'com:spinal:ui:view:disable',
			/**
			*	@event render
			**/
			render: 'com:spinal:ui:view:rendere',
			/**
			*	@event update
			**/
			update: 'com:spinal:ui:view:update',
			/**
			*	@event detach
			**/
			detach: 'com:spinal:ui:view:detach'
		}

	}));

	return View;

});
