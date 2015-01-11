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
	'ui/basic/link',
	'ui/basic/span',
	'util/string'], function(Container, Input, List, Link, Span, StringUtil) {

		/**
		*	Autocomplete Class
		*	@namespace com.spinal.ui.misc
		*	@class com.spinal.ui.misc.Autocomplete
		*	@extends com.spinal.ui.Container
		*
		*	@requires com.spinal.ui.Container
		*	@requires com.spinal.ui.form.controls.Input
		*	@requires com.spinal.ui.list.List
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
			*	Default Autocomplete's Result Type interface
			*	@private
			*	@property _resultType
			*	@type Function
			**/
			_resultType: Link,

			/**
			*	Default Autocomplete's maximum results shown at a time
			*	@private
			*	@property _maxResults
			*	@type Number
			**/
			_maxResults: 5,

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
			_results: null,

			/**
			*	Autocomplete's selection (while navigating)
			*	@public
			*	@property selection
			*	@type Number
			**/
			selection: 0,

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
				this._results = [];
				_.extend(this, StringUtil.toPrivate(_.pick(opts, 'resultType', 'maxResults', 'minChars')));
				UIAutocomplete.__super__.initialize.apply(this, arguments);
				return this._input()._list();
			},

			/**
			*	Autocomplete's Input Component setup
			*	@private
			*	@method _input
			*	@return {com.spinal.ui.misc.Autocomplete}
			**/
			_input: function() {
				this.input = this.add(new Input({ placeholder: 'Search' }));
				this.input.on([Input.EVENTS.keyup, Input.EVENTS.focus, Input.EVENTS.blur].join(' '), this._onOpen, this);
				return this;
			},

			/**
			*	Autocomplete's List Component setup
			*	@private
			*	@method _list
			*	@return {com.spinal.ui.misc.Autocomplete}
			*	@FIXME: style: 'padding: 10px' should be removed and replace it with a different strategy.
			**/
			_list: function() {
				var span = { views: [this.onEmpty(new Span({ cls: 'text-muted', attrs: { style: 'padding: 10px;' } }))] },
					items = _.compact(this.collection.map(this._item, this)); items.push(span);
				this.list = this.add(new List({ cls: 'dropdown-menu', attrs: { role: 'menu' }, items: items }));
				return this;
			},

			/**
			*	Setup List Item Render strategy
			*	@private
			*	@method _item
			*	@return Onject
			**/
			_item: function(model) {
				var d = model.toJSON();
				if(!_.defined(d.id)) return null;
				return _.extend({ id: d.id }, { views: [this.onItem(this._resolve(d))] });
			},

			/**
			*	Resolve List Item data structure format
			*	@private
			*	@method _resolve
			*	@param d {Object} list item data structure
			*	@return Object
			**/
			_resolve: function(d) {
				if(!_.defined(d.value)) return {};
				return new this._resultType(_.defined(d.content) ? d.content : { content: d.value });
			},

			/**
			*	Find a list item by position (0-index based)
			*	@private
			*	@method _findItemByPos
			*	@param ix {Number} index
			*	@return {com.spinal.ui.View}
			**/
			_findItemByPos: function(ix) {
				return this.list.findById(this._results[ix].id);
			},

			/**
			*	Handlers Keyboard navigation over the list of results
			*	@private
			*	@method _navigate
			*	@param keycode {Number} keycode integer
			**/
			_navigate: function(keycode) {
				var previous = this.selection;
				if(keycode === 38 && this.selection >= 1) this.selection--;
				if(keycode === 40 && this.selection < (this._results.length-1)) this.selection++;
				if(this.selection !== previous) {
					this._findItemByPos((previous !== -1) ? previous : 0).removeClass('bg-info');
					this._findItemByPos(this.selection).addClass('bg-info');
				} else if(this._results.length === 1) {
					this._findItemByPos(this.selection).addClass('bg-info');
				}
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
				if(e.type === 'blur' || (view.value().length < this._minChars)) return this.removeClass('open');
				if(this._results.length === 0) this.selection = -1;
				this.addClass('open')._search(view.value());
				return (e.which === 38 || e.which === 40 && this._results.length > 0) ?
					this._navigate(e.which) : this.list.invoke('removeClass', 'bg-info');
			},

			/**
			*	Autocomplete's search strategy
			*	@private
			*	@method _search
			*	@param value {String} expression to perform a search
			*	@return {com.spinal.ui.View}
			**/
			_search: function(value) {
				var re = new RegExp(StringUtil.escapeRegex(value), "i"), len = this.collection.size();
				this._results = this.collection.filter(function(m, ix) {
					var res = this.onSearch(re, m); v = this.list.get(ix)[(res) ? 'show' : 'hide']();
					this.onHighlight(v, res); return res;
				}, this);
				this.list.get(len)[(this.results().length === 0) ? 'show' : 'hide']();
				return this;
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
			*	@param item {com.spinal.ui.basic.Span} No results item reference.
			**/
			onEmpty: function(item) {
				return item.content('<em>No Results</em>');
			},

			/**
			*	Default Autocomplete Item Render Handler
			*	@public
			*	@overridable
			*	@method onItem
			*	@param item {com.spinal.ui.View} item view reference
			*	@return Object
			**/
			onItem: function(item) {
				return item;
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
