/**
*	@module com.boneyard.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@version 0.1.0
**/
define(['ioc/plugins/plugin',
	'util/adt/collection'], function(IoCPlugin, Collection) {

	/**
	*	Class ThemePlugin
	*	@namespace com.boneyard.ioc.plugins
	*	@class com.boneyard.ioc.plugins.ThemePlugin
	*	@extends com.boneyard.ioc.plugins.IoCPlugin
	*
	*	@requires com.boneyard.ioc.plugins.IoCPlugin
	*	@requires com.boneyard.util.adt.Collection
	**/
	var ThemePlugin = Boneyard.namespace('com.boneyard.ioc.plugins.ThemePlugin', IoCPlugin.inherit({

		/**
		*	Themes Collection
		*	@public
		*	@property themes
		*	@type com.boneyard.util.adt.Collection
		**/
		themes: null,

		/**
		*	Current Theme
		*	@public
		*	@property theme
		*	@type Object
		**/
		theme: null,

		/**
		*	Header HTML element
		*	@public
		*	@property $header
		*	@type Object
		**/
		$header: null,

		/**
		*	Boostrap Files
		*	@public
		*	@property bootstrap
		*	@type String
		**/
		bootstrap: {
			core: { name: 'bootstrap-core', path: 'bootstrap/css/bootstrap.min.css' },
			theme: { name: 'bootstrap-theme', path: 'bootstrap/css/bootstrap-theme.min.css' }
		},

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return com.boneyard.ioc.plugins.ThemePlugin
		**/
		initialize: function() {
			this.themes = new Collection();
			this.$header = $('head');
			return ThemePlugin.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Parse Metadata Strategy handler
		*	@public
		*	@override
		*	@chainable
		*	@method parse
		*	@param attrs {Object} plugin attributes
		*	@return com.boneyard.ioc.plugins.ThemePlugin
		**/
		parse: function(attrs) {
			this.themes.set(_.map(attrs, function(t, name) { return _.extend(t, { name: name }); }), { silent: true });
			return ThemePlugin.__super__.parse.apply(this, arguments);
		},

		/**
		*	Retrieves current theme
		*	@public
		*	@method current
		*	@return Object
		**/
		currentTheme: function() {
			return this.theme;
		},

		/**
		*	Applies Bootstrap core and optionally bootstrap default theme if specified in the Plugin's configuration
		*	@public
		*	@chainable
		*	@method useBootstrap
		*	@return com.boneyard.ioc.plugins.ThemePlugin
		**/
		useBootstrap: function() {
			if(this.getConfig().bootstrap) this.applyTheme(this.bootstrap.core);
			if(this.getConfig().bootstrap && this.getConfig().defaultTheme) this.applyTheme(this.bootstrap.theme);
			return this;
		},

		/**
		*	Performs a look up over the themes and applies first theme found with default option to true.
		*	@public
		*	@chainable
		*	@method useDefault
		*	@return com.boneyard.ioc.plugins.ThemePlugin
		**/
		useDefault: function() {
			var theme = this.themes.find(function(theme) { return theme.default; });
			return (theme) ? this.changeTheme(theme.name) : this;
		},

		/**
		*	Validates a given theme to determine if it can be applied
		*	@public
		*	@method validate
		*	@param theme {String} theme name
		*	@return Boolean
		**/
		validate: function(name) {
			if(!_.isString(name)) return false;
			if(!this.getTheme(name)) return false;
			if(this.theme && this.theme.name === name) return false;
			return true;
		},

		/**
		*	Applies theme to the current Context
		*	@public
		*	@chainable
		*	@method applyTheme
		*	@param theme {Object} theme reference
		*	@return
		**/
		applyTheme: function(theme) {
			this.$header.append(ThemePlugin.LINK({ theme: theme.name, href: this.resolveURI(theme.path) }));
			return this;
		},

		/**
		*	Removes current theme applied
		*	@public
		*	@chainable
		*	@method removeTheme
		*	@return com.boneyard.ioc.plugins.ThemePlugin
		**/
		removeTheme: function() {
			this.$header.children('link[theme][theme!="bootstrap-core"][theme!="bootstrap-theme"]').remove();
			return this;
		},

		/**
		*	Retrieves a theme registered in this plugin. If not found it will return null.
		*	@public
		*	@method getTheme
		*	@param name {String} theme name
		*	@return Object
		**/
		getTheme: function(name) {
			return this.themes.find(function(theme) { return (theme.name === name); });
		},

		/**
		*	Resets current theme and applies a given theme.
		*	@public
		*	@chainable
		*	@method changeTheme
		*	@param name {String} theme name
		*	@return com.boneyard.ioc.plugins.ThemePlugin
		**/
		changeTheme: function(name) {
			name || (name = '');
			if(!this.validate(name)) return this;
			this.theme = this.getTheme(name);
			this.removeTheme().applyTheme(this.theme);
			return this;
		},

		/**
		*	Plugin main exection handler
		*	@public
		*	@chainable
		*	@method run
		*	@return com.boneyard.ioc.plugins.ThemePlugin
		**/
		run: function() {
			this.proxifyToCore('changeTheme', 'removeTheme', 'currentTheme').useBootstrap().useDefault();
			return ThemePlugin.__super__.run.apply(this, arguments).done();
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ThemePlugin',

		/**
		*	Link Template
		*	@static
		*	@property LINK
		*	@type Function
		**/
		LINK: _.template('<link rel="stylesheet" href="<%= href %>" theme="<%= theme %>" />')

	}));

	return ThemePlugin;

});
