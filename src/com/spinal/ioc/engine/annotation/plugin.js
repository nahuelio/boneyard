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
		*	Initialize
		*	@public
		*	@method initialize
		*	@param attrs {Object} plugin attributes
		*	@return com.spinal.ioc.engine.annotation.Plugin
		**/
		initialize: function(attrs) {
			return Plugin.__super__.initialize.apply(this, arguments);
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
			return Plugin.__super__.retrieve.call(this, _.defined(ctx) ? ctx : this.getValue());
		},

		/**
		*	Default Plugin Execution strategy
		*	@public
		*	@method run
		*	@return com.spinal.ioc.engine.annotation.Plugin
		**/
		run: function() {
			if(this.isCreated()) this._$created.run();
			return this;
		},

		/**
		*	Checks if this annotation was succesfully created
		*	@static
		*	@method isCreated
		*	@return Boolean
		**/
		isCreated: function() {
			return _.defined(this._$created);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Plugin',

		/**
		*	Plugin base path
		*	@static
		*	@property DefaultPath
		*	@type String
		**/
		DefaultPath: 'ioc/plugins',

		/**
		*	Gather plugins bones from a given spec
		*	@static
		*	@method only
		*	@param spec {Object} spec reference
		*	@return	Object
		**/
		only: function(spec) {
			var out = _.pick(spec, '$plugins');
			return !_.isEmpty(out) ? out.$plugins : out;
		}

	}));

	return Plugin;

});
