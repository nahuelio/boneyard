/**
*	@module com.spinal.util.exception.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	Class SpecException
	*	@namespace com.spinal.util.exception.ioc
	*	@class com.spinal.util.exception.ioc.SpecException
	*	@extends com.spinal.util.exception.Exception
	*
	*	@requires com.spinal.util.exception.Exception
	**/
	var SpecException = Spinal.namespace('com.spinal.util.exception.ioc.SpecException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.spinal.util.exception.ioc.SpecException
		**/
		initialize: function() {
			return SpecException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'SpecException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		SpecNotDefined
		*		InvalidSpecFormat
		*		RequiredSpecId
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			SpecNotDefined: _.template('Spec not defined'),
			InvalidSpecFormat: _.template('Spec format is invalid.'),
			RequiredSpecId: _.template('Spec $id parameter not found.')
		}

	}));

	return SpecException;

});
