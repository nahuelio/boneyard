/**
*	@module com.spinal.ui.misc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['ui/container',
	'ui/form/controls/input',
	'ui/list/list',
	'ui/basic/paragraph',
	'util/string'], function(Container, Input, List, Paragraph, StringUtil) {

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
			_resultType: Paragraph,

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
			_maxResults: 10,

			/**
			*	Default Autocomplete's minimum term length to fire the matching
			*	@private
			*	@property _minChars
			*	@type Number
			**/
			_minChars: 3,

			/**
			*	Initialize
			*	@public
			*	@method initialize
			*	@param opts {Object} view options
			*	@return {com.spinal.ui.misc.Autocomplete}
			**/
			initialize: function(opts) {
				opts || (opts = {});
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
				this.add(new Input({
					placeholder: 'Search', cls: 'dropdown-toggle',
					attrs: { 'data-toggle': 'dropdown' }
				}));
				return this;
			},

			/**
			*	Autocomplete's List Component setup
			*	@private
			*	@method _list
			*	@return {com.spinal.ui.misc.Autocomplete}
			**/
			_list: function() {
				this.add(new List({ cls: 'dropdown-menu', items: _.compact(this.collection.map(this._item, this)) }));
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
				return _.extend({ id: d.id, interface: this._resultType },
					{ views: [this.onItem(_.defined(d.value) ? d.value : {})] });
			},

			/**
			*	Render Input
			*	@public
			*	@chainable
			*	@method render
			*	@param [opts] {Object} additional options
			*	@return {com.spinal.ui.form.controls.Input}
			**/
			render: function(opts) {
				UIAutocomplete.__super__.render.apply(this, arguments);
				return this;
			},

			/**
			*	Update Autocomplete
			*	@public
			*	@chainable
			*	@method update
			*	@param model {Backbone.Model}
			*	@param value {Object} value that has changed
			*	@param [opts] {Object} additional options
			*	@return {com.spinal.ui.misc.Autocomplete}
			**/
			update: function(model, value, opts) {
				return UIAutocomplete.__super__.update.apply(this, arguments);
			},

			/**
			*	Retrieves results since last search operation
			*	@public
			*	@method results
			*	@return Array
			**/
			results: function() {
				return this.collection;
			},

			/**
			*	Default Autocomplete Item Render Handler
			*	@public
			*	@method onItem
			*	@param item {Object} item content
			*	@return Object
			**/
			onItem: function(it) {
				return _.isString(it) ? { content: it } : it;
			}

		}, {

			/**
			*	@static
			*	@property NAME
			*	@type String
			**/
			NAME: 'UIAutocomplete'

		}));

	return UIAutocomplete;

});
