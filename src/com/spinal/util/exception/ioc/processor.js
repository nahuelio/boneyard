/**
*	@module com.spinal.util.exception.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	Class ProcessorException
	*	@namespace com.spinal.util.exception.ioc
	*	@class com.spinal.util.exception.ioc.ProcessorException
	*	@extends com.spinal.util.exception.Exception
	**/
	var ProcessorException = Spinal.namespace('com.spinal.util.exception.ioc.ProcessorException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.util.exception.ioc.ProcessorException
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
		*		Generic (inherited from com.spinal.util.exception.Exception)
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
