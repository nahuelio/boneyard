/**
*	@module com.boneyard.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/form/controls/input'], function(Input) {

	/**
	*	Class Password
	*	@namespace com.boneyard.ui.form.controls
	*	@class com.boneyard.ui.form.controls.Password
	*	@extends com.boneyard.ui.form.controls.Input
	*
	*	@requires com.boneyard.ui.form.controls.Input
	**/
	var UIPassword = Boneyard.namespace('com.boneyard.ui.form.controls.Password', Input.inherit({

		/**
		*	Internal CSS className
		*	@public
		*	@property className
		*	@type String
		**/
		className: 'ui-password form-control',

		/**
		*	Input's default type
		*	@private
		*	@property _type
		*	@type String
		**/
		_type: Input.TYPES.password,

		/**
		*	Initialize
		*	@public
		*	@method initialize
		*	@param opts {Object} view options
		*	@return com.boneyard.ui.form.controls.Password
		**/
		initialize: function(opts) {
			UIPassword.__super__.initialize.apply(this, arguments);
			return this;
		}

	}, {

		/**
		*	@static
		*	@property NAME
		*	@type String
		**/
		NAME: 'Password'

	}));

	return UIPassword;

});
