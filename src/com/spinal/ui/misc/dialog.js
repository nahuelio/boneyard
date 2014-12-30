/**
*	@module com.spinal.ui.misc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container',
		'ui/basic/header',
		'ui/form/controls/button',
		'util/string'], function(Container, Header, Button, StringUtil) {

	/**
	*	Dialog Class
	*	@namespace com.spinal.ui.misc
	*	@class com.spinal.ui.misc.Dialog
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	*	@requires com.spinal.ui.basic.Header
	*	@requires com.spinal.ui.form.controls.Button
	*	@requires com.spinal.util.StringUtil
	**/
	var UIDialog = Spinal.namespace('com.spinal.ui.misc.Dialog', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-dialog modal',

		/**
		*	Dialog's default title
		*	@private
		*	@property _title
		*	@type String
		**/
		_title: 'Default Title',

		/**
		*	Dialog's default close button template
		*	@private
		*	@property _closeTpl
		*	@type String
		**/
		_closeTpl: Spinal.tpl('tag', { _$: {
			tagName: 'button', cls: 'close',
			content: Spinal.tpl('tag', { _$: { tagName: 'span', content: '&times;' } }),
			attrs: { 'data-dismiss': 'modal' }
		} }),

		/**
		*	Dialog's default close button
		*	@private
		*	@property _close
		*	@type Boolean
		**/
		_close: true,

		/**
		*	Dialog's actions
		*	@private
		*	@property _actions
		*	@type Array
		**/
		_actions: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param opts {Object} view options
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'title', 'close', 'actions')));
			opts.template = this._setup();
			UIDialog.__super__.initialize.apply(this, arguments);
			return this.addAttr({ role: 'modal', tabindex: "-1" });
		},

		/**
		*	Dialog Template Setup
		*	@private
		*	@method _setup
		*	@return String
		**/
		_setup: function() {
			return this._create({ cls: 'modal-dialog',
				content: this._create({ cls: 'modal-content',
					content: this._create({ cls: 'modal-header' }) +
						this._create({ cls: 'modal-body' }) +
						this._create({ cls: 'modal-footer' })
					})
				});
		},

		/**
		*	Dialog's template creation
		*	@private
		*	@method _create
		*	@param tagName {String} HTML tag name
		*	@param className {String} CSS class names applied to the element
		*	@param content {String} HTML template content applied to the element
		*	@return String
		**/
		_create: function(tagName, opts) {
			opts || (opts = {});
			if(arguments.length === 1) { opts = tagName; tagName = 'div'; }
			return Spinal.tpl('tag', { _$: _.extend({ tagName: tagName }, opts) });
		},

		/**
		*	Target element in which subviews will be rendered into
		*	@public
		*	@method _targetEl
		*	@return Object
		**/
		_targetEl: function() {
			return this.$el.find('.modal-body');
		},

		/**
		*	Render Dialog
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		render: function(opts) {
			UIDialog.__super__.render.apply(this, arguments);
			this.title(this._title);
			//this.actions(this._actions);
			return this;
		},

		/**
		*	Change the Dialog button title
		*	@public
		*	@chainable
		*	@method text
		*	@param txt {String} dropdown button text
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		title: function(title) {
			if(!StringUtil.defined(title)) return this._title;
			this.$el.find('.modal-header').html(((this._close) ? this._closeTpl : '') + (this._title = title));
			return this;
		},

		/**
		*
		**/
		actions: function(actions) {
			if(!StringUtil.defined(actions)) return this._actions;
			// TODO: implement actions render.
			return this;
		},

		/** WIP: High Level API to be accessed and to be overriden by developers **/

		/**
		*	Adds a new action button
		*	@public
		*	@chainable
		*	@method addAction
		*	@param action {Object} action button config
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		addAction: function() {
			// TODO:
			this.actions(this._actions);
			return this;
		},

		/**
		*	Removes an existing action button
		*	@public
		*	@chainable
		*	@method removeAction
		*	@param action {Object} action button config
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		removeAction: function() {
			// TODO:
			this.actions(this._actions);
			return this;
		},

		/** Specific way to show/hide ?? (Investigate data-dismiss behavior) **/

		show: function() { return UIDialog.__super__.show.apply(this, arguments); },

		hide: function() { return UIDialog.__super__.hide.apply(this, arguments); },

		/** Not able to disable/enable ?? Try to figure out how this should work if we override them ?? **/

		enable: function() { return UIDialog.__super__.enable.apply(this, arguments); },

		disable: function() { return UIDialog.__super__.disable.apply(this, arguments); }

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Dialog',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: { }

	}));

	return UIDialog;

});
