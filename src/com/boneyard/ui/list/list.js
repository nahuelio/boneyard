/**
*	@module com.boneyard.ui.list
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container',
		'ui/list/list-item',
		'ui/basic/link',
		'util/string'], function(Container, ListItem, Link, StringUtil) {

	/**
	*	Class List
	*	@namespace com.boneyard.ui.list
	*	@class com.boneyard.ui.list.List
	*	@extends com.boneyard.ui.Container
	*
	*	@requires com.boneyard.ui.Container
	*	@requires com.boneyard.ui.list.ListItem
	*	@requires com.boneyard.ui.basic.Link
	*	@requires com.boneyard.util.StringUtil
	**/
	var UIList = Boneyard.namespace('com.boneyard.ui.list.List', Container.inherit({

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
		*	Default Autocomplete's Result Type interface
		*	@private
		*	@property _type
		*	@type Function
		**/
		_type: Link,

		/**
		*	Default Custom Item Transformation Predicate
		*	@private
		*	@property _transform
		*	@type Function
		**/
		_transform: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param opts {Object} view options
		*	@return com.boneyard.ui.list.List
		**/
		initialize: function(opts) {
			opts || (opts = {});
			opts.interface = ListItem;
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'type', 'transform')));
			UIList.__super__.initialize.apply(this, arguments);
			return this._list({ silent: true });
		},

		/**
		*	Insert List items into the list
		*	@private
		*	@chainable
		*	@method _list
		*	@param [opts] {Object} extra options
		*	@return com.boneyard.ui.list.List
		**/
		_list: function(opts) {
			this.collection.each(function(item) {
				var it = item.toJSON(), listItem = _.omit(it, 'content', 'views', 'el', 'interface');
				var views = _.defined(it.views) ? it.views : [this.onListItem(_.pick(it, 'id', 'content'))];
				this.add(_.extend(listItem, { views: views }, opts));
			}, this);
			return this;
		},

		/**
		*	Default List Item Render Handler
		*	@public
		*	@method onListItem
		*	@param it {Object} item content
		*	@return Object
		**/
		onListItem: function(it) {
			it || (it = {});
			if(_.defined(this._transform)) { it = this._transform(it); }
			return new this._type(_.isObject(it.content) ? it.content : it);
		}

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
