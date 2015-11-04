/**
*	@module com.boneyard.util.exception.ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['util/exception/exception'], function(BoneyardException) {

	/**
	*	Class UIException
	*	@namespace com.boneyard.util.exception.ui
	*	@class com.boneyard.util.exception.ui.UIException
	*	@extends com.boneyard.util.exception.BoneyardException
	*
	*	@requires com.boneyard.util.exception.BoneyardException
	**/
	var UIException = Boneyard.namespace('com.boneyard.util.exception.ui.UIException', BoneyardException.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return com.boneyard.util.exception.ui.UIException
		**/
		initialize: function() {
			return UIException.__super__.initialize.apply(this, arguments);
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'UIException',

		/**
		*	__Type List__
		*
		*		Generic (inherited from com.boneyard.util.exception.BoneyardException)
		*		InvalidIDType
		*		SuccessorNotSpecified
		*		InvalidSuccessorType
		*		UIStackViolation
		*		InvalidModelType
		*		UnsupportedRenderMethod
		*		InvalidInterfaceType
		*		InvalidMapperType
		*		InvalidValidatorType
		*		InvalidTemplateFormat
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			InvalidIDType: _.template('\'id\' parameter must be a String in the constructor.'),
			SuccessorNotSpecified: _.template('\'successor\' parameter was not speficied in the constructor.'),
			InvalidSuccessorType: _.template('\'successor\' must be an instance of com.boneyard.ui.Container.'),
			UIStackViolation: _.template('UI Stack Violation found: view \'<%= viewId %>\' can not be found inside the successor specified \'<%= succesorId %>\'.'),
			InvalidModelType: _.template('\'model\' must be an instance of Backbone.Model.'),
			UnsupportedRenderMethod: _.template('unsupported render method -> \'<%= method %>\'.'),
			InvalidInterfaceType: _.template('Unsupported Interface Type Or Interface could not be resolved.'),
			InvalidMapperType: _.template('Mapper must be an instance or inherit from com.boneyard.ui.form.mapper.FormMapper'),
			InvalidValidatorType: _.template('Validator must be an instance of inherit from com.boneyard.ui.form.validator.Validator'),
			InvalidTemplateFormat: _.template('Template must be a String in order to work.')
		}

	}));

	return UIException;

});
