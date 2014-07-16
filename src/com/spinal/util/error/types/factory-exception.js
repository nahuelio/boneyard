/**
*	@module com/spinal/util/error/types
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/error/exception'], function(Spinal, Exception) {

	/**
	*	Factory Exception Type
	*	@namespace com.spinal.util.error.types
	*	@class com.spinal.util.error.types.FactoryException
	*	@extends com.spinal.util.error.Exception
	**/
	var FactoryException = Spinal.namespace('com.spinal.util.error.types.FactoryException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.error.types.FactoryException}
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
		*		Generic (inherited from com.spinal.util.error.exception)
		*		UnsupportedFactory
		*		UnregisteredFactory
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			UnsupportedFactory: 'Unsupported Factory Pattern',
			UnregisteredFactory: 'Factory {{id}} not found. Unable to use factory method to instanciate class.'
		}

	}));

	return FactoryException;

});
