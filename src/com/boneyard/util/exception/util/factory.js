/**
*	@module com.boneyard.util.exception.util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/exception/exception'], function(BoneyardException) {

	/**
	*	Factory Exception Type
	*	@namespace com.boneyard.util.exception.util
	*	@class com.boneyard.util.exception.util.FactoryException
	*	@extends com.boneyard.util.exception.BoneyardException
	*
	*	@requires com.boneyard.util.exception.BoneyardException
	**/
	var FactoryException = Boneyard.namespace('com.boneyard.util.exception.util.FactoryException',
		BoneyardException.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.boneyard.util.exception.util.FactoryException
		**/
		initialize: function() {
			return FactoryException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'FactoryException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.boneyard.util.exception.BoneyardException)
		*		UnregisteredFactory
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			UnregisteredFactory: _.template('Factory <%= path %> not found. Unable to use factory method to instanciate class.')
		}

	}));

	return FactoryException;

});
