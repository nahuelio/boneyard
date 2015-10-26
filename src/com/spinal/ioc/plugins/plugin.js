/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
	'ioc/engine/engine',
	'util/object',
	'util/string'], function(Spinal, Engine, ObjectUtil, StringUtil) {

	/**
	*	Class IoCPlugin
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.IoCPlugin
	*	@extends com.spinal.core.Spinal.SpinalClass
	*
	*	@requires com.spinal.core.SpinalClass
	*	@requires com.spinal.ioc.engine.Engine
	*	@requires com.spinal.util.ObjectUtil
	*	@requires com.spinal.util.StringUtil
	**/
	var IoCPlugin = Spinal.namespace('com.spinal.ioc.plugins.IoCPlugin', Spinal.SpinalClass.inherit({

		/**
		*	Engine reference
		*	@public
		*	@property _engine
		*	@type com.spinal.ioc.engine.Engine
		**/
		_engine: null,

		/**
		*	Plugin's config
		*	@private
		*	@property _config
		*	@type Object
		**/
		_config: null,

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@param [attrs] {Object} constructor attributes
		*	@return com.spinal.ioc.plugins.IocPlugin
		**/
		initialize: function(attrs) {
			attrs || (attrs = {});
			this.valid(attrs);
			this._engine = attrs.engine;
			this._config = ObjectUtil.search('config.config', attrs);
			this.parse(_.omit(attrs.config, 'config'));
			this.executed = false;
			return IoCPlugin.__super__.initialize.apply(this, arguments);
		},

		/**
		*	Retrieves Engine's reference
		*	@public
		*	@method getEngine
		*	@return com.spinal.ioc.engine.Engine
		**/
		getEngine: function() {
			return this._engine;
		},

		/**
		*	Retrieves Plugin's configuration
		*	@public
		*	@method getConfig
		*	@return Object
		**/
		getConfig: function() {
			return this._config;
		},

		/**
		*	Retrieves Engine's Factory reference
		*	@public
		*	@method getFactory
		*	@return com.spinal.util.factories.AsyncFactory
		**/
		getFactory: function() {
			return this.getEngine().getFactory();
		},

		/**
		*	Validates constructor parameters
		*	@public
		*	@throws Error
		*	@method valid
		*	@param attrs {Object} constructor attributes
		*	@return Boolean
		**/
		valid: function(attrs) {
			if(!attrs.engine || !(attrs.engine instanceof Engine))
				throw new Error('IoCPlugin requires an instance of a com.spinal.ioc.engine.Engine in order to work.');
			return true;
		},

		/**
		*	Resolve Theme URI
		*	@public
		*	@method resolveURI
		*	@param path {Object} theme path
		*	@return String
		**/
		resolveURI: function(path) {
			var paths = _.compact(this.getConfig().basePath.split('/').concat(path.split('/'))).join('/');
			if(paths.indexOf('!') !== -1) {
				paths = paths.split('!');
				return paths[0] + '!' + requirejs.toUrl(paths[1]);
			}
			return requirejs.toUrl(paths);
		},

		/**
		*	Default metadata parse Strategy
		*	@public
		*	@method parse
		*	@param attrs {Object} plugin attributes
		*	@return com.spinal.ioc.plugins.IoCPlugin
		**/
		parse: function(attrs) {
			return this;
		},

		/**
		*	Default Plugin execution
		*	@public
		*	@method run
		*	@return com.spinal.ioc.plugins.IoCPlugin
		**/
		run: function() {
			return this;
		},

		/**
		*	Exposes a given list of methods to the Spinal core by this plugin
		*	@public
		*	@method proxifyToCore
		*	@param [...methods] {arguments} list of methods to bind
		*	@return com.spinal.ioc.plugins.IoCPlugin
		**/
		proxifyToCore: function() {
			var args = _.toArray(arguments);
			args.unshift(Spinal);
			return this.proxify.apply(this, args);
		},

		/**
		*	Default Plugin complete handler will fire an event to notify Engine to continue his execution
		*	@public
		*	@method done
		*	@return com.spinal.ioc.plugins.plugin
		**/
		done: function() {
			this.executed = true;
			return this.trigger(IoCPlugin.EVENTS.done, this);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'IoCPlugin',

		/**
		*	@static
		*	@property EVENTS
		*	@type Object
		**/
		EVENTS: {
			/**
			*	@event done
			**/
			done: 'com:spinal:ioc:plugins:plugin:done'
		}

	}));

	return IoCPlugin;

});
