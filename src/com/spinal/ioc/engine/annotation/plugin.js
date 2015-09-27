/**
*	@module com.spinal.ioc.engine.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ioc/engine/annotation/annotation',
	'util/string'], function(Annotation, StringUtil) {

	/**
	*	Class Plugin
	*	@namespace com.spinal.ioc.engine.annotation
	*	@class com.spinal.ioc.engine.annotation.Plugin
	*	@extends com.spinal.ioc.engine.annotation.Annotation
	*
	*	@requires com.spinal.ioc.engine.annotation.Annotation
	*	@requires com.spinal.util.StringUtil
	**/
	var Plugin = Spinal.namespace('com.spinal.ioc.engine.annotation.Plugin', Annotation.inherit({

		/**
		*	Plugin base path
		*	@public
		*	@property basePath
		*	@type String
		**/
		basePath: 'ioc/plugins',

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.ioc.engine.annotation.Plugin
		**/
		initialize: function() {
			return Plugin.__super__.initialize.call(this, arguments);
		},

		/**
		*	Retrieves Plugin base path
		*	@public
		*	@method getBasePath
		*	@return String
		**/
		getBasePath: function() {
			return this.basePath;
		},

		/**
		*	Dependency gathering on this annotation
		*	This method uses recursion.
		*	@public
		*	@override
		*	@method retrieve
		*	@param [ctx] {Object} context found on nested structure
		*	@return Array
		**/
		retrieve: function(ctx) {
			return Plugin.__super__.retrieve.call(this, _.defined(ctx) ? ctx : this.getParams());
		},

		/**
		*	Extracts plugins from Spec annotation
		*	@public
		*	@method extract
		*	@param plugins {Object} plugins reference
		*	@return Array
		**/
		extract: function(plugins) {
			return _.compact(_.map(plugins, function(plugin, name) {
				return !_.defined(this[name]) ? (this[name] = plugin) : null;
			}));
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Plugin',

		/**
		*	Gather plugins bones from a given spec
		*	@static
		*	@method only
		*	@param spec {Object} spec reference
		*	@return	Array
		**/
		only: function(spec) {
			return _.pick(spec, '$plugins');
		}

	}));

	return Plugin;

});
