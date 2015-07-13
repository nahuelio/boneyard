/**
*	@module com.spinal.ui.misc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container', 'ui/list/list', 'ui/basic/link', 'util/string'], function(Container, List, Link, StringUtil) {

	/**
	*	Dropdown Class
	*	@namespace com.spinal.ui.misc
	*	@class com.spinal.ui.misc.Dropdown
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	*	@requires com.spinal.ui.list.List
	*	@requires com.spinal.ui.basic.Link
	*	@requires com.spinal.util.StringUtil
	**/
	var UIDropdown = Spinal.namespace('com.spinal.ui.misc.Dropdown', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-dropdown btn-group',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'div',

		/**
		*	Dropdown's default button text
		*	@private
		*	@property _text
		*	@type String
		**/
		_text: 'Default',

		/**
		*	Default Autocomplete's Result Type interface
		*	@private
		*	@property _type
		*	@type Function
		**/
		_type: Link,

		/**
		*	Dropdown caret template
		*	@private
		*	@property _caret
		*	@type String
		**/
		_caret: Spinal.tpl('tag', { _$: { tagName: 'span', cls: 'caret' } }),

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param opts {Object} view options
		*	@return {com.spinal.ui.misc.Dropdown}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			opts.interface = List;
			opts.template = this._setup();
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'text', 'type')));
			UIDropdown.__super__.initialize.apply(this, arguments);
			return this._list({ silent: true });
		},

		/**
		*	Insert List items into the Dropdown
		*	@private
		*	@chainable
		*	@method _list
		*	@param [opts] {Object} extra options
		*	@return {com.spinal.ui.misc.Dropdown}
		**/
		_list: function(opts) {
			this.add({
				className: 'dropdown-menu',
				type: this._type,
				transform: this.onItem,
				collection: this.collection
			}, opts);
			return this;
		},

		/**
		*	Dropdown Template Setup
		*	@private
		*	@method _setup
		*	@return String
		**/
		_setup: function() {
			return Spinal.tpl('tag', { _$: {
				tagName: 'button', cls: 'btn btn-default dropdown-toggle',
				attrs: { 'data-toggle': 'dropdown', 'aria-expanded': false }
			}});
		},

		/**
		*	Render Dropdown
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.misc.Dropdown}
		**/
		render: function(opts) {
			UIDropdown.__super__.render.apply(this, arguments);
			this.text(this._text);
			return this;
		},

		/**
		*	Change the Dropdown button text
		*	@public
		*	@chainable
		*	@method text
		*	@param txt {String} dropdown button text
		*	@return {com.spinal.ui.misc.Dropdown}
		**/
		text: function(txt) {
			if(!_.defined(txt)) return this._text;
			this.$el.children('button.dropdown-toggle').html((this._text = txt) + '&nbsp;&nbsp;' + this._caret);
			return this;
		},

		/**
		*	Default Dropdown Item Render Handler
		*	@public
		*	@overridable
		*	@method onItem
		*	@param item {Object} item view reference
		*	@return Object
		**/
		onItem: function(item) {
			return _.extend(item);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Dropdown'

	}));

	return UIDropdown;

});
