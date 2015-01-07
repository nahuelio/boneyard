/**
*	@module com.spinal.ui.list
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container',
		'ui/list/list-item'], function(Container, ListItem) {

	/**
	*	List Class
	*	@namespace com.spinal.ui.list
	*	@class com.spinal.ui.list.List
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	*	@requires com.spinal.ui.list.ListItem
	**/
	var UIList = Spinal.namespace('com.spinal.ui.list.List', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-list',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'ul',

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param opts {Object} view options
		*	@return {com.spinal.ui.list.List}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			opts.interface = ListItem;
			UIList.__super__.initialize.apply(this, arguments);
			return this._list(opts.items, { silent: true });
		},

		/**
		*	Insert List items into the list
		*	@private
		*	@chainable
		*	@method _list
		*	@return {com.spinal.ui.list.List}
		**/
		_list: function(items, opts) {
			_.each(items, function(item) { this.add(_.omit(this.onListItem(item), 'el'), opts); }, this);
			return this;
		},

		/**
		*	Default List Item Render Handler
		*	@public
		*	@method onListItem
		*	@param item {Object} item content
		*	@return Object
		**/
		onListItem: function(it) { return it; }

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'List'

	}));

	return UIList;

});
