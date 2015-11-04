/**
*	@module com.boneyard.util.exception.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/exception/exception'], function(BoneyardException) {

	/**
	*	Class ProcessorException
	*	@namespace com.boneyard.util.exception.ioc
	*	@class com.boneyard.util.exception.ioc.ProcessorException
	*	@extends com.boneyard.util.exception.BoneyardException
	*
	*	@requires com.boneyard.util.exception.BoneyardException
	**/
	var ProcessorException = Boneyard.namespace('com.boneyard.util.exception.ioc.ProcessorException',
		BoneyardException.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.boneyard.util.exception.ioc.ProcessorException
		**/
		initialize: function() {
			return ProcessorException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'ProcessorException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.boneyard.util.exception.BoneyardException)
		*		EngineRequired
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			EngineRequired: _.template('Processor requires an instance of Engine in order to work.')
		}

	}));

	return ProcessorException;

});
