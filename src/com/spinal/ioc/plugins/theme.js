/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/adt/collection',
		'util/exception/context'], function(Spinal, Collection, ContextException) {

	/**
	*	Theme IoC Plugin
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.ThemePlugin
	*	@extends com.spinal.core.Spinal.SpinalClass
	**/
	var ThemePlugin = Spinal.namespace('com.spinal.ioc.plugins.ThemePlugin', Spinal.SpinalClass.inherit({

		/**
		*	Context Reference
		*	@public
		*	@property ctx
		*	@type {com.spinal.ioc.Context}
		**/
		ctx: null,

		/**
		*	Skins
		*	@public
		*	@property themes
		*	@type Object
		**/
		themes: null,

		/**
		*	Header HTML element
		*	@private
		*	@property _$header
		*	@type Object
		**/
		_$header: null,

		/**
		*	Link Template
		*	@private
		*	@property _domLink
		*	@type Function
		**/
		_domLink: _.template('<link rel="stylesheet" href="{{href}}" theme="{{theme}}" />'),

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param themes {Object} themes
		*	@param ctx {com.spinal.ioc.Context} context reference
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		initialize: function(themes, ctx) {
			themes || (themes = {});
			if(!ctx) throw new ContextException('UndefinedContext');
			this.themes = themes; this.ctx = ctx;
			this._$header = $('head');
			return ThemePlugin.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Process Plugin implementation
		*	@public
		*	@method process
		*	@param themeName {String} Theme name
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		process: function(themeName) {
			if(!this.ctx.theme) return this;
			var $existing = this._$header.children('link[theme!="'+ themeName +'"]');
			if($existing.length > 0) $existing.remove();;
			this._$header.append(this._domLink({ theme: themeName, href: this.ctx.theme.path }));
			return this;
		},

		/**
		*	Delegated Method to the Current Context to change theme
		*	@public
		*	@chainable
		*	@method change
		*	@param [themeName] {String} theme name
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		change: function(themeName) {
			this.ctx.theme = _.find(this.themes, _.bind(function(theme, name) {
				if((!themeName || themeName === '') && theme.default) return (themeName = name);
				return (themeName === name);
			}, this));
			return this.process(themeName);
		},

		/**
		*	Plugin execution
		*	@public
		*	@chainable
		*	@method execute
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		execute: function() {
			if(!_.isEmpty(this.themes)) {
				this.ctx.changeTheme = _.bind(this.change, this);
				return this.ctx.changeTheme();
			}
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ThemePlugin'

	}));

	return ThemePlugin;

});
