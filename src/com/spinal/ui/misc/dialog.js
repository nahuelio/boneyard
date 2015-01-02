/**
*	@module com.spinal.ui.misc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
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
		*	Dialog's default keyboard (Hides on ESC key press)
		*	@private
		*	@property _keyboard
		*	@type Boolean
		**/
		_keyboard: true,

		/**
		*	Dialog's default backdrop (Overlay behind dialog)
		*	@private
		*	@property _backdrop
		*	@type Boolean
		**/
		_backdrop: true,

		/**
		*	Dialog's default close icon
		*	@private
		*	@property _closeIcon
		*	@type Boolean
		**/
		_closeIcon: true,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param opts {Object} view options
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			opts.template = this._setup();
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'title', 'keyboard', 'backdrop', 'closeIcon')));
			UIDialog.__super__.initialize.apply(this, arguments);
			return this._header(opts.header)._footer(opts.footer).addAttr({ role: 'modal', tabindex: "-1" });
		},

		/**
		*	Target element in which subviews will be rendered into
		*	@public
		*	@method _targetEl
		*	@param view {com.spinal.ui.View} current view reference
		*	@return Object
		**/
		_targetEl: function(view) {
			var q = _.contains(['modal-header', 'modal-footer'], view.className) ? '.modal-content' : '.modal-body';
			return this.$el.find(q);
		},

		/**
		*	Dialog Template Setup
		*	@private
		*	@method _setup
		*	@return String
		**/
		_setup: function() {
			return this._create({ cls: 'modal-dialog',
				content: this._create({ cls: 'modal-content', content: this._create({ cls: 'modal-body' }) })
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
		*	Dialog's default header processing
		*	@private
		*	@method _header
		*	@param header {Object} header content
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		_header: function(header) {
			this.add(new Container(_.extend(this.onHeader(header), {
				className: 'modal-header', method: Container.RENDER.prepend,
				template: (this._closeIcon) ? UIDialog.CLOSE : ''
			})), { silent: true });
			return this;
		},

		/**
		*	Dialog's default footer processing
		*	@private
		*	@method _footer
		*	@param footer {Object} footer content
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		_footer: function(footer) {
			this.add(new Container(_.extend(this.onFooter(footer), { className: 'modal-footer' })), { silent: true });
			return this;
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
			// TODO: Continue here...
			/**if((header = this.lookup(function(v) { return (v.className === 'ui-header'); }, UIDialog.LOOKUP.descendant))) {
				//console.log(header);
				//header.content((this._title = title));
			}**/
			return this;
		},

		/**
		*	Dialog's default Header Handler
		*	@public
		*	@method onHeader
		*	@param [header] {Object} header views
		*	@return Object
		**/
		onHeader: function(header) {
			var defaults = { interface: Header };
			defaults.views = (!header) ? [{ heading: 4, content: this._title }] : [header];
			return defaults;
		},

		/**
		*	Dialog's default Footer Handler
		*	@public
		*	@method onFooter
		*	@param [footer] {Object} footer views
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		onFooter: function(footer) {
			var defaults = { interface: Button };
			defaults.views = (footer) ? footer : [{ text: 'Accept', attrs: { 'data-dismiss': 'modal' } }];
			return defaults;
		},

		/**
		*	Show Dialog
		*	@public
		*	@chainable
		*	@method show
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		show: function() {
			this.$el.modal('show');
			if(!opts || !opts.silent) this.trigger(UIDialog.EVENTS.show, { view: this });
			return this;
		},

		/**
		*	Hide Dialog
		*	@public
		*	@chainable
		*	@method hide
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.misc.Dialog}
		**/
		hide: function(opts) {
			this.$el.modal('hide');
			if(!opts || !opts.silent) this.trigger(UIDialog.EVENTS.hide, { view: this });
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Dialog',

		/**
		*	Dialog's Close Button Template
		*	@static
		*	@property CLOSE
		*	@type String
		**/
		CLOSE: Spinal.tpl('tag', { _$: {
			tagName: 'button', cls: 'close',
			content: Spinal.tpl('tag', { _$: { tagName: 'span', content: '&times;' } }),
			attrs: { 'data-dismiss': 'modal' }
		}})

	}));

	return UIDialog;

});
