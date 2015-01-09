/**
*	@module com.spinal.ui.misc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['ui/container',
	'ui/form/controls/input',
	'ui/list/list',
	'ui/basic/link',
	'util/string'], function(Container, Input, List, Link, StringUtil) {

		/**
		*	Autocomplete Class
		*	@namespace com.spinal.ui.misc
		*	@class com.spinal.ui.misc.Autocomplete
		*	@extends com.spinal.ui.Container
		*
		*	@requires com.spinal.ui.Container
		*	@requires com.spinal.ui.form.controls.Input
		*	@requires com.spinal.ui.list.List
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
			*	Default Autocomplete's delay to show results list
			*	@private
			*	@property _delay
			*	@type Number
			**/
			_delay: 0.5,

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
				_.extend(this, StringUtil.toPrivate(_.pick(opts, 'resultType', 'delay', 'maxResults', 'minChars')));
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
			**/
			_list: function() {
				this.list = this.add(new List({
					cls: 'dropdown-menu', attrs: { role: 'menu' },
					items: _.compact(this.collection.map(this._item, this))
				}));
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
				return _.extend({ id: d.id, interface: this._resultType }, { views: [this.onItem(this._resolve(d))] });
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
				return (_.defined(d.content)) ? d.content : { content: d.value };
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
				return this.addClass('open')._search(view.value());
			},

			/**
			*	Autocomplete's search strategy
			*	@private
			*	@method _search
			*	@param value {String} expression to perform a search
			*	@return {com.spinal.ui.View}
			**/
			_search: function(value) {
				var re = new RegExp(StringUtil.escapeRegex(value), "i");
				this._results = this.collection.filter(function(m, ix) {
					var res = this.onSearch(re, m); v = this.list.get(ix)[(res) ? 'show' : 'hide']();
					this.onHighlight(v, res);
					return res;
				}, this);
				(this._results.length === 0) ? this.onEmpty(this.list) : null;
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
			*	Default Autcomplete highlight strategy handler
			*	@public
			*	@overridable
			*	@method onHighlight
			*	@param item {com.spinal.ui.list.ListItem} list item reference
			*	@param matched {Boolean} Flag item matched or filtered out
			**/
			onHighlight: function(item, matched) {
				// TODO: Change this...
				return item[(matched) ? 'addClass' : 'removeClass']('selected');
			},

			/**
			*	Default Autocomplete strategy to show no results
			*	@public
			*	@overridable
			*	@method onEmpty
			*	@param list {com.spinal.ui.list.List} List reference
			**/
			onEmpty: function(list) {
				// TODO: Continue here...
			},

			/**
			*	Default Autocomplete Item Render Handler
			*	@public
			*	@overridable
			*	@method onItem
			*	@param item {Object} item content
			*	@return Object
			**/
			onItem: function(it) {
				return it;
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
				*	@event show_bs_dropdown
				**/
				show_bs_dropdown: 'show.bs.dropdown',
				/**
				*	@event shown_bs_dropdown
				**/
				shown_bs_dropdown: 'shown.bs.dropdown',
				/**
				*	@event hide_bs_dropdown
				**/
				hide_bs_dropdown: 'hide.bs.dropdown',
				/**
				*	@event hidden_bs_dropdown
				**/
				hidden_bs_dropdown: 'hidden.bs.dropdown'
			},

		}));

	return UIAutocomplete;

});
