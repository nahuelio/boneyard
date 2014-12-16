/**
*	@module com.spinal.ui.list
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container'], function(Container) {

	/**
	*	ListItem Class
	*	@namespace com.spinal.ui.list
	*	@class com.spinal.ui.list.ListItem
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	**/
	var UIListItem = Spinal.namespace('com.spinal.ui.list.ListItem', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-list-item list-group-item',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'li',

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return {com.spinal.ui.list.ListItem}
		**/
		initialize: function(options) {
			options || (options = {});
			UIListItem.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ListItem'

	}));

	return UIListItem;

});
