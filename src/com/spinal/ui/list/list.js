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
	**/
	var UIList = Spinal.namespace('com.spinal.ui.list.List', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-list list-group',

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
		*	@param options {Object} view options
		*	@return {com.spinal.ui.list.List}
		**/
		initialize: function(options) {
			options || (options = {});
			options.interface = ListItem;
			if(options.items && options.items.length > 0) { options.views = options.items; delete options.items; }
			UIList.__super__.initialize.apply(this, arguments);
			return this;
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
