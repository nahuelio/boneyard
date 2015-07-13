/**
*	@module com.spinal.ui.misc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/container',
	'ui/basic/header',
	'ui/list/list',
	'util/string'], function(Container, Header, List, StringUtil) {

	/**
	*	Affix Class
	*	@namespace com.spinal.ui.misc
	*	@class com.spinal.ui.misc.Affix
	*	@extends com.spinal.ui.Container
	*
	*	@requires com.spinal.ui.Container
	*	@requires com.spinal.ui.list.List
	*	@requires com.spinal.util.StringUtil
	**/
	var UIAffix = Spinal.namespace('com.spinal.ui.misc.Affix', Container.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-affix',

		/**
		*	Tag Name used to build the el
		*	@public
		*	@property tagName
		*	@type String
		**/
		tagName: 'nav',

		/**
		*	Affix Configuration
		*	@private
		*	@property _config
		*	@type Object
		**/
		_config: null,

		/**
		*	Affix Menu reference
		*	@private
		*	@property _list
		*	@type {com.spinal.ui.list.List}
		**/
		_list: null,

		/**
		*	Affix Title
		*	@private
		*	@property _title
		*	@type String
		**/
		_title: null,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param options {Object} view options
		*	@return {com.spinal.ui.misc.Affix}
		**/
		initialize: function(options) {
			options || (options = {});
			_.extend(this, StringUtil.toPrivate(_.pick(options, 'list', 'config', 'title')));
			UIAffix.__super__.initialize.apply(this, arguments);
			this.title().add(this._list);
			this.$el.affix(this._config);
			return this;
		},

		/**
		*	Default Title Handler
		*	@public
		*	@method title
		*	@return {com.spinal.ui.misc.Affix}
		**/
		title: function() {
			if(_.defined(this._title)) this.add(new Header({ content: this._title, heading: '4' }));
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Affix'

	}));

	return UIAffix;

});
