/**
*	@module com.spinal.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	Factory Exception Type
	*	@namespace com.spinal.util.exception
	*	@class com.spinal.util.exception.FactoryException
	*	@extends com.spinal.util.exception.Exception
	**/
	var FactoryException = Spinal.namespace('com.spinal.util.exception.FactoryException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.FactoryException}
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
		*		Generic (inherited from com.spinal.util.exception.Exception)
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
