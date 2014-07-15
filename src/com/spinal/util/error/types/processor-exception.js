/**
*	@module com/spinal/util/error/types
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/error/exception'], function(Spinal, Exception) {

	/**
	*	IoC Processor Exception Type
	*	@namespace com.spinal.util.error.types
	*	@class com.spinal.util.error.types.ProcessorException
	*	@extends com.spinal.util.error.Exception
	**/
	var ProcessorException = Spinal.namespace('com.spinal.util.error.types.ProcessorException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.error.types.ProcessorException}
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
		*		Generic (inherited from com.spinal.util.error.exception)
		*		BoneNotFound
		*		InvalidModuleDeclaration
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			BoneNotFound: 'Bone {{id}} was not found.',
			InvalidModuleDeclaration: 'Module bone {{id}} is missing required \'class\' declaration.'
		}

	}));

	return ProcessorException;

});
