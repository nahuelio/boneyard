/**
*	@module com/spinal/ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'ui/view',
		'util/adt/collection',
		'util/error/types/ui-exception'], function(Spinal, View, Collection, UIException) {

	/**
	*	Define a generic container interface to add/remove views
	*	@namespace com.spinal.ui
	*	@class com.spinal.ui.Container
	*	@extends com.spinal.ui.View
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
		*	@constructor
		*	@example
		*		<b>Examples</b>
		*		var example = new Container();
		*		var example = new Container({ el: 'body' });
		*		var example = new Container({ id: 'main', el: 'div.main' });
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
			if(Container.__super__._valid.apply(this, arguments)) {
				if(attrs.interface && !(new attrs.interface() instanceof Backbone.View))
					throw new UIException('InvalidInterfaceType');
			}
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
		*	@FIXME: Enhancement: Improve method _.invoke in Collection class (less error prone if method is not found.)
		*	this.removeAll should be triggered if a container is inside another container.
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
			return this.views.findPos(function(ele) { return (ele.id && ele.id === view.id); });
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
				var parentEl = (this.$el.parent().length > 0) ?
					this.$el.parent()[0].nodeName.toLowerCase() : 'body';
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
		*	Invoke a method specified by parameter on every the view inside the collection.
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
