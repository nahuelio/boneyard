/**
*	@module com.spinal.util.exception.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
	'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	Class PluginException
	*	@namespace com.spinal.util.exception.ioc
	*	@class com.spinal.util.exception.ioc.PluginException
	*	@extends com.spinal.util.exception.Exception
	**/
	var PluginException = Spinal.namespace('com.spinal.util.exception.ioc.PluginException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.util.exception.ioc.PluginException
		**/
		initialize: function() {
			return PluginException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'PluginException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		ConfigNotSpecified
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			ConfigNotSpecified: _.template('Config was not defined')
		}

	}));

	return PluginException;

});
