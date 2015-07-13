/**
*	@module com.spinal.ui.misc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
*	@Notes: Still need to implement:
*		- Improve selection and keyboard navigation in the result list.
*		- Set the value selected from the list to the input (by clicking or pressing 'enter').
**/
define(['ui/container',
	'ui/form/controls/input',
	'ui/list/list',
	'ui/list/list-item',
	'ui/basic/link',
	'ui/basic/span',
	'util/string'], function(Container, Input, List, ListItem, Link, Span, StringUtil) {

		/**
		*	Autocomplete Class
		*	@namespace com.spinal.ui.misc
		*	@class com.spinal.ui.misc.Autocomplete
		*	@extends com.spinal.ui.Container
		*
		*	@requires com.spinal.ui.Container
		*	@requires com.spinal.ui.form.controls.Input
		*	@requires com.spinal.ui.list.List
		*	@requires com.spinal.ui.list.ListItem
		*	@requires com.spinal.ui.basic.Link
		*	@requires com.spinal.ui.basic.Span
		*	@requires com.spinal.util.StringUtil
		**/
		var UIAutocomplete = Spinal.namespace('com.spinal.ui.misc.Autocomplete', Container.inherit({

			/**
			*	Internal CSS className
			*	@public
			*	@property className
			*	@type String
			**/
			className: 'ui-autocomplete btn-group',

			/**
			*	Default Autocomplete's Type interface
			*	@private
			*	@property _type
			*	@type Function
			**/
			_type: Link,

			/**
			*	Default Autocomplete's minimum term length to fire the matching
			*	@private
			*	@property _minChars
			*	@type Number
			**/
			_minChars: 3,

			/**
			*	Autcomplete's results
			*	@private
			*	@property _results
			*	@type Array
			**/
			_results: [],

			/**
			*	Autocomplete's selection (while navigating)
			*	@public
			*	@property selection
			*	@type Number
			**/
			selection: -1,

			/**
			*	Autocomplete's input text instance reference
			*	@public
			*	@property input
			*	@type {com.spinal.ui.form.controls.Input}
			**/
			input: null,

			/**
			*	Autocomplete's list instance reference
			*	@public
			*	@property list
			*	@type {com.spinal.ui.list.List}
			**/
			list: null,

			/**
			*	Initialize
			*	@public
			*	@method initialize
			*	@param opts {Object} view options
			*	@return {com.spinal.ui.misc.Autocomplete}
			**/
			initialize: function(opts) {
				opts || (opts = {});
				_.extend(this, StringUtil.toPrivate(_.pick(opts, 'type', 'minChars')));
				UIAutocomplete.__super__.initialize.apply(this, arguments);
				var options = { silent: true };
				return this._input(options)._list(options);
			},

			/**
			*	Autocomplete's Input Component setup
			*	@private
			*	@method _input
			*	@param [opts] {Object} extra options
			*	@return {com.spinal.ui.misc.Autocomplete}
			**/
			_input: function(opts) {
				this.input = this.add(new Input({ placeholder: 'Search' }), opts);
				return this;
			},

			/**
			*	Autocomplete's List Component setup
			*	@private
			*	@method _list
			*	@param [opts] {Object} extra options
			*	@return {com.spinal.ui.misc.Autocomplete}
			**/
			_list: function(opts) {
				this.list = this._spanNoResults(opts)
					.add(new List({
						cls: 'dropdown-menu',
						type: this._type,
						transform: this.onItem,
						collection: this.collection
				}), opts);
				return this;
			},

			/**
			*	Autocomplete's No Results Span View extra element.
			*	@private
			*	@method _spanNoResults
			*	@return {com.spinal.ui.misc.Autocomplete}
			**/
			_spanNoResults: function(opts) {
				var span = { views: [this.onEmpty(new Span({ cls: 'text-muted', attrs: { style: 'padding: 10px;' } }))] };
				this.collection.add(span, opts);
				return this;
			},

			/**
			*	Attach events to all the items inside the collection
			*	@public
			*	@method _itemEvents
			*	@return {com.spinal.ui.misc.Autocomplete}
			**/
			_itemEvents: function() {
				this.list.views.each(function(v) {
					v.listenTo(v, ListItem.EVENTS.mousedown, _.bind(this.onSelect, this));
				}, this);
				return this;
			},

			/**
			*	Find a list item by position (0-index based). If not found, returns null.
			*	@private
			*	@method _findItemByPos
			*	@param ix {Number} index
			*	@return {com.spinal.ui.View}
			**/
			_findItemByPos: function(ix) {
				if(!_.defined(this._results[ix])) return null;
				return this.list.findById(this._results[ix].id);
			},

			/**
			*	Handlers Keyboard navigation over the list of results
			*	@private
			*	@method _navigate
			*	@param e {Number} event reference
			*	@return {com.spinal.ui.misc.Autocomplete}
			**/
			_navigate: function(e) {
				var previous = this.selection; prev = this._findItemByPos(previous);
				if(e.which === 38 && this.selection >= 1) this.selection--;
				if(e.which === 40 && this.selection < (this._results.length-1)) this.selection++;
				var current = this._findItemByPos(this.selection);
				if(prev) prev.removeClass('bg-info');
				if(current) current.addClass('bg-info');
				if(e.which === 13) this.onSelect(null, current);
				return this;
			},

			/**
			*	Autocomplete's open handler
			*	@private
			*	@method _onOpen
			*	@param e {Object} event reference
			*	@param view {com.spinal.ui.View} view reference
			**/
			_onOpen: function(e, view) {
				if(view.value().length < this._minChars) return this._onClose();
				this.addClass('open')._search(view.value());
				return ((e.which === 38 || e.which === 40 || e.which === 13) && this._results.length > 0) ?
					this._navigate(e) : this.list.invoke('removeClass', 'bg-info');
			},

			/**
			*	Autocomplete's close handler
			*	@private
			*	@method _onClose
			*	@param e {Object} event reference
			*	@param view {com.spinal.ui.View} view reference
			**/
			_onClose: function(e, view) {
				return this.removeClass('open');
			},

			/**
			*	Autocomplete's search strategy
			*	@private
			*	@method _search
			*	@param value {String} expression to perform a search
			*	@return {com.spinal.ui.View}
			**/
			_search: function(value) {
				var re = new RegExp(StringUtil.escapeRegex(value), "i"), len = (this.collection.size()-1),
					prevlen = this._results.length;
				this._results = this.collection.filter(function(m, ix) {
					var res = this.onSearch(re, m); v = this.list.get(ix)[(res) ? 'show' : 'hide']();
					this.onHighlight(v, res); return res;
				}, this);
				this.list.get(len)[(this._results.length === 0) ? 'show' : 'hide']();
				if(prevlen !== this._results.length) this.selection = -1;
				return this;
			},

			/**
			*	Render View
			*	@public
			*	@chainable
			*	@method render
			*	@param [opts] {Object} additional options
			*	@return {com.spinal.ui.misc.Autcomplete}
			**/
			render: function() {
				UIAutocomplete.__super__.render.apply(this, arguments);
				var evs = [Input.EVENTS.keyup, Input.EVENTS.focus].join(' ');
				this.input.listenTo(this.input, evs, _.bind(this._onOpen, this))
					.listenTo(this.input, Input.EVENTS.blur, _.bind(this._onClose, this));
				return this._itemEvents();
			},

			/**
			*	Retrieves results since last search
			*	@public
			*	@method results
			*	@return Array
			**/
			results: function() {
				return this._results;
			},

			/**
			*	Default Autocomplete searching strategy handler executed per item.
			*	@public
			*	@overridable
			*	@method onSearch
			*	@param re {RegExp} regular expression used to perform a search
			*	@param m {Backbone.Model} collection's model reference
			*	@return Boolean
			**/
			onSearch: function(re, m) {
				return (_.isString(m.get('value')) && re.test(m.get('value')));
			},

			/**
			*	Default Autocomplete highlight strategy handler
			*	This method will be executed on all items inside the collection despite they were matched as a result
			*	or not. The ones they were matched, the flag will be set to true, otherwise false.
			*	(helpful to reset items styled/manipulated previously on those who were not matched).
			*	Default: Not styling is applied.
			*	@public
			*	@overridable
			*	@method onHighlight
			*	@param item {com.spinal.ui.list.ListItem} list item reference
			*	@param matched {Boolean} item reference who was matched by the expression
			*	@return {com.spinal.ui.list.ListItem}
			**/
			onHighlight: function(item, matched) {
				return item;
			},

			/**
			*	Default Autocomplete strategy to show no results
			*	@public
			*	@overridable
			*	@method onEmpty
			*	@param item {Object} No results item reference.
			**/
			onEmpty: function(item) {
				return item.content('<em>No Results</em>');
			},

			/**
			*	Default Autocomplete Select Handler
			*	@public
			*	@method onSelect
			*	@param e {Object} event reference
			*	@param item {com.spinal.ui.list.ListItem} item reference
			**/
			onSelect: function(e, item) {
				if((m = this.collection.findWhere({ id: item.id })))
					this._onClose(null, this.input.value(m.get('value')));
				this.trigger(UIAutocomplete.EVENTS.selected, e, m);
			},

			/**
			*	Default Autocomplete Item Render Handler
			*	@public
			*	@overridable
			*	@method onItem
			*	@param item {Object} item view reference
			*	@return Object
			**/
			onItem: function(item) {
				return _.extend({ attrs: { style: 'cursor: pointer;' } }, item);
			}

		}, {

			/**
			*	@static
			*	@property NAME
			*	@type String
			**/
			NAME: 'UIAutocomplete',

			/**
			*	@static
			*	@property EVENTS
			*	@type Object
			**/
			EVENTS: {
				/**
				*	@event selected
				**/
				selected: 'com:spinal:ui:misc:autcomplete:selected'
			}

		}));

	return UIAutocomplete;

});
