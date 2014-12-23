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
		*	General Settings for Theme management
		*	@public
		*	@property _config
		*	@type Object
		**/
		_config: null,

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
		*	@property _link
		*	@type Function
		**/
		_link: _.template('<link rel="stylesheet" href="<%= href %>" theme="<%= theme %>" />'),

		/**
		*	Boostrap Files
		*	@private
		*	@property _bootstrap
		*	@type String
		**/
		_bootstrap: {
			core: 'bootstrap/css/bootstrap.min.css',
			theme: 'bootstrap/css/bootstrap-theme.min.css'
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param setup {Object} setup
		*	@param engine {com.spinal.ioc.Engine} engine reference
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		initialize: function(setup, engine) {
			if(!setup || !setup.config || !setup.config.basePath) throw new PluginException('ConfigNotSpecified');
			this.themes = _.omit(setup, 'config');
			this._config = setup.config;
			this._engine = engine;
			this._$header = $('head');
			return this._useDefault();
		},

		/**
		*	Check if option to use Default Bootstrap Theme is set to true and will inject the css accordingly
		*	@private
		*	@method _useDefault
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		_useDefault: function() {
			if(this._config.bootstrap) {
				var links = this._link({ theme: 'bootstrap', href: this._resolveURI({ path: this._bootstrap.core }) }) +
					this._link({ theme: 'bootstrap-theme', href: this._resolveURI({ path: this._bootstrap.theme }) });
				this._$header.append(links);
			}
			return this;
		},

		/**
		*	Resolve Theme Path
		*	@private
		*	@method _resolveURI
		*	@param config {Object} theme config reference
		*	@return String
		**/
		_resolveURI: function(config) {
			if(config.url) return config.url;
			return requirejs.toUrl(this._config.basePath + config.path);
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
				return ((!themeName && theme._default && (themeName = name)) || (themeName === name));
			});
			return (config) ? { name: themeName, config: config } : this.currentTheme();
		},

		/**
		*	Process Plugin implementation
		*	@public
		*	@method process
		*	@param themeName {String} Theme name
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		process: function() {
			var theme = this.currentTheme();
			if(!theme) return this;
			this.resetTheme(true);
			this._$header.append(this._link({ theme: theme.name, href: this._resolveURI(theme.config) }));
			return this;
		},

		/**
		*	Delegated Method to Spinal that retrieves the current theme
		*	@public
		*	@method current
		*	@return Object
		**/
		currentTheme: function() {
			return this.theme;
		},

		/**
		*	Delegated Method to Spinal that changes the current theme
		*	@public
		*	@chainable
		*	@method changeTheme
		*	@param [themeName] {String} theme name
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		changeTheme: function(themeName) {
			this.theme = this.findTheme(themeName);
			return this.process();
		},

		/**
		*	Delegated Method to Spinal that resets the current theme.
		*	@public
		*	@chainable
		*	@method resetTheme
		*	@param [removeOnly] {Boolean} clean themes only
		*	@return {com.spinal.ioc.plugins.ThemePlugin}
		**/
		resetTheme: function(removeOnly) {
			var rmvEval = 'link[theme][theme!="bootstrap"][theme!="bootstrap-theme"]';
			var $existing = this._$header.children(rmvEval);
			if($existing.length > 0) $existing.remove();
			if(!removeOnly) this.theme = null;
			return this;
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
				this.changeTheme();
				this.proxify(Spinal, 'changeTheme', 'currentTheme', 'resetTheme');
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
