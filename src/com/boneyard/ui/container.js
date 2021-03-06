/**
*	@module com.boneyard.ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/boneyard',
		'ui/view',
		'util/adt/collection',
		'util/exception/ui/ui'], function(Boneyard, View, Collection, UIException) {

	/**
	*	Class Container
	*	@namespace com.boneyard.ui
	*	@class com.boneyard.ui.Container
	*	@extends com.boneyard.ui.View
	*
	*	@requires com.boneyard.core.Boneyard
	*	@requires com.boneyard.ui.View
	*	@requires com.boneyard.util.adt.Collection
	*	@requires com.boneyard.util.exception.ui.UIException
	**/
	var Container = Boneyard.namespace('com.boneyard.ui.Container', View.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-container',

		/**
		*	View Collection
		*	@property views
		*	@type com.boneyard.util.adt.Collection
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
		*	@return com.boneyard.ui.Container
		**/
		initialize: function(options) {
			options || (options = {});
			Container.__super__.initialize.apply(this, arguments);
			this.views = new Collection([], (options.interface) ? { interface: options.interface } : {});
			if(options.views) this.addAll(options.views, { silent: true });
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
			if(attrs.collection && !(attrs.collection instanceof Backbone.Collection))
				throw new UIException('InvalidModelType');
			if(attrs.interface && (!(attrs.interface.prototype instanceof View) &&
				!(attrs.interface.NAME && attrs.interface.NAME === View.NAME)))
				throw new UIException('InvalidInterfaceType');
			return true;
		},

		/**
		*	Chain of responsability strategy that performs a look up from this view
		*	Direction can be change by passing a direction parameter.
		*	This method is capable to perform 2 types of lookups:
		*	- Ancestor "bottom-up" (default)
		*	- Descendant "top-down"
		*	@public
		*	@chainable
		*	@method lookup
		*	@param finder {Function}
		*	@param [direction] {String} direction constant
		*	@return com.boneyard.ui.View
		**/
		_next: function(finder, direction) {
			return (!_.isUndefined(direction) || direction === Container.LOOKUP.descendant) ?
				this.findDeep(finder) : Container.__super__._next.apply(this, arguments);
		},

		/**
		*	Resolves Successor if the container is top-level container
		*	@private
		*	@chainable
		*	@method _resolveSuccesor
		*	@return com.boneyard.ui.View
		**/
		_resolveSuccesor: function() {
			if(!this._parent) {
				var parentEl = (this.$el.parent().length > 0) ? this.$el.parent()[0].nodeName.toLowerCase() : 'body';
				this._parent = new Container({ el: parentEl });
				this._parent.add(this, { silent: true });
			}
			return this;
		},

		/**
		*	Target element in which subviews will be rendered into
		*	@public
		*	@method _targetEl
		*	@param view {com.boneyard.ui.View} current view reference
		*	@param [opts] {Object} options
		*	@return Object
		**/
		_targetEl: function(view, opts) {
			opts || (opts = {});
			return (_.contains([View.RENDER.after, View.RENDER.before], opts.method) &&
				_.defined(opts.target) && _.isString(opts.target)) ? this.$el.children(opts.target) : this.$el;
		},

		/**
		*	Render Container
		*	@public
		*	@chainable
		*	@method render
		*	@return com.boneyard.ui.Container
		**/
		render: function() {
			this._resolveSuccesor();
			Container.__super__.render.apply(this, arguments);
			this.invoke('render');
			return this;
		},

		/**
		*	Update Container
		*	@public
		*	@chainable
		*	@method update
		*	@param model {Backbone.Model} model reference
		*	@param value {Object} either a object or a Backbone.Collection
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.Container
		**/
		update: function(model, value, opts) {
			return Container.__super__.update.apply(this, arguments);
		},

		/**
		*	Add View
		*	@public
		*	@method add
		*	@param view {com.boneyard.ui.View} View instance
		*	@param [opts] {Object} additional options
		*	@return Object
		**/
		add: function(view, opts) {
			opts || (opts = {});
			var exists = (view.id) ? this.findById(view.id) : this.findByCID(view.cid);
			if(!_.defined(exists)) {
				var newView = this.views.add(view);
				newView._parent = this;
				if(opts.renderOnAdd) newView.render(opts);
				if(!opts.silent) this.trigger(Container.EVENTS.add, { added: newView, view: this });
				return newView;
			}
			return view;
		},

		/**
		*	Add a collection of views
		*	@public
		*	@method addAll
		*	@param views {Array} Array of Views
		*	@param [opts] {Object} additional options
		*	@return Array
		**/
		addAll: function(views, opts) {
			opts || (opts = {});
			return _.map(views, function(v) { return this.add(v, opts); }, this);
		},

		/**
		*	Remove View
		*	@public
		*	@chainable
		*	@method remove
		*	@param view {com.boneyard.ui.View} View instance
		*	@param [opts] {Object} additional options
		*	@return com.boneyard.ui.Container
		**/
		remove: function(view, opts) {
			opts || (opts = {});
			var pos = this.getPos(view);
			if(_.defined(pos) && pos !== -1) {
				this.views.remove(pos);
				view._parent = null;
				if(opts.detachOnRemove) view.detach();
				if(!opts.silent) this.trigger(Container.EVENTS.remove, { removed: view, view: this });
			}
			return this;
		},

		/**
		*	Remove the View and all subviews by detaching them from the dom.
		*	@public
		*	@chainable
		*	@method removeAll
		*	@return com.boneyard.ui.Container
		**/
		removeAll: function(opts) {
			opts || (opts = {});
			if(!this.views.isEmpty()) this.invoke('detach', arguments);
			this.views.reset();
			if(!opts.silent) this.trigger(Container.EVENTS.removeAll, { view: this });
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
		*	@param view {com.boneyard.core.Backbone.View} view used to get the index
		*	@return Object
		**/
		getPos: function(view) {
			return this.views.findPosBy(function(ele) { return (ele.cid && ele.cid === view.cid); });
		},

		/**
		*	Performs a lookup by the collection of subview by predicate passed by parameter
		*	@public
		*	@method find
		*	@param finder {Function} predicate function
		*	@return com.boneyard.ui.View
		**/
		find: function(finder) {
			if(!finder || !_.isFunction(finder)) return;
			var found = null;
			for(var i = 0; i < this.views.size(); i++)
				if((found = finder(this.views.get(i), i))) break;
			return found;
		},

		/**
		*	Perform a deep lookup recursively over all container views by predicate passed by parameter.
		*	@IMPROVEMENT: Possible refactor into the Collection class (this.views);
		*	@public
		*	@method findDeep
		*	@param finder {Function} predicate function
		*	@param [found] {Object} found reference
		*	@return com.boneyard.ui.View
		**/
		findDeep: function(finder, found) {
			if(!finder || !_.isFunction(finder) || !_.isUndefined(found)) return;
			for(var i = 0; i < this.views.size(); i++) {
				if(!_.isUndefined(found)) break;
				var subview = this.views.get(i);
				if(finder(subview)) { found = subview; break; }
				if(subview.views && !subview.views.isEmpty()) found = subview.findDeep(finder, found);
			}
			return found;
		},

		/**
		*	Find View by Backbone cid
		*	@public
		*	@method findByCID
		*	@param cid {String} View cid
		*	@return com.boneyard.ui.View
		**/
		findByCID: function(cid) {
			if(!cid) return null;
			return this.views.find(function(v) { return (v.cid && v.cid === cid); });
		},

		/**
		*	Find View by id
		*	@public
		*	@method findById
		*	@param id {String} View id
		*	@return com.boneyard.ui.View
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
		*	@return com.boneyard.ui.View
		**/
		filter: function(finder) {
			return this.views.findBy(finder);
		},

		/**
		*	Invoke a method specified by parameter on every view inside the container's collection
		*	@public
		*	@method invoke
		*	@param methodName {String} Method Name to invoke in every view in the collection
		*	@param [...arguments] {Array} arguments to pass to the method invocation.
		*	@return Array
		**/
		invoke: function(methodName) {
			if(this.views.size() === 0) return [];
			var args = Array.prototype.slice.call(arguments, 1);
			return this.views.invoke(methodName, args);
		},

		/**
		*	Show View
		*	@public
		*	@chainable
		*	@method show
		*	@return com.boneyard.ui.View
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
		*	@return com.boneyard.ui.View
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
		*	@return com.boneyard.ui.View
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
		*	@return com.boneyard.ui.View
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
		*	@return com.boneyard.ui.View
		**/
		detach: function() {
			if(!this.views.isEmpty()) this.invoke('detach', arguments);
			Container.__super__.detach.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Container',

		/**
		*	Lookup strategy directions
		*	@static
		*	@property LOOKUP
		*	@type Object
		**/
		LOOKUP: {
			ancestor: 'ancestor',
			descendant: 'descendant'
		},

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event add
			**/
			add: 'com:boneyard:ui:container:add',
			/**
			*	@event remove
			**/
			remove: 'com:boneyard:ui:container:remove',
			/**
			*	@event removeAll
			**/
			removeAll: 'com:boneyard:ui:container:removeAll'
		}

	}));

	return Container;

});
