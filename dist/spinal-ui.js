//	SpinalJS Ui@0.0.1 (c) 2014 Patricio Ferreira <3dimentionar@gmail.com>, 3dimention.com
//	SpinalJS may be freely distributed under the MIT license.
//	For all details and documentation: http://3dimention.github.io/spinal
/**
*	@module com.spinal.ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('ui/view',['core/spinal',
		'util/string',
		'util/exception/ui',
		'templates/spinal',
		'libs/bootstrap'], function(Spinal, StringUtils, UIException) {

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
		id: StringUtils.uuid(),

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
		className: 'com-spinal-ui-view',

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
		*	Constructor
		*	@method constructor
		*	@param [options] {Object} View Options
		**/
		constructor: function(options) {
			Backbone.View.apply(this, arguments);
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
			if(options.id) this.id = options.id;
			if(options.method) this.method = options.method;
			if(options.el) this.$el.addClass(this.className);
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
			if(!this._successor.findById(this.id)) throw new UIException('UIStackViolation', {
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
			this._successor.$el[m](this.$el.append(this.template(data)));
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
			if(this.id === id) return this;
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

/**
*	@module com.spinal.ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('ui/container',['core/spinal',
		'ui/view',
		'util/adt/collection',
		'util/exception/ui'], function(Spinal, View, Collection, UIException) {

	/**
	*	Define a generic container interface to add/remove views
	*	@namespace com.spinal.ui
	*	@class com.spinal.ui.Container
	*	@extends com.spinal.ui.View
	*
	*	@requires com.spinal.core.Spinal
	*	@requires com.spinal.ui.View
	*	@requires com.spinal.util.adt.Collection
	*	@requires com.spinal.util.exception.UIException
	**/
	var Container = Spinal.namespace('com.spinal.ui.Container', View.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'com-spinal-ui-container',

		/**
		*	View Collection
		*	@property views
		*	@type {com.spinal.util.adt.Collection}
		**/
		views: null,

		/**
		*	Constructor
		*	@method constructor
		*	@example
		*		<b>Examples</b>
		*		var example = new Container();
		*		var example = new Container({ el: 'div.main' });
		*		var example = new Container({ id: 'main', el: 'div.main', interface: View });
		*
		**/
		constructor: function() {
			View.apply(this, arguments);
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param [options] {Object} Optional Parameters
		*	@return {com.spinal.ui.Container}
		**/
		initialize: function(options) {
			options || (options = {});
			Container.__super__.initialize.apply(this, arguments);
			this.views = new Collection([], (options.interface) ? { interface: options.interface } : {});
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
			Container.__super__._valid.apply(this, arguments);
			if(attrs.interface && !(new attrs.interface() instanceof Backbone.View))
				throw new UIException('InvalidInterfaceType');
			return true;
		},

		/**
		*	Add View
		*	@public
		*	@method add
		*	@param view {com.spinal.ui.View} View instance
		*	@param [opts] {Object} additional options
		*	@return Object
		**/
		add: function(view, opts) {
			opts || (opts = {});
			if(!this.findById(view.id)) {
				view = this.views.add(view);
				view._successor = this;
				if(opts.renderOnAdd) view.render(opts);
				if(!opts.silent) this.trigger(Container.EVENTS.added, { added: view, view: this });
			}
			return view;
		},

		/**
		*	Remove View
		*	@public
		*	@chainable
		*	@method lookup
		*	@param view {com.spinal.ui.View} View instance
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.Container}
		**/
		remove: function(view, opts) {
			opts || (opts = {});
			var pos = this.getPos(view);
			if(!_.isNull(pos)) {
				this.views.remove(pos);
				view._successor = null;
				if(opts.detachOnRemove) view.detach();
				if(!opts.silent) this.trigger(Container.EVENTS.removed, { removed: view, view: this });
			}
			return this;
		},

		/**
		*	Remove the View and all subviews by detaching them from the dom.
		*	@public
		*	@chainable
		*	@method removeAll
		*	@return {com.spinal.ui.Container}
		**/
		removeAll: function() {
			if(!this.views.isEmpty()) this.invoke('detach', arguments);
			this.views.reset();
			return this;
		},

		/**
		*	Returns a view in the index specified as parameter. If it's not found, returns null.
		*	@public
		*	@method get
		*	@param ix {Number} index
		*	@return Object
		**/
		get: function(ix) {
			return this.views.get(ix);
		},

		/**
		*	Returns the index of the view specified as parameter inside the collection
		*	@public
		*	@method getPos
		*	@param view {com.spinal.core.Backbone.View} view used to get the index
		*	@return Object
		**/
		getPos: function(view) {
			return this.views.findPosBy(function(ele) { return (ele.id && ele.id === view.id); });
		},

		/**
		*	Render Container
		*	@public
		*	@chainable
		*	@method render
		*	@return {com.spinal.ui.Container}
		**/
		render: function() {
			if(!this._successor) {
				var parentEl = (this.$el.parent().length > 0) ? this.$el.parent()[0].nodeName.toLowerCase() : 'body';
				this._successor = new Container({ el: parentEl });
				this._successor.add(this, { silent: true });
			}
			Container.__super__.render.apply(this, arguments);
			this.invoke('render', arguments);
			return this;
		},

		/**
		*	Update Container
		*	@public
		*	@chainable
		*	@method update
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.Container}
		**/
		update: function(opts) {
			opts || (opts = {});
			Container.__super__.update.apply(this, arguments);
			this.invoke('update', arguments);
			return this;
		},

		/**
		*	Find View by id
		*	@public
		*	@method findById
		*	@param id {String} View id
		*	@return {com.spinal.ui.View}
		**/
		findById: function(id) {
			if(!id) return null;
			return this.views.find(function(v) { return (v.id && v.id === id); });
		},

		/**
		*	Filter Views by evaluation defined in finder.
		*	@public
		*	@method filter
		*	@param id {String} View id
		*	@return {com.spinal.ui.View}
		**/
		filter: function(finder) {
			return this.views.findBy(finder);
		},

		/**
		*	Invoke a method specified by parameter on every view inside the container's collection
		*	@public
		*	@method invoke
		*	@param methodName {String} Method Name to invoke in every view in the collection
		*	@param [*arguments] {Array} arguments to pass to the method invocation.
		*	@return Array
		**/
		invoke: function(methodName) {
			var args = Array.prototype.slice.call(arguments, 1);
			return this.views.invoke(methodName, args);
		},

		/**
		*	Show View
		*	@public
		*	@chainable
		*	@method show
		*	@return {com.spinal.ui.View}
		**/
		show: function() {
			Container.__super__.show.apply(this, arguments);
			this.invoke('show', arguments);
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
			Container.__super__.hide.apply(this, arguments);
			this.invoke('hide', arguments);
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
			Container.__super__.enable.apply(this, arguments);
			this.invoke('enable', arguments);
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
			Container.__super__.disable.apply(this, arguments);
			this.invoke('disable', arguments);
			return this;
		},

		/**
		*	Detach View
		*	@public
		*	@chainable
		*	@method detach
		*	@return {com.spinal.ui.View}
		**/
		detach: function() {
			if(!this.views.isEmpty()) this.invoke('detach', arguments);
			Container.__super__.detach.apply(this, arguments);
			return this;
		},

		/**
		*	String representation of an instance of this class
		*	@public
		*	@method toString
		*	@return String
		**/
		toString: function() {
			return '[object Container]';
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Container',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event added
			**/
			added: 'com:spinal:ui:container:added',
			/**
			*	@event removed
			**/
			removed: 'com:spinal:ui:container:removed'
		}

	}));

	return Container;

});

/**
*	SpinalJS | UI Module Package
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define('spinal-ui',['ui/view',
		'ui/container'], function() { });

