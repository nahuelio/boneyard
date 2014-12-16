/**
*	@module com.spinal.ui.table
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container',
	'ui/table/table-element',
	'util/string'], function(Container, TableElement, StringUtil) {

	/**
	*	Table Class
	*	@namespace com.spinal.ui.table
	*	@class com.spinal.ui.table.Table
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	**/
	var UITable = Spinal.namespace('com.spinal.ui.table.Table', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-table table',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'table',

		/**
		*	Table's default columns
		*	@private
		*	@property _columns
		*	@type Array
		**/
		_columns: null,

		/**
		*	Table's default footer rows
		*	@private
		*	@property _footer
		*	@type Array
		**/
		_footer: null,

		/**
		*	Table Head HTML
		*	@private
		*	@property _thead
		*	@type String
		**/
		_thead: Spinal.app.html_tpl('spinal.table.thead', { _$: { cls: 'ui-table-thead' } }),

		/**
		*	Table Head HTML
		*	@private
		*	@property _thead
		*	@type String
		**/
		template: Spinal.app.html_tpl('spinal.table.tbody', { _$: { cls: 'ui-table-tbody' } }),

		/**
		*	Table Footer HTML
		*	@private
		*	@property _tfoot
		*	@type String
		**/
		_tfoot: Spinal.app.html_tpl('spinal.table.tfoot', { _$: { cls: 'ui-table-tfoot' } }),

		/**
		*	Table's column constant
		*	@private
		*	@property _column
		*	@type String
		**/
		_column: Spinal.app.html_tpl('spinal.table.t', { _$: { t: 'r' } }),

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param opts {Object} view options
		*	@return {com.spinal.ui.table.Table}
		**/
		initialize: function(opts) {
			opts || (opts = {});
			opts.interface = TableElement;
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'columns', 'footer')));
			if(opts.rows && opts.rows.length > 0) { opts.views = opts.rows; delete opts.rows; }
			return UITable.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Target element in which subviews will be rendered into
		*	@public
		*	@method _targetEl
		*	@return Object
		**/
		_targetEl: function() {
			return this.$el.children('tbody');
		},

		/**
		*	Render Table
		*	@public
		*	@chainable
		*	@method render
		*	@param [opts] {Object} additional options
		*	@return {com.spinal.ui.table.Table}
		**/
		render: function(opts) {
			// TODO: Special Theatment for rows, columns and footer.
			UITable.__super__.render.apply(this, arguments);
			return this._head()._body()._foot();
		},

		/**
		*	Render Thead if defined
		*	@private
		*	@chainable
		*	@method _head
		*	@return {com.spinal.ui.table.Table}
		**/
		_head: function() {
			if(!this._columns || this._columns.length === 0) return this;
			var $head = $(_.template(this._thead)()).prependTo(this.$el);
			delete $head;
			return this;
		},

		/**
		*	Render body
		*	@private
		*	@chainable
		*	@method _body
		*	@return {com.spinal.ui.table.Table}
		**/
		_body: function() {
			// TODO: Only Attributes to the body
			return this;
		},

		/**
		*	Render Tfoot if defined
		*	@private
		*	@chainable
		*	@method _foot
		*	@return {com.spinal.ui.table.Table}
		**/
		_foot: function() {
			if(!this._footer || this._footer.length === 0) return this;
			var $footer = $(_.template(this._tfoot)()).appendTo(this.$el);
			delete $footer;
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Table'

	}));

	return UITable;

});
