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
		*	Table Header Container
		*	@public
		*	@property header
		*	@type com.spinal.ui.Container
		**/
		header: null,

		/**
		*	Table Footer Container
		*	@public
		*	@property footer
		*	@type com.spinal.ui.Container
		**/
		footer: null,

		/**
		*	Table's default header columns
		*	@private
		*	@property _header
		*	@type Array
		**/
		_thead: null,

		/**
		*	Table's default body rows
		*	@private
		*	@property _body
		*	@type Array
		**/
		_tbody: null,

		/**
		*	Table's default footer rows
		*	@private
		*	@property _footer
		*	@type Array
		**/
		_tfoot: null,

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
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'thead', 'tbody', 'tfoot')));
			UITable.__super__.initialize.apply(this, arguments);
			return this._head()._body()._foot();
		},

		/**
		*	Creates a Table section template by type
		*	@private
		*	@method _create
		*	@param type {String} Table section type
		*	@return String
		**/
		_create: function(type) {
			return Spinal.app.html_tpl('spinal.table.t', { _$: { t: type, cls: ('ui-table-' + type) } });
		},

		/**
		*	Table's head template section
		*	@private
		*	@chainable
		*	@method _head
		*	@return {com.spinal.ui.table.Table}
		**/
		_head: function() {
			if(!this._thead || this._thead.length === 0) return '';
			var head = this.add({ t: UITable.SECTIONS.head, interface: TableElement }, { silent: true });
			return this._content(this._thead, head, TableElement.TYPES.head, '_col');
		},

		/**
		*	Table's body template section
		*	@private
		*	@chainable
		*	@method _body
		*	@return {com.spinal.ui.table.Table}
		**/
		_body: function() {
			if(!this._tbody || this._tbody.length === 0) return '';
			var body = this.add({ t: UITable.SECTIONS.body, interface: TableElement }, { silent: true });
			return this._content(this._tbody, body, TableElement.TYPES.row, '_col');
		},

		/**
		*	Table's footer template section
		*	@private
		*	@chainable
		*	@method _foot
		*	@return {com.spinal.ui.table.Table}
		**/
		_foot: function() {
			if(!this._tfoot || this._tfoot.length === 0) return '';
			var foot = this.add({ t: UITable.SECTIONS.foot, interface: TableElement }, { silent: true });
			return this._content(this._tfoot, foot, TableElement.TYPES.row, '_col');
		},

		/**
		*	Insert Table items into the table section
		*	@private
		*	@method _content
		*	@param items {Array} items collection
		*	@param parent {Object} parent container reference
		*	@param type {String} Row's type to be inserted in the column
		*	@param action {String} iteratee method name
		*	@reutrn {com.spinal.ui.table.Table}
		**/
		_content: function(items, parent, type, action) {
			_.each(items, _.bind(this[action], this, type, parent, { silent: true }));
			return this;
		},

		/**
		*	Creates, attaches and setup a new column into the view list.
		*	@private
		*	@method _col
		*	@param type {String} row type
		*	@param parent {Object} parent container reference
		*	@param opts {Object} view element options
		*	@param col {Object} column object
		*	@return {com.spinal.ui.table.Table}
		**/
		_col: function(type, parent, opts, col) {
			var d = _.omit(col, 'rows', 'el', 't'), tpl = this._create(TableElement.TYPES.column);
			var tr = parent.add(_.extend({ el: $(tpl), interface: TableElement }, this.onColumn(d)), opts);
			this._content(col.rows, tr, type, '_row');
		},

		/**
		*	Creates, attaches and setup a new row into the view list.
		*	@private
		*	@method _row
		*	@param type {String} row type
		*	@param parent {Object} parent container reference
		*	@param opts {Object} view element options
		*	@param row {Object} row object
		*	@return {com.spinal.ui.table.Table}
		**/
		_row: function(type, parent, opts, row) {;
			var tpl = this._create(type);
			parent.add(_.extend({ el: $(tpl), interface: TableElement }, this.onRow(row)), opts);
		},

		/**
		*	Default Table Column Render Handler
		*	@public
		*	@method onColumn
		*	@param column {Object} column content
		*	@return Object
		**/
		onColumn: function(column) { return column; },

		/**
		*	Default Table Row Render Handler
		*	@public
		*	@method onRow
		*	@param row {Object} row content
		*	@return Object
		**/
		onRow: function(row) { return { template: row }; }

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Table',

		/**
		*	Table sections types
		*	@static
		*	@property SECTIONS
		*	@type Object
		**/
		SECTIONS: {
			head: 'thead',
			body: 'tbody',
			foot: 'tfoot'
		}

	}));

	return UITable;

});
