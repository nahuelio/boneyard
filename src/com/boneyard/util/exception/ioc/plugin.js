/**
*	@module com.boneyard.util.exception.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/exception/exception'], function(BoneyardException) {

	/**
	*	Class PluginException
	*	@namespace com.boneyard.util.exception.ioc
	*	@class com.boneyard.util.exception.ioc.PluginException
	*	@extends com.boneyard.util.exception.BoneyardException
	*
	*	@requires com.boneyard.util.exception.BoneyardException
	**/
	var PluginException = Boneyard.namespace('com.boneyard.util.exception.ioc.PluginException',
		BoneyardException.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.boneyard.util.exception.ioc.PluginException
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
		*		Generic (inherited from com.boneyard.util.exception.BoneyardException)
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
