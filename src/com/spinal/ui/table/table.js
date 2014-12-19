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
		_header: null,

		/**
		*	Table's default body rows
		*	@private
		*	@property _body
		*	@type Array
		**/
		_body: null,

		/**
		*	Table's default footer rows
		*	@private
		*	@property _footer
		*	@type Array
		**/
		_footer: null,

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
			_.extend(this, StringUtil.toPrivate(_.pick(opts, 'header', 'body', 'footer')));
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
		*	Creates a container over all the table sections suitable for querying
		*	and replaces the original input list with the container instance.
		*	@private
		*	@method _make
		*	@param list {Array} table list section reference
		*	@param trs {Array} table section columns
		*	@param $section {Object} section dom element reference
		**/
		_make: function(name, trs, $section) {
			this[name] = new Container({ el: $section, interface: TableElement });
			this[name].addAll(trs, { renderOnAdd: true, silent: true });
			return this;
		},

		/**
		*	Insert Columns into the table section specified by the parameter type.
		*	@private
		*	@method _cols
		*	@param cols {Array} columns collection
		*	@param $section {Object} table's section reference
		*	@param rowType {Object} Row's type to be inserted in the column
		*	@reutrn Object
		**/
		_cols: function(cols, $section, rowType) {
			var trs = _.map($section.children(), function(col, ix) {
				// if(this._targetEl().length > 0) console.log(this._targetEl().children('tr'));
				return _.extend({
					t: TableElement.TYPES.column, el: $(col),
					interface: TableElement, views: this._rows(cols[ix], rowType)
				}, this.onColumnRender(cols[ix]));
			}, this);
			return trs;
		},

		/**
		*	Insert rows in a new column inside
		*	@private
		*	@chainable
		*	@method _insert
		*	@param tr {Object} column object
		*	@param rowType {Object} Row's type to be inserted in the column
		*	@return {com.spinal.ui.table.Table}
		**/
		_rows: function(tr, rowType) {
			return _.map(tr.rows, function(row) { return this.onRowRender(row, rowType); }, this);
		},

		/**
		*	Creates a Table section template by type and the columns to be written inside the section
		*	@private
		*	@method _create
		*	@param type {String} Table section type
		*	@param trs {Array} column collection
		*	@return String
		**/
		_create: function(type, trs) {
			return Spinal.app.html_tpl('spinal.table.ts', { _$: { type: type, cls: ('ui-table-t' + type), trs: trs } });
		},

		/**
		*	Render Table's head section if defined
		*	@private
		*	@chainable
		*	@method _head
		*	@return {com.spinal.ui.table.Table}
		**/
		_head: function() {
			if(!this._header || this._header.length === 0) return this;
			var $section = $(this._create(UITable.SECTIONS.head, this._header)).prependTo(this.$el);
			var trs = this._cols(this._header, $section, TableElement.TYPES.head);
			return this._make('header', trs, $section);
		},

		/**
		*	Render Table's body section
		*	@public
		*	@chainable
		*	@method body
		*	@return {com.spinal.ui.table.Table}
		**/
		body: function() {
			if(!this._body || this._body.length === 0) return this;
			var section = this._create(UITable.SECTIONS.body, this._body);
			var trs = this._cols(this._body, $(section), TableElement.TYPES.row);
			this.template = _.template(section);
			this.addAll(trs, { silent: true });
			return this;
		},

		/**
		*	Render Table's footer section if defined
		*	@private
		*	@chainable
		*	@method _foot
		*	@return {com.spinal.ui.table.Table}
		**/
		_foot: function() {
			if(!this._footer || this._footer.length === 0) return this;
			var $section = $(this._create(UITable.SECTIONS.foot, this._footer)).appendTo(this.$el);
			var trs = this._cols(this._footer, $section, TableElement.TYPES.row);
			return this._make('footer', trs, $section);
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
			this.body();
			this._resolveSuccesor();
			Container.__super__.render.apply(this, arguments);
			this.invoke('render', arguments);
			return this._head()._foot();
		},

		/**
		*	Default Render Table Column Handler
		*	@public
		*	@method onColumnRender
		*	@return Object
		**/
		onColumnRender: function(column) {
			return _.omit(column, 't', 'el', 'interface', 'rows');
		},

		/**
		*	Default Render Table Row Handler
		*	@public
		*	@method onColumnRender
		*	@return Object
		**/
		onRowRender: function(row, type) {
			return _.extend({ t: type }, (_.isObject(row)) ? _.omit(row, 't') : { content: row });
		},

		/**
		*	Detach View
		*	@public
		*	@chainable
		*	@method detach
		*	@return {com.spinal.ui.tableTable}
		**/
		detach: function() {
			if(this.header && !this.header.views.isEmpty()) this.header.detach();
			if(this.footer && !this.footer.views.isEmpty()) this.footer.detach();
			UITable.__super__.detach.apply(this, arguments);
			return this;
		}

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
			head: 'head',
			body: 'body',
			foot: 'foot'
		}

	}));

	return UITable;

});
