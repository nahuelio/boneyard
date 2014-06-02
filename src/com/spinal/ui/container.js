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
		views: new Collection(),

		/**
		*	Constructor
		*	@constructor
		**/
		constructor: function() {
			View.apply(this, arguments);
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ui.Container}
		**/
		initialize: function() {
			Container.__super__.initialize.apply(this, arguments);
			return this;
		},

		/**
		*	Add View
		*	@public
		*	@chainable
		*	@method add
		*	@param view {com.spinal.ui.View} View instance
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.Container}
		**/
		add: function(view, opts) {
			opts || (opts = {});
			if(!this.findById(view.id)) {
				this.views.add(view);
				view._successor = this;
				if(opts.renderOnAdd) view.render();
				if(!opts.silent) this.trigger(Container.EVENTS.added, { view: this });
			}
			return this;
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
			if(this.findById(view.id)) {
				this.views.remove(view);
				view._successor = null;
				if(opts.detachOnRemove) view.remove();
				if(!opts.silent) this.trigger(Container.EVENTS.removed, { view: this });
			}
			return this;
		},

		/**
		*	Find Views by evaluation defined in finder.
		*	@public
		*	@method findBy
		*	@param id {String} View id
		*	@return {com.spinal.ui.View}
		**/
		findBy: function(finder) {
			return this.views.findBy(finder);
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
			this.invoke('show', arguments);
			Container.__super__.show.apply(this, arguments);
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
			this.invoke('hide', arguments);
			Container.__super__.hide.apply(this, arguments);
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
			this.invoke('enable', arguments);
			Container.__super__.enable.apply(this, arguments);
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
			this.invoke('disable', arguments);
			Container.__super__.disable.apply(this, arguments);
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
			if(!this.views.isEmpty()) {
				this.invoke('detach', arguments);
				this.views.reset();
			}
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
