/**
*	@module com.spinal.util.exception.ui
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['core/spinal',
		'util/exception/exception'], function(Spinal, Exception) {

	/**
	*	UI Exception Type
	*	@namespace com.spinal.util.exception.ui
	*	@class com.spinal.util.exception.ui.UIException
	*	@extends com.spinal.util.exception.Exception
	**/
	var UIException = Spinal.namespace('com.spinal.util.exception.ui.UIException', Exception.inherit({

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@return {com.spinal.util.exception.ui.UIException}
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
		*		Generic (inherited from com.spinal.util.exception.Exception)
		*		InvalidIDType
		*		SuccessorNotSpecified
		*		InvalidSuccessorType
		*		UIStackViolation
		*		InvalidModelType
		*		UnsupportedRenderMethod
		*		InvalidInterfaceType
		*	@static
		*	@property TYPES
		*	@type Object
		**/
		TYPES: {
			InvalidIDType: _.template('\'id\' parameter must be a String in the constructor.'),
			SuccessorNotSpecified: _.template('\'successor\' parameter was not speficied in the constructor.'),
			InvalidSuccessorType: _.template('\'successor\' must be an instance of com.spinal.ui.Container.'),
			UIStackViolation: _.template('UI Stack Violation found: view \'<%= viewId %>\' can not be found inside the successor specified \'<%= succesorId %>\'.'),
			InvalidModelType: _.template('\'model\' must be an instance of Backbone.Model.'),
			UnsupportedRenderMethod: _.template('unsupported render method -> \'<%= method %>\'.'),
			InvalidInterfaceType: _.template('Unsupported Interface Type Or Interface could not be resolved.'),
			InvalidMapperType: _.template('Mapper must inherit or has same interface as com.spinal.ui.form.mapper.FormMapper')
		}

	}));

	return UIException;

});
