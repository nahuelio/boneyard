/**
*	@module com.spinal.util.exception.util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	Factory Exception Type
	*	@namespace com.spinal.util.exception.util
	*	@class com.spinal.util.exception.util.FactoryException
	*	@extends com.spinal.util.exception.Exception
	**/
	var FactoryException = Spinal.namespace('com.spinal.util.exception.util.FactoryException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.util.FactoryException}
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
