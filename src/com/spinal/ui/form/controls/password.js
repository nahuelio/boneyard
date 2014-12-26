/**
*	@module com.spinal.ui.form.controls
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
define(['ui/form/controls/input'], function(Input) {

	/**
	*	Password Class
	*	@namespace com.spinal.ui.form.controls
	*	@class com.spinal.ui.form.controls.Password
	*	@extends com.spinal.ui.form.controls.Input
	*
	*	@requires com.spinal.ui.form.controls.Input
	**/
	var UIPassword = Spinal.namespace('com.spinal.ui.form.controls.Password', Input.inherit({

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
		*	@return {com.spinal.ui.form.controls.Password}
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
		NAME: 'UIPassword'

	}));

	return UIPassword;

});
