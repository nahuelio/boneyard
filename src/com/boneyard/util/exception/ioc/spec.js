/**
*	@module com.boneyard.util.exception.ioc
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/exception/exception'], function(BoneyardException) {

	/**
	*	Class SpecException
	*	@namespace com.boneyard.util.exception.ioc
	*	@class com.boneyard.util.exception.ioc.SpecException
	*	@extends com.boneyard.util.exception.BoneyardException
	*
	*	@requires com.boneyard.util.exception.BoneyardException
	**/
	var SpecException = Boneyard.namespace('com.boneyard.util.exception.ioc.SpecException', BoneyardException.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.boneyard.util.exception.ioc.SpecException
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
		*		Generic (inherited from com.boneyard.util.exception.BoneyardException)
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
