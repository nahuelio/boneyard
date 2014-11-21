/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.0.1
**/
define(['ioc/engine',
		'util/adt/collection'], function(Engine, Collection) {

	/**
	*	Theme IoC Plugin
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.ThemePlugin
	*	@extends com.spinal.core.Spinal.SpinalClass
	*
	*	@requires com.spinal.ioc.Engine
	*	@requires com.spinal.util.adt.Collection
	**/
	var ThemePlugin = Spinal.namespace('com.spinal.ioc.plugins.ThemePlugin', Spinal.SpinalClass.inherit({

		/**
		*	Skins
		*	@public
		*	@property themes
		*	@type Object
		**/
		themes: null,

		/**
		*	Engine reference
		*	@public
		*	@property _engine
		*	@type {com.spinal.ioc.Engine}
		**/
		_engine: null,

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
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		initialize: function(themes, engine) {
			this.themes = themes;
			this._engine = engine;
			this._$header = $('head');
			return this;
		},

		/**
		*	Find a theme by name passed by parameter, it the theme is not found the function returns null.
		*	@public
		*	@method findTheme
		*	@param themeName {String} theme name
		*	@return Object
		**/
		findTheme: function(themeName) {
			var config = _.find(this.themes, function(theme, name) {
				return ((!themeName && theme.default && (themeName = name)) || (themeName === name));
			});
			return { name: themeName, config: config };
		},

		/**
		*	Process Plugin implementation
		*	@public
		*	@method process
		*	@param themeName {String} Theme name
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		process: function() {
			var theme = this.theme_current();
			var $existing = this._$header.children('link[theme!="'+ theme.name +'"]');
			if($existing.length > 0) $existing.remove();
			this._$header.append(this._domLink({ theme: theme.name, href: theme.config.path }));
			return this;
		},

		/**
		*	Retrieves the current theme
		*	@public
		*	@method current
		*	@return Object
		**/
		theme_current: function() {
			return this.theme;
		},

		/**
		*	Delegated Method to the context via engine to be able to change the current theme
		*	@public
		*	@chainable
		*	@method changeTheme
		*	@param [themeName] {String} theme name
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		theme_change: function(themeName) {
			this.theme = this.findTheme(themeName);
			return this.process();
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
				this.theme_change();
				this._engine.trigger(Engine.EVENTS.proxified, this, 'theme_change', 'theme_current');
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
