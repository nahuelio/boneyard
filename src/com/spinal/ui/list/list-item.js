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
		*	Events
		*	@public
		*	@property events
		*	@type Object
		**/
		events: {
			'click': '_onClick',
			'mousedown': '_onMouseDown',
			'mouseup': '_onMouseUp'
		},

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-list-item',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'li',

		/**
		*	ListItem's Click handler
		*	@private
		*	@method _onClick
		*	@param e {Object} event reference
		**/
		_onClick: function(e) {
			this.trigger(UIListItem.EVENTS.click, e, this);
		},

		/**
		*	ListItem's Mouse Down handler
		*	@private
		*	@method _onMouseDown
		*	@param e {Object} event reference
		**/
		_onMouseDown: function(e) {
			this.trigger(UIListItem.EVENTS.mousedown, e, this);
		},

		/**
		*	ListItem's Mouse Up handler
		*	@private
		*	@method _onMouseUp
		*	@param e {Object} event reference
		**/
		_onMouseUp: function(e) {
			this.trigger(UIListItem.EVENTS.mouseup, e, this);
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
