/**
*	@module com.spinal.ioc.plugins
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal'], function(Spinal) {

	/**
	*	CSS IoC Plugin
	*	@namespace com.spinal.ioc.plugins
	*	@class com.spinal.ioc.plugins.CSSPlugin
	*	@extends com.spinal.core.Spinal.SpinalClass
	**/
	var CSSPlugin = Spinal.namespace('com.spinal.ioc.plugins.CSSPlugin', Spinal.inherit({

		/**
		*	Initialize
		*	@public
		*	@chainable
		*	@method initialize
		*	@return {com.spinal.ioc.plugins.CSSPlugin}
		**/
		initialize: function() {
			return CSSPlugin.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'CSSPlugin'

	}));

	return CSSPlugin;

});
